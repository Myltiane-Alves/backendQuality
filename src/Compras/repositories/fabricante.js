import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getFabricante = async (idFabricante, descFabricante, noFabricante,  page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                A.IDFABRICANTE, 
                A.DSFABRICANTE,  
                A.DTCADASTRO, 
                A.DTULTATUALIZACAO, 
                A.STATIVO 
            FROM "${databaseSchema}".FABRICANTE A 
            WHERE 1 = 1
        `;

        const params = [];

        if (idFabricante) {
            query += ' And A.IDFABRICANTE = ?';
            params.push(idFabricante);
        }

        if (descFabricante) {
            query += ` And And  CONTAINS((A.IDFABRICANTE, A.DSFABRICANTE), '%${descFabricante}%' )  `;
            params.push(`%${descFabricante}%`);
            
        }
    
        if (noFabricante) {
            query += ` And CONTAINS(A.DSFABRICANTE = ?) `;
            params.push(noFabricante);
        }

        const offset = (page - 1) * pageSize;
        params.push(pageSize, offset);
        
        query += 'ORDER BY A."DSFABRICANTE" LIMIT ? OFFSET ?';
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page,
            pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao cunsulta Fabricante:', error);
        throw error;
    }
}

export const updateFabricante = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."FABRICANTE" SET 
                "DSFABRICANTE" = ?, 
                "DTCADASTRO" = ?, 
                "DTULTATUALIZACAO" = ?, 
                "STATIVO" = ? 
            WHERE "IDFABRICANTE" = ?
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.DSFABRICANTE,
                registro.DTCADASTRO,
                registro.DTULTATUALIZACAO,
                registro.STATIVO,
                registro.IDFABRICANTE,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Fabricante Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Fabricante: ${e.message}`);
    }
};

export const createFabricante = async (dados) => {
    try {
       
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDFABRICANTE")),0) + 1  AS NEXT_ID
            FROM "${databaseSchema}"."FABRICANTE" WHERE 1 = ?
        `;

        const queryInsert = `
            INSERT INTO "${databaseSchema}"."FABRICANTE" (
                "IDFABRICANTE",
                "DSFABRICANTE",
                "DTCADASTRO",
                "DTULTATUALIZACAO",
                "STATIVO"
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.DSFABRICANTE,
                registro.DTCADASTRO,
                registro.DTULTATUALIZACAO,
                registro.STATIVO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Fabricante criado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Fabricnate: ${e.message}`);
    }
};