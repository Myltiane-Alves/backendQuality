import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getPendenciasMalotes = async (
    idEmpresa,
    idMalote,
    statusMalote,
    pendenciaMalote,
    page,
    pageSize
) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                IDPENDENCIA,
                TO_VARCHAR(TXTPENDENCIA) AS TXTPENDENCIA
            FROM
                "${databaseSchema}".PENDENCIASMALOTE TBL
            WHERE
                1 = ?
                AND TBL.STATIVO = 'True'
        `;

        const params = [1];


        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao executar a consulta Pendencias dos Malotes:', error);
        throw error;
    }
};