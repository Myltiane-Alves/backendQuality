import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalheBalancoAvulso = async (idFilial, coletor, page, pageSize) => {
    try {

        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                dba.IDDETALHEBALANCOAVULSO,
                dba.IDEMPRESA,
                dba.NUMEROCOLETOR,
                dba.DSCOLETOR,
                dba.IDPRODUTO,
                dba.CODIGODEBARRAS AS NUCODBARRAS,
                dba.DSPRODUTO AS DSNOME,
                IFNULL(SUM(dba.TOTALCONTAGEMGERAL), 0) AS TOTALCONTAGEMGERAL,
                IFNULL(dba.PRECOVENDA, 0) AS PRECOVENDA,
                IFNULL(dba.PRECOCUSTO, 0) AS PRECOCUSTO,
                dba.STCANCELADO,
                e.NOFANTASIA
            FROM 
                "${databaseSchema}"."DETALHEBALANCOAVULSO" dba
            INNER JOIN 
                "${databaseSchema}".EMPRESA e ON e.IDEMPRESA = dba.IDEMPRESA
            WHERE 
                1 = ?
        `;
        
        const params = [1];


        if (coletor) {
            query += ' AND dba.NUMEROCOLETOR = ?';
            params.push(coletor);
        }

        if (idFilial) {
            query += ' AND e.IDEMPRESA = ?';
            params.push(idFilial);
        }

        query += ' AND dba.STCANCELADO = \'False\' ';
        query += `
            GROUP BY 
                dba.IDDETALHEBALANCOAVULSO, 
                dba.IDEMPRESA, 
                dba.NUMEROCOLETOR, 
                dba.DSCOLETOR, 
                dba.IDPRODUTO, 
                dba.CODIGODEBARRAS, 
                dba.DSPRODUTO, 
                dba.PRECOVENDA, 
                dba.PRECOCUSTO, 
                dba.STCANCELADO,
                e.NOFANTASIA
        `;


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
        console.error('Erro ao executar a consulta Detalhe Balanco Avulso:', error);
        throw error;
    }
};


export const getIncluirDetalhes = async (conn, listaDetalhe, idResumoBalanco) => {
    try {

        if (!Array.isArray(listaDetalhe)) {
            throw new Error('listaDetalhe não é um array');
        }

        let insertQuery = `
            INSERT INTO "${databaseSchema}"."DETALHEBALANCO" (
                "IDRESUMOBALANCO", "NUMEROCOLETOR", "IDPRODUTO", "CODIGODEBARRAS", "DSPRODUTO", 
                "TOTALCONTAGEMATUAL", "TOTALCONTAGEMGERAL", "PRECOCUSTO", "PRECOVENDA", "STCANCELADO", 
                "DSCOLETOR"
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'False', ?)
        `;
        
        let updateQuery = `
            UPDATE "${databaseSchema}"."DETALHEBALANCO" 
            SET "TOTALCONTAGEMGERAL" = "TOTALCONTAGEMGERAL" + ? 
            WHERE "STCANCELADO" = 'False' 
            AND "NUMEROCOLETOR" = ? 
            AND "IDPRODUTO" = ? 
            AND "IDRESUMOBALANCO" = ?
        `;
    

        const insertStmt = await conn.prepare(insertQuery);
        const updateStmt = await conn.prepare(updateQuery);
    

        for(let registro of listaDetalhe) {
           
            let recordExistsQuery = `
                SELECT COUNT(1) AS "count" 
                FROM "${databaseSchema}"."DETALHEBALANCO"
                WHERE "STCANCELADO" = 'False' 
                AND "IDRESUMOBALANCO" = ? 
                AND "NUMEROCOLETOR" = ? 
                AND "IDPRODUTO" = ?
            `;


            const [recordExists] = await conn.exec(recordExistsQuery, [idResumoBalanco, registro.NUMEROCOLETOR, registro.IDPRODUTO]);
            console.log(recordExists, 'recordExists')
            if (recordExists &&  recordExists.length > 0 && recordExists[0].count > 0) {
                await updateStmt.exec([
                    registro.TOTALCONTAGEMGERAL,
                    registro.NUMEROCOLETOR,
                    registro.IDPRODUTO,
                    idResumoBalanco
                ]);
            } else {
                await insertStmt.exec([
                    idResumoBalanco,
                    registro.NUMEROCOLETOR,
                    registro.IDPRODUTO,
                    registro.CODIGODEBARRAS,
                    registro.DSPRODUTO,
                    registro.TOTALCONTAGEMATUAL,
                    registro.TOTALCONTAGEMGERAL,
                    registro.PRECOCUSTO,
                    registro.PRECOVENDA,
                    registro.DSCOLETOR || ''
                ]);
            }
        }

        await conn.commit();
    } catch (error) {
        console.error('Erro ao executar a consulta Detalhe Balanco Avulso:', error);
        throw error;
    }
};

export const putDetalheBalancoAvulso = async (detalhes) => {
    try {
        const totalContagemGeral = parseInt(detalhes[0].TOTALCONTAGEMGERAL);
        const idEmpresa = parseInt(detalhes[0].IDEMPRESA);
        const numeroColetor = parseInt(detalhes[0].NUMEROCOLETOR);
        const idProduto = detalhes[0].IDPRODUTO;
        
        if (totalContagemGeral === 0) {
            let deleteQuery = `
            DELETE FROM "${databaseSchema}"."DETALHEBALANCOAVULSO"
                WHERE "STCANCELADO" = 'False'
                AND "NUMEROCOLETOR" = ?
                AND "IDPRODUTO" = ?
                AND "IDEMPRESA" = ?
            `;
     
            await conn.execute(deleteQuery, [numeroColetor, idProduto, idEmpresa]);
            await conn.commit();
        } else {
            let updateQuery = `
                UPDATE "${databaseSchema}"."DETALHEBALANCOAVULSO"
                SET "TOTALCONTAGEMGERAL" = ?
                WHERE "STCANCELADO" = 'False'
                    AND "IDEMPRESA" = ?
                    AND "NUMEROCOLETOR" = ?
                AND "IDPRODUTO" = ?
            `;
           
            await conn.execute(updateQuery, [
                detalhes[0].TOTALCONTAGEMGERAL, 
                detalhes[0].IDEMPRESA, 
                detalhes[0].NUMEROCOLETOR,
                detalhes[0].IDPRODUTO
            ]);
            await conn.commit();
        }

        return {
            status: 'success',
            message: 'Detalhes do balanço Avulso atualizados com sucesso'
        };
    } catch (error) {
        console.error('Erro ao executar a atualização do Detalhe Balanco Avulso:', error);
        throw error;
    }
}



export const createDetalheBalancoAvulso = async (bodyJson) => {
    try {

        if (bodyJson && bodyJson.length > 0 && bodyJson[0].INSBALANCO === 1) {
            
            const idResumoBalancoQuery = `
                SELECT "IDRESUMOBALANCO" FROM "${databaseSchema}"."RESUMOBALANCO"
                WHERE "IDEMPRESA" = ? AND "STATIVO" = 'True'
            `;

            const result = await conn.exec(idResumoBalancoQuery, [bodyJson[0].IDEMPRESA]);
            const idResumoBalanco = result.rows;
        

            if (!idResumoBalanco || idResumoBalanco.length == 0) {
                const newIdResumoBalancoQuery = `
                    SELECT IFNULL(MAX(TO_INT("IDRESUMOBALANCO")), 0) + 1 
                    FROM "${databaseSchema}"."RESUMOBALANCO"
                `;
                const result = await conn.exec(newIdResumoBalancoQuery);

                if(!result || result.length === 0) {
                    console.error('No results returned from newIdResumoBalancoQuery');
                    throw new Error('Failed to retrieve new IDRESUMOBALANCO');
                }

                const queryId = result[0]['IFNULL(MAX(TO_INT(IDRESUMOBALANCO)),0)+1'];
                
                if (queryId === undefined) {
                    console.error('Failed to extract MAX from query result:', result);
                    throw new Error('Failed to extract MAX from query result');
                }

                const insertResumoQuery = `
                    INSERT INTO "${databaseSchema}"."RESUMOBALANCO" (
                        "IDRESUMOBALANCO", "IDEMPRESA", "DSRESUMOBALANCO", "DTABERTURA", "DTFECHAMENTO", 
                        "QTDTOTALITENS", "QTDTOTALSOBRA", "QTDTOTALFALTA", "TXTOBSERVACAO", "STATIVO", 
                        "STCANCELADO", "STCONCLUIDO", "STCONSOLIDADO"
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'False', 'False', 'False')
                `;
                const insertResumoStmt = await conn.prepare(insertResumoQuery);

                
                for (let i = 0; i < bodyJson.length; i++) {
                    let registro = bodyJson[i];
                    await insertResumoStmt.exec([
                        queryId,
                        registro.IDEMPRESA,
                        registro.DSRESUMOBALANCO,
                        registro.DTABERTURA,
                        registro.DTFECHAMENTO || null,
                        registro.QTDTOTALITENS,
                        registro.QTDTOTALSOBRA,
                        registro.QTDTOTALFALTA,
                        registro.TXTOBSERVACAO,
                        registro.STATIVO
                    ]);
                    await getIncluirDetalhes(conn, registro.det, queryId);
                }
                
  
            } else {

                await getIncluirDetalhes(conn, bodyJson[0].det, idResumoBalanco[0].IDRESUMOBALANCO);
            }

            const updateQuery = `
                UPDATE "${databaseSchema}"."DETALHEBALANCOAVULSO"
                SET "STCANCELADO" = ?
                WHERE "STCANCELADO" = 'False' AND "IDEMPRESA" = ? AND "NUMEROCOLETOR" = ?
            `;
            await conn.exec(updateQuery, ['True', bodyJson[0].IDEMPRESA, bodyJson[0].det[0].NUMEROCOLETOR]);
        } else {
            
            const insertDetalheQuery = `
                INSERT INTO "${databaseSchema}"."DETALHEBALANCOAVULSO" (
                    "IDDETALHEBALANCOAVULSO", "IDEMPRESA", "NUMEROCOLETOR", "DSCOLETOR", "IDPRODUTO", 
                    "CODIGODEBARRAS", "DSPRODUTO", "TOTALCONTAGEMGERAL", "PRECOCUSTO", "PRECOVENDA", "STCANCELADO"
                ) VALUES (${databaseSchema}.SEQ_DETALHEBALANCOAVULSO.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'False')
            `;

            const insertDetalheStmt = await conn.prepare(insertDetalheQuery);
            await insertDetalheStmt.exec([
                bodyJson[0].IDEMPRESA,
                bodyJson[0].NUMEROCOLETOR,
                bodyJson[0].DSCOLETOR || '',
                bodyJson[0].IDPRODUTO,
                bodyJson[0].CODIGODEBARRAS,
                bodyJson[0].DSPRODUTO,
                bodyJson[0].TOTALCONTAGEMGERAL,
                bodyJson[0].PRECOCUSTO,
                bodyJson[0].PRECOVENDA
            ]);
        }

        
        await conn.commit();

        return {
            msg: "Inclusão realizada com sucesso!"
        };
    } catch (error) {
        console.error('Erro ao executar a inserção ou atualização do Detalhe Balanco Avulso:', error);
        throw error;
    } 
}


export const handlePostDetalheBalancoAvulso = async (bodyJson) => {
    const connection = await conn.getConnection();
    try {
    
        if (bodyJson[0].INSBALANCO === 1) {
          
            const idResumoBalancoQuery = `
                SELECT "IDRESUMOBALANCO" FROM "${databaseSchema}"."RESUMOBALANCO"
                WHERE "IDEMPRESA" = ? AND "STATIVO" = 'True'
            `;
            const [idResumoBalanco] = await connection.execute(idResumoBalancoQuery, [bodyJson[0].IDEMPRESA]);

            
            if ( idResumoBalanco.length === 0) {
                const newIdResumoBalancoQuery = `
                    SELECT IFNULL(MAX(TO_INT("IDRESUMOBALANCO")), 0) + 1 
                    FROM "${databaseSchema}"."RESUMOBALANCO"
                `;
                const [[{ MAX: queryId }]] = await connection.execute(newIdResumoBalancoQuery);

                const insertResumoQuery = `
                    INSERT INTO "${databaseSchema}"."RESUMOBALANCO" (
                        "IDRESUMOBALANCO", "IDEMPRESA", "DSRESUMOBALANCO", "DTABERTURA", "DTFECHAMENTO", 
                        "QTDTOTALITENS", "QTDTOTALSOBRA", "QTDTOTALFALTA", "TXTOBSERVACAO", "STATIVO", 
                        "STCANCELADO", "STCONCLUIDO", "STCONSOLIDADO"
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'False', 'False', 'False')
                `;
                const insertResumoStmt = await connection.prepare(insertResumoQuery);

               
                for (let registro of bodyJson) {
                    await insertResumoStmt.execute([
                        queryId,
                        registro.IDEMPRESA,
                        registro.DSRESUMOBALANCO,
                        registro.DTABERTURA,
                        registro.DTFECHAMENTO || null,
                        registro.QTDTOTALITENS,
                        registro.QTDTOTALSOBRA,
                        registro.QTDTOTALFALTA,
                        registro.TXTOBSERVACAO,
                        registro.STATIVO
                    ]);

                    await insertDetalhes(connection, registro.det, queryId);
                }

                await insertResumoStmt.close();
            } else {
                // If an active RESUMOBALANCO is found, insert the details
                await insertDetalhes(connection, bodyJson[0].det, idResumoBalanco[0].IDRESUMOBALANCO);
            }

            
            const updateQuery = `
                UPDATE "${databaseSchema}"."DETALHEBALANCOAVULSO"
                SET "STCANCELADO" = ?
                WHERE "STCANCELADO" = 'False' AND "IDEMPRESA" = ? AND "NUMEROCOLETOR" = ?
            `;
            await connection.execute(updateQuery, ['True', bodyJson[0].IDEMPRESA, bodyJson[0].det[0].NUMEROCOLETOR]);
        } else {
 
            const insertDetalheQuery = `
                INSERT INTO "${databaseSchema}"."DETALHEBALANCOAVULSO" (
                    "IDDETALHEBALANCOAVULSO", "IDEMPRESA", "NUMEROCOLETOR", "DSCOLETOR", "IDPRODUTO", 
                    "CODIGODEBARRAS", "DSPRODUTO", "TOTALCONTAGEMGERAL", "PRECOCUSTO", "PRECOVENDA", "STCANCELADO"
                ) VALUES (${databaseSchema}.SEQ_DETALHEBALANCOAVULSO.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'False')
            `;

            const insertDetalheStmt = await connection.prepare(insertDetalheQuery);
            await insertDetalheStmt.execute([
                bodyJson[0].IDEMPRESA,
                bodyJson[0].NUMEROCOLETOR,
                bodyJson[0].DSCOLETOR || '',
                bodyJson[0].IDPRODUTO,
                bodyJson[0].CODIGODEBARRAS,
                bodyJson[0].DSPRODUTO,
                bodyJson[0].TOTALCONTAGEMGERAL,
                bodyJson[0].PRECOCUSTO,
                bodyJson[0].PRECOVENDA
            ]);

            await insertDetalheStmt.close();
        }

        
        await connection.commit();

        return {
            msg: "Inclusão realizada com sucesso!"
        };
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao executar a inserção ou atualização do Detalhe Balanco Avulso:', error);
        throw error;
    } finally {
        await connection.release();
    }
};