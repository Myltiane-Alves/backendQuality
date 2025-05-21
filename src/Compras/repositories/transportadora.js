import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const geTransportadora = async (idMarca, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT A."IDTRANSPORTADORA", A."NOFANTASIA", A."NUCNPJ" FROM "${databaseSchema}"."TRANSPORTADORA" A WHERE 1=?
        `;

        const params = [1];

        if (idMarca) {
            query += ' And A."ID_MARCA" = ? ';
            params.push(idMarca);
        }
    
        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);
        

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consultar Transportadoras:', error);
        throw error;
    }
}