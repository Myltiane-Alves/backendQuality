import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalheEmpresaPromocaoAtiva = async (idResumoPromocao) =>  {
    try {

        let query = `
            SELECT 
            IDEMPRESAPROMOCAOMARKETING, 
            IDRESUMOPROMOCAOMARKETING, 
            IDEMPRESA, 
            STATIVO
        FROM "VAR_DB_NAME".EMPRESAPROMOCAOMARKETING
        WHERE IDRESUMOPROMOCAOMARKETING = ?

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