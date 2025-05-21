import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getTamanhosPedidos = async (idTamanho, descricao, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                tbcp.IDTAMANHO,
                tbcp.DSABREVIACAO,
                tbcp.DSTAMANHO,
                tbcp.STVESTUARIO,
                tbcp.STCALCADO,
                tbcp.STDIVERSOS,
                tbcp.STATIVO
            FROM 
                "${databaseSchema}".TAMANHO tbcp
            WHERE 
                1 = 1
                AND tbcp.STATIVO='True'
            `;

        const params = [];

        if (idTamanho) {
            query += ' And  tbcp.IDTAMANHO = ? ';
            params.push(idTamanho);
        }
    
        if(descricao) {
            query += ' And  (tbcp.DSTAMANHO LIKE ? OR tbcp.DSTAMANHO LIKE ?) ';
            params.push(`%${descricao}%`, `%${descricao}%`);
        }

        const offset = (page - 1) * pageSize;
   
        params.push(pageSize, offset);
        
        query += 'ORDER BY TO_ALPHANUM(tbcp."DSABREVIACAO") ASC LIMIT ? OFFSET ?';

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consultar Tamanhos de Pedidos:', error);
        throw error;
    }
}

export const updateTamanhosPedidos = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."TAMANHO" SET 
                "DSABREVIACAO" = ?, 
                "DSTAMANHO" = ?, 
                "STVESTUARIO" = ?, 
                "STCALCADO" = ?, 
                "STDIVERSOS" = ?, 
                "STATIVO" = ? 
            WHERE "IDTAMANHO" = ?
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.DSABREVIACAO,
                registro.DSTAMANHO,
                registro.STVESTUARIO,
                registro.STCALCADO,
                registro.STDIVERSOS,
                registro.STATIVO,
                registro.IDTAMANHO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Tamanho do Pedido Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Tamanho do Pedido: ${e.message}`);
    }
};

export const createTamanhosPedidos = async (dados) => {
    try {
       
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDTAMANHO")),0) + 1 AS NEXT_ID 
            FROM "${databaseSchema}"."TAMANHO" WHERE 1 = ?  
        `;


        const queryInsert = `
            INSERT INTO "${databaseSchema}"."TAMANHO" 
            ( 
                "IDTAMANHO", 
                "DSABREVIACAO", 
                "DSTAMANHO", 
                "STVESTUARIO", 
                "STCALCADO", 
                "STDIVERSOS", 
                "STATIVO" 
            ) 
            VALUES(?,?,?,?,?,?,?) 
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.DSABREVIACAO,
                registro.DSTAMANHO,
                registro.STVESTUARIO,
                registro.STCALCADO,
                registro.STDIVERSOS,
                registro.STATIVO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Tamanho do Pedido criado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Tamanho do Pedido: ${e.message}`);
    }
};
