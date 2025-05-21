import conn from '../../../config/dbConnection.js';
import 'dotenv/config';

const databaseSchema = process.env.HANA_DATABASE;

export const getVendaTotalMes = async (dataPesquisaInicio, dataPesquisaFim, horaFinal, page, pageSize) => {
    try {

        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        const offset = (page - 1) * pageSize;


        let query = `SELECT 
            IFNULL(SUM(tbv.VRRECDINHEIRO + tbv.VRRECCARTAO + tbv.VRRECPOS + tbv.VRRECCONVENIO), 0) AS VALORTOTALMES 
            FROM 
            "${databaseSchema}".VENDA tbv 
            WHERE 
            1 = ? 
            AND tbv.STCANCELADO = 'False'
        `;

  
        const params = [1];
        
        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} ${horaFinal}`);
        }

        query += ` LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
        const statement = conn.prepare(query);
        const result = await statement.execute(params);

        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (e) {
        console.error('Erro ao executar a consulta de vendas:', e);
        throw new Error('Erro ao executar a consulta de vendas');
    } 
};
