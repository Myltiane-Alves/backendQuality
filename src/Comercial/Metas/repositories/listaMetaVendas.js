import conn from '../../../config/dbConnection.js';
import 'dotenv/config';

const databaseSchema = process.env.HANA_DATABASE;

export const getListaMetaVendas = async (page, pageSize) => {
    try {

        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        const offset = (page - 1) * pageSize;

        let query = `
            SELECT DISTINCT
                T3.IDGRUPOEMPRESA,
                T1.DSSUBGRUPOEMPRESARIAL,
                TO_VARCHAR(T3.DTMETAINICIO, 'DD-MM-YYYY') AS DTMETAINICIOFORMAT,
                TO_VARCHAR(T3.DTMETAFIM, 'DD-MM-YYYY') AS DTMETAFIMFORMAT,
                TO_VARCHAR(T3.DTMETAINICIO, 'YYYY-MM-DD') AS DTMETAINICIO,
                TO_VARCHAR(T3.DTMETAFIM, 'YYYY-MM-DD') AS DTMETAFIM,
                T3.STATIVO,
                T3.STSALVO
            FROM
                "${databaseSchema}".METASLOJAS T3
                INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL T1 ON T3.IDGRUPOEMPRESA = T1.IDSUBGRUPOEMPRESARIAL
            WHERE
                1 = ? 
        `;

  
        const params = [1];
        
        query += `
            GROUP BY 
                T3.IDGRUPOEMPRESA, 
                T1.DSSUBGRUPOEMPRESARIAL, 
                T3.DTMETAINICIO, 
                T3.DTMETAFIM, 
                T3.STATIVO, 
                T3.STSALVO,
                T3.IDGRUPOEMPRESA
        `;
        const statement = conn.prepare(query);
        const result = await statement.execute(params);

        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (e) {
        console.error('Erro ao executar a consulta Lista de Metas Vendas:', e);
        throw new Error('Erro ao executar a consulta Lista de Metas Vendas');
    } 
};
