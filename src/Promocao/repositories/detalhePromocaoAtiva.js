import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalhePromocaoAtiva = async (idResumoPromocao) =>  {
    try {

        let query = `
            SELECT 
                IDDETALHEPROMO,
                IDRESUMOPROMO, 
                IDPRODUTO 
            FROM ${databaseSchema}.DETALHEPROMOCAO
            WHERE 
                1 = 1

        `;

        const params = [];

        if (idResumoPromocao) {
            query += ` AND IDRESUMOPROMO = ?`;
            params.push(idResumoPromocao);
        }


        query += ` ORDER BY IDDETALHEPROMO DESC`;
      

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
        console.log('Erro ao consultar Promoções Ativas', error);
    }
}