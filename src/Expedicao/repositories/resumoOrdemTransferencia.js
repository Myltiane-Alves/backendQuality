
import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
import { format } from 'date-fns';


export const getResumoOrdemTransferencia = async (idEmpresaDestino, idEmpresaOrigem, idTipoFiltro, dataPesquisaInicio, dataPesquisaFim, pageSize, page) => {
    try {
     
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

      
        let query = `
            SELECT 
                rot.IDRESUMOOT,
                rot.IDEMPRESAORIGEM,
                (SELECT IFNULL(NOFANTASIA, '') FROM "${databaseSchema}".EMPRESA WHERE IDEMPRESA = rot.IDEMPRESAORIGEM) AS EMPRESAORIGEM,
                rot.IDEMPRESADESTINO,
                (SELECT IFNULL(NOFANTASIA, '') FROM "${databaseSchema}".EMPRESA WHERE IDEMPRESA = rot.IDEMPRESADESTINO) AS EMPRESADESTINO,
                IFNULL(TO_VARCHAR(rot.DATAEXPEDICAO, 'YYYY-MM-DD HH24:MI:SS'), '') AS DATAEXPEDICAO,
                IFNULL(TO_VARCHAR(rot.DATAEXPEDICAO, 'DD/MM/YYYY'), 'Não Informado') AS DATAEXPEDICAOFORMATADA,
                rot.IDOPERADOREXPEDICAO,
                rot.NUTOTALITENS,
                rot.QTDTOTALITENS,
                rot.QTDTOTALITENSRECEPCIONADO,
                rot.QTDTOTALITENSDIVERGENCIA,
                rot.NUTOTALVOLUMES,
                rot.TPVOLUME,
                rot.VRTOTALCUSTO,
                rot.VRTOTALVENDA,
                rot.ERRORLOGSAP,
                IFNULL(TO_VARCHAR(rot.DTRECEPCAO, 'YYYY-MM-DD HH24:MI:SS'), '') AS DTRECEPCAO,
                IFNULL(TO_VARCHAR(rot.DTRECEPCAO, 'DD/MM/YYYY'), 'Não Informado') AS DTRECEPCAOFORMATADA,
                rot.IDOPERADORRECEPTOR,
                rot.DSOBSERVACAO,
                rot.IDUSRCANCELAMENTO,
                IFNULL(TO_VARCHAR(rot.DTULTALTERACAO, 'YYYY-MM-DD HH24:MI:SS'), '') AS DTULTALTERACAO,
                IFNULL(TO_VARCHAR(rot.DTULTALTERACAO, 'DD/MM/YYYY'), 'Não Informado') AS DTULTALTERACAOFORMATADA,
                rot.IDSTDIVERGENCIA,
                rot.OBSDIVERGENCIA,
                rot.STEMISSAONFE,
                IFNULL(rot.NUMERONFE, '') AS NUMERONFE,
                rot.STENTRADAINVENTARIO,
                IFNULL(rot.QTDCONFERENCIA, 0) AS QTDCONFERENCIA,
                rot.IDSTATUSOT,
                rot.IDUSRAJUSTE,
                IFNULL(TO_VARCHAR(rot.DTAJUSTE, 'YYYY-MM-DD HH24:MI:SS'), '') AS DTAJUSTE,
                IFNULL(TO_VARCHAR(rot.DTAJUSTE, 'DD/MM/YYYY'), 'Não Informado') AS DTAJUSTEFORMATADA,
                rot.QTDTOTALITENSAJUSTE,
                sot.DESCRICAOOT
            FROM "${databaseSchema}".RESUMOORDEMTRANSFERENCIA rot
            JOIN "${databaseSchema}".STATUSORDEMTRANSFERENCIA sot ON sot.IDSTATUSOT = rot.IDSTATUSOT
            WHERE 1 = ?
        `;

        const params = [1];

  
        if (idTipoFiltro === 1) {
            if (idEmpresaOrigem > 0) {
                query += ' AND rot.IDEMPRESAORIGEM = ?';
                params.push(idEmpresaOrigem);
            }
            if (idEmpresaDestino > 0) {
                query += ' AND rot.IDEMPRESADESTINO = ?';
                params.push(idEmpresaDestino);
            }
        } else if (idTipoFiltro === 2) {
            if (idEmpresaDestino === idEmpresaOrigem) {
                query += ' AND rot.IDEMPRESADESTINO = ?';
                params.push(idEmpresaDestino);
            } else if (idEmpresaDestino !== idEmpresaOrigem && idEmpresaDestino > 0) {
                query += ' AND rot.IDEMPRESAORIGEM = ? AND rot.IDEMPRESADESTINO = ?';
                params.push(idEmpresaOrigem, idEmpresaDestino);
            } else {
                query += ' AND (rot.IDEMPRESAORIGEM = ? OR rot.IDEMPRESADESTINO = ?)';
                params.push(idEmpresaOrigem, idEmpresaOrigem);
            }
        }

        
        if (dataPesquisaInicio && dataPesquisaFim) {
            const formattedDataPesquisaInicio = format(new Date(dataPesquisaInicio), 'yyyy-MM-dd 00:00:00');
            const formattedDataPesquisaFim = format(new Date(dataPesquisaFim), 'yyyy-MM-dd 23:59:59');
        
            query += ' AND rot.DATAEXPEDICAO >= ? AND rot.DATAEXPEDICAO <= ?';
            params.push(formattedDataPesquisaInicio, formattedDataPesquisaFim);
        }
        

        query += ' ORDER BY rot.IDRESUMOOT DESC';

  
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
        console.error('Erro ao executar consulta em getResumoOrdemTransferencia:', error);
        throw error;
    }
};


