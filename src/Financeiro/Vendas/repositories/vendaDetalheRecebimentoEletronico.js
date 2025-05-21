import conn from '../../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getVendaDetalheRecebimentoEletronico = async (idEmpresa, dataPesquisaInicio, dataPesquisaFim, nomeTef, nomeAutorizador, numeroParcelas, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
        
        let query = `
            SELECT
                UPPER(tbvp.DSTIPOPAGAMENTO) AS DSTIPOPAGAMENTO,
                tbvp.NOCARTAO,
                tbvp.NUOPERACAO,
                tbvp.NOTEF,
                tbvp.NSUTEF,
                tbvp.NOAUTORIZADOR,
                IFNULL(tbvp.NUAUTORIZACAO, 'NÃO INFORMADO') AS NUAUTORIZACAO,
                tbvp.NSUAUTORIZADORA,
                IFNULL(TO_VARCHAR(tbv.DTHORAFECHAMENTO, 'DD/mm/YYYY'), 'NÃO INFORMADO') AS DTHORAFECHAMENTO,
                IFNULL(tbvp.NPARCELAS, 0) AS NPARCELAS,
                IFNULL(SUM(tbvp.VALORRECEBIDO) OVER (PARTITION BY tbv.IDVENDA), 0) AS VALORRECEBIDOTOTAL,
                IFNULL(tbvp.VALORRECEBIDO, 0) AS VALORRECEBIDO,
                tbv.IDVENDA
            FROM
                "${databaseSchema}".VENDAPAGAMENTO tbvp
                INNER JOIN "${databaseSchema}".VENDA tbv ON tbvp.IDVENDA = tbv.IDVENDA
                INNER JOIN "${databaseSchema}".EMPRESA tbe ON tbe.IDEMPRESA = tbv.IDEMPRESA
            WHERE
                1 = ?
                AND tbv.STCANCELADO = 'False'
                AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL)
                AND (tbvp.NOTEF = 'POS' OR tbvp.NOTEF = 'TEF')
        `;

        const params = [1];

        if (idEmpresa) {
            query += ' AND tbv.IDEMPRESA = ? ';
            params.push(idEmpresa);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND tbv.DTHORAFECHAMENTO BETWEEN ? AND ? ';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if (nomeTef) {
            query += ' AND tbvp.NOTEF = ? ';
            params.push(nomeTef);
        }
        
        if (nomeAutorizador) {
            query += ' AND tbvp.NOAUTORIZADOR = ? ';
            params.push(nomeAutorizador);
        }

        if (numeroParcelas > 0) {
            query += ' AND tbvp.NPARCELAS = ? ';
            params.push(numeroParcelas);
        } else {
            query += ' AND (tbvp.NPARCELAS IS NULL OR tbvp.NPARCELAS = 0) ';
        }
     
        query += ` LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
        
        const statement = conn.prepare(query);
        const result = await statement.exec(params);

        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (e) {
        throw new Error(e.message);
    }
};