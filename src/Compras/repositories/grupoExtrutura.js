import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getGrupoEstrutura = async (idGrupoEstrutura, descricao, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        var query = `
            SELECT 
            tbcp.IDGRUPOESTRUTURA,
            tbcp.IDGRUPOEMPRESARIAL,
            tbcp.DSGRUPOESTRUTURA,
            tbcp.STATIVO,
            tbcp.CODGRUPOESTRUTURA,
            tbcp.NUCODIGO
            FROM 
            "${databaseSchema}".GRUPOESTRUTURA tbcp
            WHERE 
            1 = 1
            AND tbcp.STATIVO='True'
        `;

        const params = [];

        if (idGrupoEstrutura) {
            query += ' And tbcp.IDGRUPOESTRUTURA = ? ';
            params.push(idGrupoEstrutura);
        }
    
        if(descricao) {
            query += ' And (tbcp.DSGRUPOESTRUTURA LIKE ? OR tbcp.DSGRUPOESTRUTURA LIKE ?) ';
            params.push(`%${descricao}%`, `%${descricao}%`);
        }

        const offset = (page - 1) * pageSize;
        // query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);
        
        query += 'ORDER BY tbcp.CODGRUPOESTRUTURA LIMIT ? OFFSET ?';

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consultar Grupos Estrutura:', error);
        throw error;
    }
}

export const updateGrupoEstrutura = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."GRUPOESTRUTURA" SET 
            "DSGRUPOESTRUTURA" = ?, 
            "STATIVO" = ? 
            WHERE "IDGRUPOESTRUTURA" = ? 
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.DSGRUPOESTRUTURA,
                registro.STATIVO,
                registro.IDGRUPOESTRUTURA,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Grupo Estrutura com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Grupo Estrutura: ${e.message}`);
    }
};

export const createGrupoEstrutura = async (dados) => {
    try {
       
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDGRUPOESTRUTURA")), 0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."GRUPOESTRUTURA" WHERE 1 = ?`;

        const queryCodGrupo = `
            SELECT LTRIM("CODGRUPOESTRUTURA", '0') AS COD
            FROM "${databaseSchema}"."GRUPOESTRUTURA"
            WHERE 1 = ?
            ORDER BY "IDGRUPOESTRUTURA" DESC
            LIMIT 1`;

        const queryInsert = `
            INSERT INTO "${databaseSchema}"."GRUPOESTRUTURA" (
                "IDGRUPOESTRUTURA",
                "IDGRUPOEMPRESARIAL",
                "DSGRUPOESTRUTURA",
                "STATIVO",
                "CODGRUPOESTRUTURA",
                "NUCODIGO"
            ) VALUES (?, ?, ?, ?, ?, 0)`;

        
        const statementId = await conn.prepare(queryId);
        const statementCodGrupo = await conn.prepare(queryCodGrupo);
        const statementInsert = await conn.prepare(queryInsert);

       
        for (const registro of dados) {
            
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;

            
            const codResult = await statementCodGrupo.exec([1]);
            const currentCod = codResult.length > 0 ? parseInt(codResult[0].COD) : 0;
            const newCod = currentCod + 1;
            const codNovoFormatado = newCod.toString().padStart(3, '0'); 

           
            await statementInsert.exec([
                id,
                registro.IDGRUPOEMPRESARIAL,
                registro.DSGRUPOESTRUTURA,
                registro.STATIVO,
                codNovoFormatado,
            ]);
        }

        // Confirmar transação
        await conn.commit();
        return {
            status: 'success',
            message: 'Inclusão realizada com sucesso!',
        };
    } catch (error) {
        // Reverter transação em caso de erro
        await conn.rollback();
        throw new Error(`Erro ao criar Grupo Estrutura: ${error.message}`);
    }
};
