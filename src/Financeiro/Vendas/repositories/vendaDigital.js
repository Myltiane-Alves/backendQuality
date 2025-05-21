import conn from '../../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;


export const getVendaDigital = async (idVenda, idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        const offset = (page - 1) * pageSize;

        let query = `
            SELECT DISTINCT 
                tbe.NUCNPJ,
                tbe.NOFANTASIA,
                tbv.IDVENDA,
                tbvd.IDVENDADETALHE AS CTRVENDA,
                tbf.NOFUNCIONARIO,
                tbp.DSNOME,
                tbvd.QTD,
                tbvd.VRTOTALLIQUIDO,
                TO_VARCHAR(tbv.DTHORAFECHAMENTO, 'DD/mm/YYYY HH24:MI:SS') AS DTHORAFECHAMENTOFORMATADA 
            FROM 
                "${databaseSchema}".VENDA tbv
                INNER JOIN "${databaseSchema}".VENDADETALHE tbvd on tbvd.IDVENDA = tbv.IDVENDA
                INNER JOIN "${databaseSchema}".PRODUTO tbp on tbp.IDPRODUTO = tbvd.CPROD
                INNER JOIN "${databaseSchema}".EMPRESA tbe on tbe.IDEMPRESA = tbv.IDEMPRESA
                INNER JOIN "${databaseSchema}".FUNCIONARIO tbf on tbf.IDFUNCIONARIO = tbvd.VENDEDOR_MATRICULA
            WHERE 
                1 = ?
                AND tbv.STCANCELADO = 'False'
                AND tbvd.STVENDIGITAL = 'True'

        `;

        const params = [1];

        if (idVenda) {
            query += ' AND tbv.IDVENDA = ?';
            params.push(idVenda);
        }

        if (idEmpresa > 0) {
            query += ' AND tbv.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (e) {
        console.error('Erro ao executar a consulta de vendas:', e);
        throw new Error('Erro interno ao processar a requisição.');
    }
};
