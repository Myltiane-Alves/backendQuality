import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getSubGrupoEstrutura = async (idSubGrupoEstrutura, descricao, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                tbcp."IDSUBGRUPOESTRUTURA",
                tbcp."IDGRUPOESTRUTURA",
                tbcp."DSSUBGRUPOESTRUTURA",
                tbcp."CODSUBGRUPOESTRUTURA",
                B."DSGRUPOESTRUTURA",
                B."CODGRUPOESTRUTURA",
                tbcp."NUCONTADOR",
                tbcp."STATIVO"
            FROM 
                "${databaseSchema}"."SUBGRUPOESTRUTURA" tbcp
                INNER JOIN "${databaseSchema}"."GRUPOESTRUTURA" B 
                ON tbcp."IDGRUPOESTRUTURA" = B."IDGRUPOESTRUTURA"
            WHERE 
                1 = 1
                AND tbcp."STATIVO" = 'True'
        `;

        const params = [];

        if (idSubGrupoEstrutura) {
            query += ' AND tbcp."IDSUBGRUPOESTRUTURA" = ? ';
            params.push(idSubGrupoEstrutura);
        }
    
        if (descricao) {
            query += ' AND (tbcp."DSSUBGRUPOESTRUTURA" LIKE ? OR tbcp."DSSUBGRUPOESTRUTURA" LIKE ?) ';
            params.push(`%${descricao}%`, `%${descricao}%`);
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
        };

    } catch (error) {
        console.error('Erro ao consultar sub grupo estrutura:', error);
        throw error;
    }
};


export const updateSubGrupoEstrutura = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."SUBGRUPOESTRUTURA" SET 
                "IDGRUPOESTRUTURA" = ?, 
                "DSSUBGRUPOESTRUTURA" = ?, 
                "STATIVO" = ?, 
                "NUCONTADOR" = ?, 
                "CODSUBGRUPOESTRUTURA" = ? 
            WHERE 
                "IDSUBGRUPOESTRUTURA" = ? 
        `;

        const queryCodGrupo = `
            SELECT CONCAT(LTRIM(CODGRUPOESTRUTURA, '0'), LPAD(IFNULL(NUCODIGO, 0) + 1, 3, '0')) AS COD 
            FROM "${databaseSchema}"."GRUPOESTRUTURA" 
            WHERE IDGRUPOESTRUTURA = ?
        `;

        const queryAtualizaCodGrupo = `
            UPDATE "${databaseSchema}"."GRUPOESTRUTURA" SET
                "NUCODIGO" = ? 
            WHERE 
                "IDGRUPOESTRUTURA" = ?
        `;

        const statement = await conn.prepare(queryUpdate);
        const statementCodGrupo = await conn.prepare(queryCodGrupo);
        const statementAtualizaCodGrupo = await conn.prepare(queryAtualizaCodGrupo);
        console.log('dados', dados);
        for (const registro of dados) {
            console.log('registro', registro);
            console.log('registro.IDGRUPOESTRUTURA', registro.IDGRUPOESTRUTURA);
            console.log('registro.IDSUBGRUPOESTRUTURA', registro.IDSUBGRUPOESTRUTURA);
            console.log('registro.IDGRUPOESTRUTURAANTIGA', registro.IDGRUPOESTRUTURAANTIGA);
            if (registro.IDGRUPOESTRUTURAANTIGA == registro.IDGRUPOESTRUTURA) {
                await statement.exec([
                    registro.IDGRUPOESTRUTURA,
                    registro.DSSUBGRUPOESTRUTURA,
                    registro.STATIVO,
                    0,
                    registro.CODSUBGRUPOESTRUTURA,
                    registro.IDSUBGRUPOESTRUTURA,
                ]);
            } else {
                const result = await statementCodGrupo.exec([registro.IDGRUPOESTRUTURA]);
                console.log('result', result[0]);
                if (!result || result.length === 0) {
                    throw new Error(`Nenhum grupo encontrado para IDGRUPOESTRUTURA: ${registro.IDGRUPOESTRUTURA}`);
                }

                const codGrupo = result[0]; 
                console.log('codGrupo', codGrupo);

                const novoCodigo = codGrupo.COD;
                const codFinal = parseInt(novoCodigo.slice(-1));
                const codFinalAntigo = codFinal - 1;
                const codSubGrupo = novoCodigo.padStart(6, '0');

                await statementAtualizaCodGrupo.exec([codFinal, registro.IDGRUPOESTRUTURA]);

                await statementAtualizaCodGrupo.exec([codFinalAntigo, registro.IDGRUPOESTRUTURAANTIGA]);

                await statement.exec([
                    registro.IDGRUPOESTRUTURA,
                    `${novoCodigo}-${registro.DSSUBGRUPOESTRUTURAFIM}`,
                    registro.STATIVO,
                    0,
                    codSubGrupo,
                    registro.IDSUBGRUPOESTRUTURA,
                ]);
            }
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Sub Grupo de Estrutura realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Sub Grupo de Estrutura: ${e.message}`);
    }
};



export const createSubGrupoEstrutura = async (dados) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDSUBGRUPOESTRUTURA")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."SUBGRUPOESTRUTURA" WHERE 1 = ?
        `;

        const queryInsert = `
            INSERT INTO "${databaseSchema}"."SUBGRUPOESTRUTURA" 
            ( 
                "IDSUBGRUPOESTRUTURA", 
                "IDGRUPOESTRUTURA", 
                "DSSUBGRUPOESTRUTURA", 
                "STATIVO", 
                "NUCONTADOR", 
                "CODSUBGRUPOESTRUTURA" 
            ) 
            VALUES(?,?,?,?,0,?)
        `;

        const queryCodGrupo = `
            SELECT CONCAT(LTRIM("CODGRUPOESTRUTURA", 0), LPAD(IFNULL("NUCODIGO", 0) + 1, 3, '0')) AS COD 
            FROM "${databaseSchema}"."GRUPOESTRUTURA" 
            WHERE "IDGRUPOESTRUTURA" = ?
        `;

        const queryAtualizaCodGrupo = `
            UPDATE "${databaseSchema}"."GRUPOESTRUTURA" 
            SET "NUCODIGO" = ? 
            WHERE "IDGRUPOESTRUTURA" = ?
        `;

        const statementId = await conn.prepare(queryId);
        const statementInsert = await conn.prepare(queryInsert);
        const statementCodGrupo = await conn.prepare(queryCodGrupo);
        const statementUpdateCodGrupo = await conn.prepare(queryAtualizaCodGrupo);

        for (const registro of dados) {
            
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
        
            const codGrupoResult = await statementCodGrupo.exec([registro.IDGRUPOESTRUTURA]);
            const codGrupo = codGrupoResult[0].COD;
        
            const codFinal = parseInt(codGrupo.slice(-1), 10);
            const codSub = codGrupo.padStart(6, '0');

          
            await statementUpdateCodGrupo.exec([codFinal, registro.IDGRUPOESTRUTURA]);

           
            await statementInsert.exec([
                id,
                registro.IDGRUPOESTRUTURA,
                `${codGrupo}-${registro.DSSUBGRUPOESTRUTURA}`,
                registro.STATIVO,
                codSub,
            ]);
            conn.commit();
        }

       

        return {
            status: 'success',
            message: 'Subgrupo de estrutura criado com sucesso.',
        };
    } catch (error) {
        conn.rollback();
        throw new Error(`Erro ao criar subgrupo de estrutura: ${error.message}`);
    }
};
