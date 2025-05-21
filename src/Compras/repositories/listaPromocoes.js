import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getPromocoes = async (idResumoPromocao, descPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        var query = `
             SELECT 
                tbt.IDRESUMOPROMOCAOMARKETING,
                tbt.DSPROMOCAOMARKETING,
                tbt.DTHORAINICIO,
                tbt.DTHORAFIM,
                tbt.TPAPLICADOA,
                tbt.APARTIRDEQTD,
                tbt.APARTIRDOVLR,
                tbt.TPFATORPROMO,
                tbt.FATORPROMOVLR,
                tbt.FATORPROMOPERC,
                tbt.TPAPARTIRDE,
                IFNULL(tbt.VLPRECOPRODUTO, 0) AS VLPRECOPRODUTO,
                TO_VARCHAR(tbt.DTHORAINICIO, 'YYYY-MM-DD HH24:MI:SS') AS DTHORAINICIOFORMAT,
                TO_VARCHAR(tbt.DTHORAFIM, 'YYYY-MM-DD HH24:MI:SS') AS DTHORAFIMFORMAT,
                TO_VARCHAR(tbt.DTHORAINICIO, 'DD-MM-YYYY HH24:MI:SS') AS DTHORAINICIOFORMAT2,
                TO_VARCHAR(tbt.DTHORAFIM, 'DD-MM-YYYY HH24:MI:SS') AS DTHORAFIMFORMAT2
            FROM "${databaseSchema}".RESUMOPROMOCAOMARKETING tbt
            WHERE 1 = ?
        `;

        const params = [1];

        if (idResumoPromocao) {
            query += ' And tbt.IDRESUMOPROMOCAOMARKETING  = ? ';
            params.push(idResumoPromocao);
        }
    
        if(descPromocao) {
            query += ' And  tbt.DSPROMOCAOMARKETING LIKE ? ';
            params.push(`%${descPromocao}%`);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += `
                AND (
                    (tbt.DTHORAINICIO BETWEEN ? AND ?)
                    OR (tbt.DTHORAFIM BETWEEN ? AND ?)
                )
            `;
         
            params.push(
                `${dataPesquisaInicio} 00:00:00`,
                `${dataPesquisaFim} 23:59:59`,
                `${dataPesquisaInicio} 00:00:00`,
                `${dataPesquisaFim} 23:59:59`
            );
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);
        

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consultar Lista Promoções:', error);
        throw error;
    }
}

export const updatePromocao = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."RESUMOPROMOCAOMARKETING" SET 
            "DSPROMOCAOMARKETING" = ?, 
            "DTHORAINICIO" = ?, 
            "DTHORAFIM" = ?, 
            "TPAPLICADOA" = ?, 
            "APARTIRDEQTD" = ?, 
            "APARTIRDOVLR" = ?, 
            "TPFATORPROMO" = ?, 
            "FATORPROMOVLR" = ?, 
            "FATORPROMOPERC" = ?, 
            "TPAPARTIRDE" = ?, 
            "VLPRECOPRODUTO" = ? 
            WHERE "IDRESUMOPROMOCAOMARKETING" = ?
        `;
       

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.DSPROMOCAOMARKETING,
                registro.DTHORAINICIO,
                registro.DTHORAFIM,
                registro.TPAPLICADOA,
                registro.APARTIRDEQTD,
                registro.APARTIRDOVLR,
                registro.TPFATORPROMO,
                registro.FATORPROMOVLR,
                registro.FATORPROMOPERC,
                registro.TPAPARTIRDE,
                registro.VLPRECOPRODUTO,
                registro.IDRESUMOPROMOCAOMARKETING,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização da Promoção Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Promoção: ${e.message}`);
    }
};



export const createPromocao = async (dados) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDRESUMOPROMOCAOMARKETING")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."RESUMOPROMOCAOMARKETING" WHERE 1 = ?
        `;

        const queryInsert = `INSERT INTO "${databaseSchema}"."RESUMOPROMOCAOMARKETING" 
            ( 
                "IDRESUMOPROMOCAOMARKETING", 
                "DSPROMOCAOMARKETING", 
                "DTHORAINICIO", 
                "DTHORAFIM", 
                "TPAPLICADOA", 
                "APARTIRDEQTD", 
                "APARTIRDOVLR", 
                "TPFATORPROMO", 
                "FATORPROMOVLR", 
                "FATORPROMOPERC", 
                "TPAPARTIRDE", 
                "VLPRECOPRODUTO" 
            ) 
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?) 
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.DSPROMOCAOMARKETING,
                registro.DTHORAINICIO,
                registro.DTHORAFIM,
                registro.TPAPLICADOA,
                registro.APARTIRDEQTD,
                registro.APARTIRDOVLR,
                registro.TPFATORPROMO,
                registro.FATORPROMOVLR,
                registro.FATORPROMOPERC,
                registro.TPAPARTIRDE,
                registro.VLPRECOPRODUTO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Promoção criada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Promoção: ${e.message}`);
    }
};

