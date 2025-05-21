import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getCaixasFechadosNaoConferidos = async (idEmpresa, page, pageSize) => {
    try {
   
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                T1.ID,
                TO_VARCHAR(T1.DTFECHAMENTO, 'DD-MM-YYYY') AS DTHORAFECHAMENTO,
                TO_VARCHAR(T1.DTABERTURA, 'DD-MM-YYYY') AS DTHORAABERTURA,
                TO_VARCHAR(T1.DTFECHAMENTO, 'YYYY-MM-DD') AS DTFECHAMENTO,
                TO_VARCHAR(T1.DTABERTURA, 'YYYY-MM-DD') AS DTABERTURA,
                T2.DSCAIXA
            FROM 
                "${databaseSchema}".MOVIMENTOCAIXA T1
            INNER JOIN 
                "${databaseSchema}".CAIXA T2 ON T1.IDCAIXA = T2.IDCAIXAWEB
            WHERE 
                1 = ?
                AND T1.STFECHADO = 'True'
                AND T1.STCONFERIDO = false
                AND T1.DTFECHAMENTO >= '2021-04-15 00:00:00'
        `;

        const params = [1];


        if (idEmpresa > 0) {
            query += ' AND T1.IDEMPRESA = ? ';
            params.push(idEmpresa);
        }

        
        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        
        return {
            data: result,
            page,
            pageSize,
            rows: result.length
        };

    } catch (error) {
        console.error('Erro ao executar a consulta Caixas Fechados Não Conferidos:', error);
        throw error;
    }
};
