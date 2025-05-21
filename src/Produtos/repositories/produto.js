import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;


export const getProdutos = async (idEmpresa, idProduto, descProduto, codBarras, ufNcm, dataPesquisa, page, pageSize) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
        
        let query = `
            SELECT DISTINCT
                tbp.IDPRODUTO,
                tbp.IDGRUPOEMPRESARIAL,
                tbp.NUNCM,
                tbp.NUCEST,
                tbp.NUCST_ICMS,
                tbp.NUCFOP,
                tbp.PERC_OUT,
                tbp.NUCODBARRAS,
                tbp.DSNOME,
                tbp.STGRADE,
                tbp.UND,
                (CASE WHEN IFNULL(tbp.PRECOCUSTO, 0) = 0 THEN 1 ELSE tbp.PRECOCUSTO END) AS PRECOCUSTO,
                (CASE WHEN IFNULL(tbpp.PRECO_VENDA, 0) = 0 THEN tbp.PRECOVENDA ELSE tbpp.PRECO_VENDA END) AS PRECOVENDA,
                tbp.QTDENTRADA,
                tbp.QTDCOMERCIALIZADA,
                tbp.QTDPERDA,
                tbp.QTDDISPONIVEL,
                (tbn.ImpEstadual * 10) AS PERCICMS,
                tbp.PERCISS,
                tbp.PERCPIS,
                tbp.PERCCOFINS,
                tbp.COD_CSOSN,
                tbp.PERCCSOSC,
                tbp.NUCST_IPI,
                tbp.NUCST_PIS,
                tbp.NUCST_COFINS,
                tbp.PERCIPI,
                TO_VARCHAR(tbp.DTULTALTERACAO, 'YYYY-MM-DD HH24:MI:SS') AS DTULTALTERACAO,
                tbp.STPESAVEL,
                tbp.GRP_MATERIAIS,
                (tbn.ImpEstadual * 10) AS PerICMS,
                TBPEM."GRUPO",
                TBPEM."IDSUBGRUPO",
                TBPEM."SUBGRUPO",
                TBPEM."IDMARCA",
                TBPEM."MARCA",
                TBPEM."IDRAZAO_SOCIAL_FORNECEDOR",
                TBPEM."RAZAO_SOCIAL_FORNECEDOR"
            FROM
                "${databaseSchema}".EMPRESA tbe
         
        `;

        const params = [];

        if(idEmpresa == 31 || idEmpresa == 51 || idEmpresa == 67 || idEmpresa == 89 || idEmpresa == 76 || idEmpresa == 109 || idEmpresa == 56 || idEmpresa == 90 || idEmpresa == 68 || idEmpresa == 70 || idEmpresa == 5 || idEmpresa == 86 || idEmpresa == 16 || idEmpresa == 116){
            if(idEmpresa == 31 || idEmpresa == 109 || idEmpresa == 51 || idEmpresa == 67 || idEmpresa == 89 || idEmpresa == 76 || idEmpresa == 116){
                query +=  `  INNER JOIN "${databaseSchema}".PRODUTO tbp on tbe.IDGRUPOEMPRESARIAL = tbp.IDGRUPOEMPRESARIAL OR tbp.IDGRUPOEMPRESARIAL IS NULL OR tbp.IDGRUPOEMPRESARIAL = 0 OR tbp.IDGRUPOEMPRESARIAL = 1 OR tbp.IDGRUPOEMPRESARIAL = 2 `;
            }else if(idEmpresa == 90 || idEmpresa == 56 || idEmpresa == 68 || idEmpresa == 5 || idEmpresa == 86) {    
                query += `   INNER JOIN "${databaseSchema}".PRODUTO tbp on tbe.IDGRUPOEMPRESARIAL = tbp.IDGRUPOEMPRESARIAL OR tbp.IDGRUPOEMPRESARIAL IS NULL OR tbp.IDGRUPOEMPRESARIAL = 0 OR tbp.IDGRUPOEMPRESARIAL = 1 OR tbp.IDGRUPOEMPRESARIAL = 4 `;
            }else if(idEmpresa == 70 || idEmpresa == 16) {    
                query += `   INNER JOIN "${databaseSchema}".PRODUTO tbp on tbe.IDGRUPOEMPRESARIAL = tbp.IDGRUPOEMPRESARIAL OR tbp.IDGRUPOEMPRESARIAL IS NULL OR tbp.IDGRUPOEMPRESARIAL = 0 OR tbp.IDGRUPOEMPRESARIAL = 1 OR tbp.IDGRUPOEMPRESARIAL = 2 OR tbp.IDGRUPOEMPRESARIAL = 4 `;
            }else{
                query += `   INNER JOIN "${databaseSchema}".PRODUTO tbp on (tbe.IDGRUPOEMPRESARIAL = tbp.IDGRUPOEMPRESARIAL OR tbp.IDGRUPOEMPRESARIAL IS NULL OR tbp.IDGRUPOEMPRESARIAL = 0 OR tbp.IDGRUPOEMPRESARIAL = 1 )`;
            }
        }else{
            query += `  INNER JOIN "${databaseSchema}".PRODUTO tbp on tbe.IDGRUPOEMPRESARIAL = tbp.IDGRUPOEMPRESARIAL OR tbp.IDGRUPOEMPRESARIAL IS NULL OR tbp.IDGRUPOEMPRESARIAL = 0 `;
        }
       
        query += `
            INNER JOIN "${databaseSchema}".NCM tbn on tbp.NUNCM = tbn.NUNCM AND tbe.SGUF = tbn.SGUF
            LEFT JOIN "${databaseSchema}".PRODUTO_PRECO tbpp on tbpp.IDPRODUTO = tbp.IDPRODUTO AND tbpp.IDEMPRESA = '${idEmpresa}'
            INNER JOIN "${databaseSchema}".VW_PRODUTO_ESTRUTURA_MERCADOLOGICA TBPEM on TBPEM.IDPRODUTO = tbp.IDPRODUTO
        WHERE
            1 = ?
        
            AND tbp.STATIVO = 'True'
        `;


        if (idEmpresa) {
            query += ` AND tbe.IDEMPRESA = ?`;
            params.push(idEmpresa);
        }

        if (idProduto) {
            query += ` AND tbp.IDPRODUTO = ?`;
            params.push(idProduto);
        }

        if(dataPesquisa){
            query += ` AND tbp.DTULTALTERACAO >= ?`;
            params.push(`${dataPesquisa} 00:00:00`);
        }

        if (codBarras) {
            query += ` AND tbp.NUCODBARRAS = ?`;
            params.push(codBarras);
        }

        if (descProduto)  {
            query += `AND CONTAINS((tbp.IDPRODUTO, tbp.DSNOME, tbp.NUCODBARRAS), '%${descProduto}%') `;
        }

        if(ufNcm){
            query += ` AND UPPER(tbn.SGUF) = ? `;
            params.push(ufNcm);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        query =+ ' ORDER BY tbp.IDPRODUTO';
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (error) {
        console.error('Error executar a consulta produto ', error);
        throw error;
    }
};