export const updateDetalheOT = async (dados) => {
    try {
        const query = `
            INSERT INTO "${databaseSchema}"."DETALHEORDEMTRANSFERENCIA" (
                "IDDETALHEOT", "IDPRODUTO", "IDRESUMOOT", "QTDEXPEDICAO",
                "QTDRECEPCAO", "QTDDIFERENCA", "QTDAJUSTE", "VLRUNITVENDA",
                "VLRUNITCUSTO", "STCONFERIDO", "IDUSRAJUSTE", "STATIVO",
                "STFALTA", "STSOBRA"
            ) VALUES (
                "${databaseSchema}".SEQ_DETALHEORDEMTRANSFERENCIA.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;

        const statement = await conn.prepare(query);

        for (const dado of dados) {
            const params = [
                dado.IDPRODUTO,
                dado.IDRESUMOOT,
                dado.QTDEXPEDICAO,
                dado.QTDRECEPCAO,
                dado.QTDDIFERENCA,
                dado.QTDAJUSTE,
                dado.VLRUNITVENDA,
                dado.VLRUNITCUSTO,
                dado.STCONFERIDO,
                dado.IDUSRAJUSTE,
                dado.STATIVO,   
                dado.STFALTA,
                dado.STSOBRA
            ];
            
            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Detalhe Ordem de Transferência atualizado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Detalhe Ordem de Transferência: ${e.message}`);
    }
};


