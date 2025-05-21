import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getTipoTecido = async (idTipoTecido, descricaoTecido, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT A."IDTPTECIDO", A."DSTIPOTECIDO", A."STATIVO" FROM "${databaseSchema}"."TIPOTECIDOS" A WHERE 1=?
        `;

        const params = [1];

        if (idTipoTecido) {
            query += ' And A."IDTPTECIDO" = ? ';
            params.push(idTipoTecido);
        }
    
        if(descricaoTecido) {
            query += ' And (A."DSTIPOTECIDO" LIKE ?) ';
            params.push(`%${descricaoTecido}%`);
        }

        const offset = (page - 1) * pageSize;
        // query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);
        
        query += ' ORDER BY A."DSTIPOTECIDO" LIMIT ? OFFSET ?';

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consultar Tipo de Tecidos:', error);
        throw error;
    }
}

export const updateTipoTecido = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."TIPOTECIDOS" SET 
                "DSTIPOTECIDO" = ?, 
                "STATIVO" = ? 
            WHERE 
                "IDTPTECIDO" = ? 
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.DSTIPOTECIDO,
                registro.STATIVO,
                registro.IDTPTECIDO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Tipo de Tecido Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Tipo do Tecido: ${e.message}`);
    }
};

export const createTipoTecido = async (dados) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDTPTECIDO")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."TIPOTECIDOS" WHERE 1 = ? 
        `;


        const queryInsert = `

            INSERT INTO "${databaseSchema}"."TIPOTECIDOS" (
                "IDTPTECIDO",
                "DSTIPOTECIDO",
                "STATIVO"
            ) VALUES (?, ?, ?)   
        `;
        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.DSTIPOTECIDO,
                registro.STATIVO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Tipo de Tecido criado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Tipo de Tecido: ${e.message}`);
    }
};
