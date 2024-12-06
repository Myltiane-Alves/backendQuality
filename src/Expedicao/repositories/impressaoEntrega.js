
import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getImpressaoEntrega = async (idResumoOT,  pageSize, page) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                rot.IDEMPRESADESTINO, 
                rot.IDRESUMOOT, 
                rot.NUMERONOTASEFAZ, 
                rot.MSGSEFAZ, 
                rot.CODIGORETORNOSEFAZ, 
                rot.NUTOTALVOLUMES,
            (SELECT IFNULL(NOFANTASIA, '') FROM "${databaseSchema}".EMPRESA WHERE IDEMPRESA = rot.IDEMPRESADESTINO) AS EMPRESADESTINO 
                FROM "${databaseSchema}".RESUMOORDEMTRANSFERENCIA rot 
            WHERE 1 = 1 
      `;
        const params = [1];

        if (idResumoOT) {
            query += 'AND IDRESUMOOT = ? ';
            params.push(idResumoOT);
        }
        
        query += 'ORDER BY rot.IDEMPRESADESTINO';

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
        console.error('Erro ao executar consulta Impressão entrega', error);
        throw error;
    }
};