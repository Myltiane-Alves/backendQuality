import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
const databaseSchemaSBO = process.env.HANA_DATABASE_SBO;

export const getDePrecosSap = async (idResumoLista, idEmpresa, dataPesquisaInicio, dataPesquisaFim, nomeLista, page, pageSize) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        
        let query = `
            SELECT
                TBO."ListNum" as IDRESUMOLISTAPRECO,
                IFNULL(TBE.NOFANTASIA, TBO."ListName") as NOMELISTA,
                TBE.IDEMPRESA,
                TO_VARCHAR(TBO."CreateDate", 'DD/MM/YYYY') AS DATACRIACAO,
                TO_VARCHAR(TBO."UpdateDate", 'DD/MM/YYYY') AS DATAALTERACAO,
                'True' as STATIVO
            FROM
                "${databaseSchema}".EMPRESA TBE
            RIGHT JOIN ${databaseSchemaSBO}.OPLN TBO  ON
                SUBSTRING(TBO."ListName", 1, 4) = SUBSTRING(TBE.NOFANTASIA, 1, 4)
            WHERE
                1 = ? 
        `;

        const params = [];

        if (idResumoLista) {
            query += `AND TBR.IDRESUMOLISTAPRECO =  ?`;
            params.push(idResumoLista);
        }

        if (idEmpresa) {
            query += `AND TBE.IDEMPRESA =  ?`;
            params.push(idEmpresa);
        }

        if(nomeLista) {
            query += `AND CONTAINS((TBR.NOMELISTA, TBR.IDRESUMOLISTAPRECO), '%${nomeLista}%')`
        }

        if(dataPesquisaInicio && dataPesquisaFim) {
            query += ` AND (TBR.DATACRIACAO BETWEEN '${dataPesquisaInicio} 00:00:00' AND '${dataPesquisaFim} 23:59:59' OR TBR.DATAALTERACAO BETWEEN '${dataPesquisaInicio} 00:00:00' AND '${dataPesquisaFim} 23:59:59')`;
        }

        query += `ORDER BY "ListName", "ListNum"`;
       
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
        console.error('Error executar a consulta Lista de Preços Sap', error);
        throw error;
    }
};


// export const getDePrecosSap = async (
//     idResumoLista,
//     idEmpresa,
//     dataPesquisaInicio,
//     dataPesquisaFim,
//     nomeLista,
//     page,
//     pageSize
// ) => {
//     try {
      
//         page = page && !isNaN(page) ? parseInt(page) : 1;
//         pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
//         const offset = (page - 1) * pageSize;

      
//         let query = `
//             SELECT
//                 TBO."ListNum" AS IDRESUMOLISTAPRECO,
//                 COALESCE(TBE.NOFANTASIA, TBO."ListName") AS NOMELISTA,
//                 TBE.IDEMPRESA,
//                 TO_VARCHAR(TBO."CreateDate", 'DD/MM/YYYY') AS DATACRIACAO,
//                 TO_VARCHAR(TBO."UpdateDate", 'DD/MM/YYYY') AS DATAALTERACAO,
//                 'True' AS STATIVO
//             FROM
//                 "${databaseSchema}".EMPRESA TBE
//             RIGHT JOIN ${databaseSchemaSBO}.OPLN TBO
//                 ON SUBSTRING(TBO."ListName", 1, 4) = SUBSTRING(TBE.NOFANTASIA, 1, 4)
//             WHERE
//                 1 = 1
//         `;

//         const params = [];

      
//         if (idResumoLista) {
//             query += ` AND TBO."ListNum" = ?`;
//             params.push(idResumoLista);
//         }

//         if (idEmpresa) {
//             query += ` AND TBE.IDEMPRESA = ?`;
//             params.push(idEmpresa);
//         }

//         if (nomeLista) {
//             query += ` AND CONTAINS((TBO."ListName"), ?)`;
//             params.push(`%${nomeLista}%`);
//         }

//         if (dataPesquisaInicio && dataPesquisaFim) {
//             query += ` AND (
//                 TBO."CreateDate" BETWEEN ? AND ?
//                 OR TBO."UpdateDate" BETWEEN ? AND ?
//             )`;
//             params.push(
//                 `${dataPesquisaInicio} 00:00:00`,
//                 `${dataPesquisaFim} 23:59:59`,
//                 `${dataPesquisaInicio} 00:00:00`,
//                 `${dataPesquisaFim} 23:59:59`
//             );
//         }

        
//         query += ` ORDER BY TBO."ListName", TBO."ListNum" LIMIT ? OFFSET ?`;
//         params.push(pageSize, offset);

        
//         const statement = await conn.prepare(query);
//         const result = await statement.exec(params);

    
//         return {
//             page,
//             pageSize,
//             totalRecords: result.length,
//             data: result.map(registro => ({
//                 listaPreco: {
//                     IDRESUMOLISTAPRECO: registro.IDRESUMOLISTAPRECO,
//                     NOMELISTA: registro.NOMELISTA,
//                     IDEMPRESA: registro.IDEMPRESA,
//                     DATACRIACAO: registro.DATACRIACAO,
//                     DATAALTERACAO: registro.DATAALTERACAO,
//                     STATIVO: registro.STATIVO,
//                 },
//             })),
//         };
//     } catch (error) {
//         console.error('Erro ao executar a consulta Lista de Preços Sap:', error);
//         throw error;
//     }
// };