export const createResumoOrdemTransferencia = async (dados) => {
    try {
        const querySeq = `SELECT "${databaseSchema}".SEQ_RESUMOORDEMTRANSFERENCIA.NEXTVAL AS IDRESUMOOT FROM DUMMY`;
        const [seqResult] = await conn.exec(querySeq);
        const idResumoOT = seqResult.IDRESUMOOT;

        const query = `
            INSERT INTO "${databaseSchema}"."RESUMOORDEMTRANSFERENCIA" 
                (
                "IDRESUMOOT", 
                "IDEMPRESAORIGEM", 
                "IDEMPRESADESTINO", 
                "DATAEXPEDICAO",
                "IDOPERADOREXPEDICAO", 
                "NUTOTALITENS", 
                "QTDTOTALITENS", 
                "QTDTOTALITENSRECEPCIONADO",
                "QTDTOTALITENSDIVERGENCIA", 
                "NUTOTALVOLUMES", 
                "TPVOLUME", 
                "VRTOTALCUSTO",
                "VRTOTALVENDA", 
                "DTRECEPCAO", 
                "IDOPERADORRECEPTOR", 
                "DSOBSERVACAO",
                "IDUSRCANCELAMENTO", 
                "DTULTALTERACAO", 
                "IDSTDIVERGENCIA", 
                "OBSDIVERGENCIA",
                "STEMISSAONFE", 
                "NUMERONFE", 
                "STENTRADAINVENTARIO", 
                "QTDCONFERENCIA",
                "IDSTATUSOT", 
                "IDUSRAJUSTE", 
                "DTAJUSTE", 
                "QTDTOTALITENSAJUSTE"
            ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const statement = await conn.prepare(query);

        for (const dado of dados) {
            const params = [
                idResumoOT,
                dado.IDEMPRESAORIGEM,
                dado.IDEMPRESADESTINO,
                dado.IDOPERADOREXPEDICAO,
                dado.NUTOTALITENS,
                dado.QTDTOTALITENS,
                dado.QTDTOTALITENSRECEPCIONADO,
                dado.QTDTOTALITENSDIVERGENCIA,
                dado.NUTOTALVOLUMES,
                dado.TPVOLUME,
                dado.VRTOTALCUSTO,
                dado.VRTOTALVENDA,
                dado.DTRECEPCAO,
                dado.IDOPERADORRECEPTOR,
                dado.DSOBSERVACAO,
                dado.IDUSRCANCELAMENTO,
                dado.IDSTDIVERGENCIA,
                dado.OBSDIVERGENCIA,
                dado.STEMISSAONFE,
                dado.NUMERONFE,
                dado.STENTRADAINVENTARIO,
                dado.QTDCONFERENCIA,
                dado.IDSTATUSOT,
                dado.IDUSRAJUSTE,
                dado.DTAJUSTE,
                dado.QTDTOTALITENSAJUSTE
                
            ];
            
            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Detalhe Ordem de Transferência atualizado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Detalhe Ordem de Transferência: ${e.message}`);
    }
};

