import conn from "../../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
const databaseSchemaSBO = process.env.HANA_DATABASE_SBO;

export const getConsultaFornecedorSap = async (byId, descFornecedor, cnpjFornecedor, cnpjFornecedorSemFormatar, page, pageSize) => {
    try {
        
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT "CardCode" FROM "${databaseSchemaSBO}".OCRD WHERE 1 = ?
            AND ("CardName" LIKE '%${descFornecedor}%' OR "LicTradNum" = '${cnpjFornecedor}' OR "LicTradNum" = '${cnpjFornecedorSemFormatar}')`;


        const params = [1];      

        if(byId) {
            query += ' AND "CardCode" = ?';
            params.push(byId);
        }

        query += 'ORDER BY a."Code" DESC';

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        
        
        return {
            page,
            pageSize,
            rows: rows.length,
            data: rows,
        };
    } catch (error) {
        console.error('Erro ao executar a consulta fornecedor sap:', error);
        throw error;
    }
};