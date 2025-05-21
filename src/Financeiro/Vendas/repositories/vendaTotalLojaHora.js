import conn from '../../../config/dbConnection.js';
import 'dotenv/config';

const databaseSchema = process.env.HANA_DATABASE;

export const getVendaTotalLojaHora = async (dataPesquisa, horaFinal, page, pageSize) => {
    try {

        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        const offset = (page - 1) * pageSize;

        let query = `
            SELECT 
                IFNULL(SUM(tbv.VRRECDINHEIRO), 0) AS VALORTOTALDINHEIRO,
                IFNULL(SUM(tbv.VRRECCARTAO), 0) AS VALORTOTALCARTAO,
                IFNULL(SUM(tbv.VRRECCONVENIO), 0) AS VALORTOTALCONVENIO,
                IFNULL(SUM(tbv.VRRECPOS), 0) AS VALORTOTALPOS,
                IFNULL(SUM(tbv.VRRECVOUCHER), 0) AS VALORTOTALVOUCHER,
                (SELECT IFNULL(SUM(tbdf.VRRECEBIDO), 0) 
                FROM "${databaseSchema}".DETALHEFATURA tbdf 
                WHERE tbdf.DTPROCESSAMENTO = '${dataPesquisa}' 
                AND tbdf.HRPROCESSAMENTO >= '00:00:00' 
                AND tbdf.HRPROCESSAMENTO <= '${horaFinal}' 
                AND tbdf.STCANCELADO = 'False') AS VALORTOTALFATURA 
            FROM 
                "${databaseSchema}".VENDA tbv 
            WHERE 
                1 = ? 
            AND tbv.STCANCELADO = 'False'
        `;

  
        const params = [1];
        
        if (dataPesquisa) {
            query += ' AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)';
            params.push(`${dataPesquisa} 00:00:00`, `${dataPesquisa} ${horaFinal}`);
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
        console.error('Erro ao executar a consulta de Vendas total loja Hora:', e);
        throw new Error(e);
    } 
};