export const updateResumoOrdemTransferencia = async (bodyJson) => {
    try {
        const { IDSTATUSOT, IDRESUMOOT  } = bodyJson[0] || {};

        let idStatusOt = bodyJson.IDSTATUSOT;
        let idResumoOT = bodyJson.IDRESUMOOT;

         // rotina para atualizar a OT, que ainda está na origem
        if(idStatusOt === 1) {
            let query1 = `
                UPDATE "${databaseSchema}"."RESUMOORDEMTRANSFERENCIA" SET 
                "NUTOTALITENS" = ?, "QTDTOTALITENS" = ?, "VRTOTALCUSTO" = ?, "VRTOTALVENDA" = ?, "DTULTALTERACAO" = NOW() 
                WHERE "IDRESUMOOT" = ?
            `;
            const statement1 = await conn.prepare(query1);
            const params1 = [
                bodyJson.NUTOTALITENS,
                bodyJson.QTDTOTALITENS,
                bodyJson.VRTOTALCUSTO,
                bodyJson.VRTOTALVENDA,
                idResumoOT
            ];
            await statement1.exec(params1);

            let querydet1 = `DELETE FROM "${databaseSchema}".DETALHEORDEMTRANSFERENCIA WHERE IDRESUMOOT = ?`;
            const statementdet1 = await conn.prepare(querydet1);
            const paramsdet1 = [idResumoOT];
            await statementdet1.exec(paramsdet1);

            await updateDetalheOT(idResumoOT, bodyJson[1]);
        }

        // rotina para cancelar a OT, que ainda está na origem
        if(idStatusOt === 2) {
            let query2 = `
                UPDATE "${databaseSchema}"."RESUMOORDEMTRANSFERENCIA" SET 
                "IDUSRCANCELAMENTO" = ?, "DTULTALTERACAO" = NOW(), "IDSTATUSOT" = ? 
                WHERE "IDRESUMOOT" = ?
            `;

            const statement2 = await conn.prepare(query2);
            const params2 = [
                bodyJson.IDUSRCANCELAMENTO,
                idStatusOt,
                idResumoOT
            ];
            await statement2.exec(params2);
            
            let querydet2 = `UPDATE "${databaseSchema}"."DETALHEORDEMTRANSFERENCIA" SET "STATIVO" = ? WHERE "IDRESUMOOT" = ?`;
            const statementdet2 = await conn.prepare(querydet2);
            const paramsdet2 = ['False', idResumoOT];
            await statementdet2.exec(paramsdet2);
        }

        // rotina para gravar a nota e liberar a OT para contagem STEMISSAONFE, NUMERONFE, IDSTATUSOT
        if(idStatusOt === 3) {
            let query3 = `
                UPDATE "${databaseSchema}"."RESUMOORDEMTRANSFERENCIA" SET 
                "STEMISSAONFE" = ?, "NUMERONFE" = ?, "IDSTATUSOT" = ?, "DTULTALTERACAO" = NOW() 
                WHERE "IDRESUMOOT" = ?
            `;
            const statement3 = await conn.prepare(query3);
            const params3 = [
                'True',
                '',
                idStatusOt,
                idResumoOT
            ];
            await statement3.exec(params3);

        }

        // rotina para atualizar a quantidade recepcionada da OT, bem como incluir produtos nãos listados na origem

        if (idStatusOt === 4) {
            let query4 = `
                UPDATE "${databaseSchema}"."RESUMOORDEMTRANSFERENCIA" SET 
                "QTDTOTALITENSRECEPCIONADO" = ?, "DTRECEPCAO" = NOW(), "IDOPERADORRECEPTOR" = ?, "DTULTALTERACAO" = NOW() 
                WHERE "IDRESUMOOT" = ?
            `;
            const statement4 = await conn.prepare(query4);
            const params4 = [
                bodyJson.QTDTOTALITENSRECEPCIONADO,
                bodyJson.IDOPERADORRECEPTOR,
                idResumoOT,
            ];
            await statement4.exec(params4);

            for (const detalhe of bodyJson.dadosdetalheot) {
                let queryCheckProduto = `
                    SELECT COUNT(1) AS "COUNT" 
                    FROM "${databaseSchema}"."DETALHEORDEMTRANSFERENCIA" 
                    WHERE "STATIVO" = 'True' AND "IDRESUMOOT" = ? AND "IDPRODUTO" = ?
                `;
                const checkProdutoStmt = await conn.prepare(queryCheckProduto);
                const checkProdutoParams = [idResumoOT, detalhe.IDPRODUTO];
                const result = await checkProdutoStmt.exec(checkProdutoParams);

                if (result[0].COUNT > 0) {
                    let queryUpdateDetalhe = `
                        UPDATE "${databaseSchema}"."DETALHEORDEMTRANSFERENCIA" SET 
                        "QTDRECEPCAO" = ?, "STCONFERIDO" = ? 
                        WHERE "IDRESUMOOT" = ? AND "IDPRODUTO" = ?
                    `;
                    const statementUpdateDetalhe = await conn.prepare(queryUpdateDetalhe);
                    const paramsUpdateDetalhe = [
                        detalhe.QTDRECEPCAO,
                        detalhe.STCONFERIDO,
                        idResumoOT,
                        detalhe.IDPRODUTO,
                    ];
                    await statementUpdateDetalhe.exec(paramsUpdateDetalhe);
                } else {
                    let queryInsertDetalhe = `
                        INSERT INTO "${databaseSchema}"."DETALHEORDEMTRANSFERENCIA" (
                            "IDDETALHEOT", "IDPRODUTO", "IDRESUMOOT", "QTDEXPEDICAO", 
                            "QTDRECEPCAO", "QTDDIFERENCA", "QTDAJUSTE", "VLRUNITVENDA", 
                            "VLRUNITCUSTO", "STCONFERIDO", "IDUSRAJUSTE", "STATIVO", 
                            "STFALTA", "STSOBRA"
                        ) VALUES (
                            "${databaseSchema}".SEQ_DETALHEORDEMTRANSFERENCIA.NEXTVAL, ?, ?, ?, 
                            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                        )
                    `;
                    const statementInsertDetalhe = await conn.prepare(queryInsertDetalhe);
                    const paramsInsertDetalhe = [
                        detalhe.IDPRODUTO,
                        idResumoOT,
                        detalhe.QTDEXPEDICAO,
                        detalhe.QTDRECEPCAO,
                        detalhe.QTDDIFERENCA,
                        detalhe.QTDAJUSTE,
                        detalhe.VLRUNITVENDA,
                        detalhe.VLRUNITCUSTO,
                        detalhe.STCONFERIDO,
                        detalhe.IDUSRAJUSTE || null,
                        detalhe.STATIVO,
                        detalhe.STFALTA,
                        detalhe.STSOBRA,
                    ];
                    await statementInsertDetalhe.exec(paramsInsertDetalhe);
                }
            }
        }

        // rotina para excluir produtos que foram incluídos na recepção

        if (idStatusOt === 5) {
            const countQuery = `
                SELECT COUNT(1) AS COUNT 
                FROM "${databaseSchema}".DETALHEORDEMTRANSFERENCIA 
                WHERE STATIVO = 'True' AND IDRESUMOOT = ? AND IDPRODUTO = ?
            `;
            const countResult = await conn.exec(countQuery, [idResumoOT, bodyJson.IDPRODUTO]);

            if (countResult[0]?.COUNT > 0) {
                const deleteQuery = `
                    DELETE FROM "VAR_DB_NAME".DETALHEORDEMTRANSFERENCIA 
                    WHERE IDRESUMOOT = ? AND IDPRODUTO = ?
                `;
                await conn.exec(deleteQuery, [idResumoOT, bodyJson.IDPRODUTO]);
            }
        }


        // rotina para realizar o fechamento da recepção da OT
        if(idStatusOt === 6) {
            const query6 = `CALL "${databaseSchema}".SP_FINALIZAROT(?, ?)`;
            const statement6 = await conn.prepare(query6);
            const params6 = [idResumoOT, bodyJson.IDOPERADORRECEPTOR, bodyJson.QTDCONFERENCIA];
            await statement6.exec(params6);
        }

        // rotina para atualizar os produtos da OT, bem como incluir produtos nãos listados na origem, no momento do Ajuste (Prevenção e Perdas)

        if(idStatusOt === 7) {
            const querydetupd7 = `
                UPDATE "${databaseSchema}"."DETALHEORDEMTRANSFERENCIA" 
                SET "QTDAJUSTE" = ?, "IDUSRAJUSTE" = ? 
                WHERE "IDRESUMOOT" = ? AND "IDPRODUTO" = ?
            `;

            for(const detalhe of bodyJson.dadosdetalheot) {
                let idProduto = detalhe.IDPRODUTO;

                const countQuery = `
                    SELECT COUNT(1) 
                    FROM "${databaseSchema}".DETALHEORDEMTRANSFERENCIA
                    WHERE STATIVO = \'True\' 
                    AND IDRESUMOOT = ? AND IDPRODUTO = ? 
                `;

                const countResult = await conn.query(countQuery, [idResumoOT, idProduto]);
                if(countResult.rows[0].count > 0) {
                    await conn.query(querydetupd7, [
                        detalhe.QTDAJUSTE,
                        detalhe.IDUSRAJUSTE,
                        idResumoOT,
                        idProduto,
                    ]);
                } else {
                    const querydetins7 = `
                        INSERT INTO "${databaseSchema}"."DETALHEORDEMTRANSFERENCIA" (
                        "IDDETALHEOT", "IDPRODUTO", "IDRESUMOOT", "QTDEXPEDICAO", 
                        "QTDRECEPCAO", "QTDDIFERENCA", "QTDAJUSTE", "VLRUNITVENDA", 
                        "VLRUNITCUSTO", "STCONFERIDO", "IDUSRAJUSTE", "STATIVO", 
                        "STFALTA", "STSOBRA"
                        ) VALUES (
                        "${databaseSchema}".SEQ_DETALHEORDEMTRANSFERENCIA.NEXTVAL,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    await conn.query(querydetins7, [
                        idProduto,
                        idResumoOT,
                        detalhe.QTDEXPEDICAO,
                        detalhe.QTDRECEPCAO,
                        detalhe.QTDDIFERENCA,
                        detalhe.QTDAJUSTE,
                        detalhe.VLRUNITVENDA,
                        detalhe.VLRUNITCUSTO,
                        detalhe.STCONFERIDO,
                        detalhe.IDUSRAJUSTE || null,
                        detalhe.STATIVO,
                        detalhe.STFALTA,
                        detalhe.STSOBRA,
                    ]);
                }

            }
        }


        // rotina para realizar o encerramento  OT
        if(idStatusOt === 8) {
            const query6 = `CALL "${databaseSchema}".SP_ENCERRAROT (?, ?, ?, ?)`;
            const statement6 = await conn.prepare(query6);
            const params6 = [idResumoOT, bodyJson.IDUSRAJUSTE, bodyJson.IDSTDIVERGENCIA, bodyJson.OBSDIVERGENCIA];
            await statement6.exec(params6);
        }
    } catch (e) {
        throw new Error(`Erro ao atualizar Resumo Ordem de Transferência: ${e.message}`);
    }
}