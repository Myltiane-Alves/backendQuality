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
        FROM ${databaseSchema}.EMPRESAPROMOCAOMARKETING
        WHERE IDRESUMOPROMOCAOMARKETING = ?

        `;

        const params = [idResumoPromocao];

        query += ` ORDER BY  IDRESUMOPROMOCAOMARKETING`;
    
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