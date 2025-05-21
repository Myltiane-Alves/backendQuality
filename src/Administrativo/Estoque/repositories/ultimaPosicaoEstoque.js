import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
const databaseSchemaSBO = process.env.HANA_DATABASE_SBO;

export const getUltimaPosicaoEstoque = async (
    idEmpresa,
    idGrupo,
    idSubGrupo,
    idMarca,
    idFornecedor,
    descricaoProduto,
    stAtivo,
    STNegativo,
    dataPesquisaInicio,
    dataPesquisaFim,
    page,
    pageSize
) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT
                T.IDINVMOVIMENTO,
                T.IDPRODUTO,
                T2.DSNOME AS DSPRODUTO,
                T2.NUCODBARRAS,
                IFNULL(T2.UND,(SELECT "SalUnitMsr" FROM ${databaseSchemaSBO}.OITM WHERE "ItemCode" = T.IDPRODUTO)) AS UND,
                ( CASE WHEN IFNULL(T2.PRECOCUSTO, 0) = 0 THEN 1 ELSE T2.PRECOCUSTO END ) AS PRECOCUSTO,
                TO_DECIMAL(IFNULL(TBPP.PRECO_VENDA, 0), 10, 2) AS PRECOVENDA,
                T.IDEMPRESA,
                TBE.NOFANTASIA,
                T.QTDFINAL,
                T.DTMOVIMENTO,
                TO_VARCHAR(T.DTMOVIMENTO, 'DD/MM/YYYY HH24:MI:SS') AS DTMOVIMENTOFORMATADO
            FROM
                (
                SELECT
                    FIRST_VALUE(TBI.IDINVMOVIMENTO ORDER BY TBI.DTMOVIMENTO DESC) AS IDINVMOVIMENTO
                FROM
                    "${databaseSchema}".INVENTARIOMOVIMENTO TBI
                INNER JOIN "${databaseSchema}".EMPRESA e ON e.IDEMPRESA = TBI.IDEMPRESA
    `;

        const params = [];

        if (idEmpresa) {
            if (idEmpresa === '101') {
                query +=  ` LEFT JOIN "${databaseSchema}".VW_PRODUTO p ON p.IDPRODUTO = TBI.IDPRODUTO` ;
            } else {
                query +=  ` LEFT JOIN "${databaseSchema}".VW_PRODUTO p ON p.IDPRODUTO = TBI.IDPRODUTO AND p.IDGRUPOEMPRESARIAL = e.IDGRUPOEMPRESARIAL`;
            }
        } else {
            query += ` LEFT JOIN "${databaseSchema}".VW_PRODUTO p ON p.IDPRODUTO = TBI.IDPRODUTO AND p.IDGRUPOEMPRESARIAL = e.IDGRUPOEMPRESARIAL `;
        }

        query += `
            LEFT JOIN "${databaseSchema}".PRODUTO pp ON pp.IDPRODUTO = TBI.IDPRODUTO
            LEFT JOIN "${databaseSchema}".PRODUTO_PRECO pr ON pr.IDPRODUTO = TBI.IDPRODUTO AND pr.IDEMPRESA = TBI.IDEMPRESA
            WHERE 1 = 1
        `;

        if (idEmpresa) {
            query += 'AND TBI.IDEMPRESA = ? ';
            params.push(idEmpresa);
        }

        if (idGrupo) {
            const listarIdGrupo = idGrupo.split(',');
            let descGrupo = '';
            let listarDescGrupo = '';

            for (let i = 0; i < listarIdGrupo.length; i++) {
                switch (listarIdGrupo[i]) {
                    case '1':
                        descGrupo = 'Verão';
                        break;
                    case '2':
                        descGrupo = 'Calçados/Acessórios';
                        break;
                    case '3':
                        descGrupo = 'Cama/Mesa/Banho';
                        break;
                    case '4':
                        descGrupo = 'Utilidades Do Lar';
                        break;
                    case '5':
                        descGrupo = 'Diversos';
                        break;
                    case '6':
                        descGrupo = 'Artigos Esportivos';
                        break;
                    case '7':
                        descGrupo = 'Cosméticos';
                        break;
                    case '8':
                        descGrupo = 'Acessórios';
                        break;
                    case '9':
                        descGrupo = 'Peças Íntimas';
                        break;
                    case '10':
                        descGrupo = 'Inverno';
                        break;
                }

                listarDescGrupo += i === 0 ? `'${descGrupo}'` : `,'${descGrupo}'`;
            }
            query += `AND p.GRUPO IN (${listarDescGrupo}) `;
        }

        if (idSubGrupo) {
            query += 'AND p.IDSUBGRUPO IN (?) ';
            params.push(idSubGrupo);
        }

        if (idMarca) {
            query += 'AND p.IDMARCA IN (?) ';
            params.push(idMarca);
        }

        if (idFornecedor) {
            query += 'AND p.IDRAZAO_SOCIAL_FORNECEDOR IN (?) ';
            params.push(idFornecedor);
        }

        if (descricaoProduto) {
            query += 'AND (UPPER(pp.DSNOME) LIKE UPPER(?) OR pp.NUCODBARRAS LIKE ?) ';
            params.push(`%${descricaoProduto}%`, `%${descricaoProduto}%`);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += 'AND TBI.DTMOVIMENTO BETWEEN ? AND ? ';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if (stAtivo) {
            query += 'AND TBI.STATIVO = ? ';
            params.push(stAtivo);
        }

        query += `
            GROUP BY
                TBI.IDPRODUTO,
                TBI.IDEMPRESA
            ) AS R
            INNER JOIN "${databaseSchema}".INVENTARIOMOVIMENTO AS T ON
                T.IDINVMOVIMENTO  = R.IDINVMOVIMENTO
            INNER JOIN "${databaseSchema}".PRODUTO AS T2 ON
                T2.IDPRODUTO = T.IDPRODUTO
            INNER JOIN "${databaseSchema}".EMPRESA TBE ON 
                TBE.IDEMPRESA = T.IDEMPRESA
            LEFT JOIN "${databaseSchema}".PRODUTO_PRECO TBPP ON TBPP.IDPRODUTO = T.IDPRODUTO AND TBPP.IDEMPRESA = TBE.IDEMPRESA
            ORDER BY T.IDEMPRESA ASC, T.IDPRODUTO ASC, T.DTMOVIMENTO DESC 
        `;

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ? ';
        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);
        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao executar a consulta Inventario Movimento:', error);
        throw error;
    }
};
