
import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getStatusOrdemTransferencia = async (idStatusOT,  pageSize, page) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

     
        var query = `SELECT IDSTATUSOT, DESCRICAOOT FROM "${databaseSchema}".STATUSORDEMTRANSFERENCIA WHERE 1 = ? `;

        const params = [1];

        if (idStatusOT) {
            query += 'AND IDSTATUSOT = ? ';
            params.push(idStatusOT);
        }

        const offset = (page - 1) * pageSize;
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
    } catch (error) {
        console.error('Erro ao executar consulta Status Ordem Transferencia', error);
        throw error;
    }
};