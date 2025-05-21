import conn from "../../../config/dbConnection.js";
import 'dotenv/config';

const databaseSchema = process.env.HANA_DATABASE;

export const getDescontoMotivoVendas = async (
    idEmpresa, 
    idMarca, 
    dsMotivoDesconto, 
    dataPesquisaInicio, 
    dataPesquisaFim, 
    page = 1, 
    pageSize = 1000
) => {
    try {
        // Validação básica dos parâmetros
        page = parseInt(page) || 1;
        pageSize = parseInt(pageSize) || 1000;

        let query = `
            SELECT
                FC.NOLOGIN AS MATOPERADORFECHAMENTO,
                FC.NOFUNCIONARIO AS OPERADORFECHAMENTO, 
                E.NOFANTASIA, 
                V.IDVENDA,
                V.VRRECCONVENIO,
                IFNULL(F.NUCPF, null) as NUCPF,
                V.DEST_CPF,
                V.IDEMPRESA, 
                CASE
                    WHEN VRRECCONVENIO > 0 THEN 'Convenio Funcionario'
                    ELSE TO_VARCHAR(V.TXTMOTIVODESCONTO) 
                END AS TXTMOTIVODESCONTO, 
                TO_DECIMAL(V.VRTOTALPAGO,12,2) as VRTOTALPAGO, 
                TO_VARCHAR(V.DTHORAFECHAMENTO, 'DD-MM-YYYY HH24:MI:SS') AS DTHORAFECHAMENTO, 
                TO_DECIMAL(V.NFE_INFNFE_TOTAL_ICMSTOT_VPROD,12,2) as ValorTotalProdutoBruto,
                TO_DECIMAL(V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC,12,2) as VrDesconto, 
                TO_DECIMAL(V.NFE_INFNFE_TOTAL_ICMSTOT_VNF,12,2) as TotalLiquido 
            FROM
                "${databaseSchema}"."VENDA" V 
        `;

        const params = [1];

        if (dsMotivoDesconto === 'Desconto efetuado por Colaborador CPF' || !dsMotivoDesconto || 
            (dsMotivoDesconto !== 'Desconto Funcionario' && dsMotivoDesconto !== 'Convenio')) {
            query += ` LEFT JOIN "${databaseSchema}".FUNCIONARIO F ON V.DEST_CPF = F.NUCPF`;
        }

        if (dsMotivoDesconto === 'Desconto Funcionario' || dsMotivoDesconto === 'Convenio') {
            query += ` LEFT JOIN (SELECT * FROM "${databaseSchema}".FUNCIONARIO LIMIT 1 ) F ON V.DEST_CPF IN (F.NUCPF)`;
        }

        query += `
            LEFT JOIN "${databaseSchema}".FUNCIONARIO FC ON 
                V.IDOPERADOR = FC.IDFUNCIONARIO
            INNER JOIN "${databaseSchema}".EMPRESA E ON 
                E.IDEMPRESA = V.IDEMPRESA  
            WHERE 
                1 = ?
                AND V."NFE_INFNFE_TOTAL_ICMSTOT_VDESC" > 0 
                AND V."STCANCELADO" = 'False' 
        `;

        if (idEmpresa > 0) {
            query += ' AND V.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if (idMarca > 0) {
            query += ' AND E.IDGRUPOEMPRESARIAL = ?';
            params.push(idMarca);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (V.DTHORAFECHAMENTO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if (dsMotivoDesconto && dsMotivoDesconto !== 'Outros' && dsMotivoDesconto !== 'Convenio' && 
            dsMotivoDesconto !== 'Desconto Funcionario' && dsMotivoDesconto !== 'Desconto efetuado por Colaborador CPF') {
            query += ` AND TO_VARCHAR(V.TXTMOTIVODESCONTO) LIKE ? AND (V.VRRECCONVENIO IS NULL OR V.VRRECCONVENIO = 0)`;
            params.push(`%${dsMotivoDesconto}%`);
        }

        if (dsMotivoDesconto === 'Desconto efetuado por Colaborador CPF') {
            query += `  
                AND TO_VARCHAR(V.TXTMOTIVODESCONTO) LIKE ? 
                AND (V.VRRECCONVENIO IS NULL OR V.VRRECCONVENIO = 0)
                AND F.NUCPF IS NULL
            `;
            params.push('Desconto efetuado por Colaborador%');
        }

        if (dsMotivoDesconto === 'Convenio') {
            query += ` AND (V.VRRECCONVENIO > 0 OR V.VRRECCONVENIO IS NULL)`;
        }

        if (dsMotivoDesconto === 'Desconto Funcionario') {
            query += ` 
                AND (V.VRRECCONVENIO IS NULL OR V.VRRECCONVENIO = 0) 
                AND TO_VARCHAR(V.TXTMOTIVODESCONTO) LIKE ?
            `;
            params.push('Desconto efetuado por Colaborador%');
        }

        if (dsMotivoDesconto === 'Outros') {
            query += ` 
                AND TO_VARCHAR(V.TXTMOTIVODESCONTO) NOT LIKE ? 
                AND TO_VARCHAR(V.TXTMOTIVODESCONTO) NOT LIKE ? 
                AND TO_VARCHAR(V.TXTMOTIVODESCONTO) NOT LIKE ? 
                AND TO_VARCHAR(V.TXTMOTIVODESCONTO) NOT LIKE ? 
                AND TO_VARCHAR(V.TXTMOTIVODESCONTO) NOT LIKE ? 
                AND TO_VARCHAR(V.TXTMOTIVODesconto) NOT LIKE ? 
                AND (V.VRRECCONVENIO IS NULL OR V.VRRECCONVENIO = 0)
            `;
            params.push('Ação Comercial%', 'Alçada Gerente%', 'Cartão PL - Ativação Novos%', 'Produtos - Defeitos%', 'Produtos - Divergência de Preço%', 'Desconto efetuado por Colaborador%');
        }

        query += ' ORDER BY V.IDEMPRESA, V.DTHORAFECHAMENTO ';
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, (page - 1) * pageSize);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        const data = result.map(registro => {
            let tipoDesconto = '';

            if (Number(registro.VRRECCONVENIO)) {
                tipoDesconto = 'Desconto Convenio Por Colaborador';
            } else if (registro.TXTMOTIVODESCONTO.includes('Desconto efetuado por Colaborador') && !Number(registro.VRRECCONVENIO) && !registro.NUCPF) {
                tipoDesconto = 'Desconto efetuado por Colaborador';
            } else if (registro.TXTMOTIVODESCONTO.includes('Desconto efetuado por Colaborador') && !Number(registro.VRRECCONVENIO) && registro.NUCPF) {
                tipoDesconto = 'Desconto Funcionario';
            } else if (registro.TXTMOTIVODESCONTO.includes('Ação Comercial') && !Number(registro.VRRECCONVENIO)) {
                tipoDesconto = 'Ação Comercial';
            } else if (registro.TXTMOTIVODESCONTO.includes('Alçada Gerente') && !Number(registro.VRRECCONVENIO)) {
                tipoDesconto = 'Alçada Gerente';
            } else if (registro.TXTMOTIVODESCONTO.includes('Cartão PL - Ativação Novos') && !Number(registro.VRRECCONVENIO)) {
                tipoDesconto = 'Cartão PL - Ativação Novos';
            } else if (registro.TXTMOTIVODESCONTO.includes('Produtos - Defeitos') && !Number(registro.VRRECCONVENIO)) {
                tipoDesconto = 'Produtos - Defeitos';
            } else if (registro.TXTMOTIVODESCONTO.includes('Produtos - Divergência de Preço') && !Number(registro.VRRECCONVENIO)) {
                tipoDesconto = 'Produtos - Divergência de Preço';
            } else {
                tipoDesconto = 'Outros';
            }

            return {
                IDVENDA: registro.IDVENDA,
                MATOPERADORFECHAMENTO: registro.MATOPERADORFECHAMENTO,
                OPERADORFECHAMENTO: registro.OPERADORFECHAMENTO,
                NOFANTASIA: registro.NOFANTASIA,
                IDEMPRESA: registro.IDEMPRESA,
                TIPODESCONTO: tipoDesconto,
                TXTMOTIVODESCONTO: registro.TXTMOTIVODESCONTO,
                VRTOTALPAGO: registro.VRTOTALPAGO,
                DTHORAFECHAMENTO: registro.DTHORAFECHAMENTO,
                VALORTOTALPRODUTOBRUTO: registro.VALORTOTALPRODUTOBRUTO,
                VRDESCONTO: registro.VRDESCONTO,
                TOTALLIQUIDO: registro.TOTALLIQUIDO
            };
        });

        return {
            page,
            pageSize,
            rows: result.length,
            data
        };

    } catch (error) {
        throw new Error(`Erro ao buscar dados: ${error.message}`);
    }
};