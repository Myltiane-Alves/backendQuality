import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getParceiroNegocio = async (idParceiro, page, pageSize) =>  {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT DISTINCT
                tbps.IDPN,
                tbps.PN
            FROM 
                "${databaseSchema}".PRODUTOSAP tbps
            WHERE 
                1 = 1
        `;
        
        const params = [];

        if (idParceiro) {
            query += ` AND tbps.IDPN = ?`;
            params.push(idParceiro);
        }

        query += `group by tbps.IDPN, tbps.PN order by tbps.IDPN`;

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
        console.log('Erro ao consultar parceiro de negócio:', error);
    }
}
