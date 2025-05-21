import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

function padLeft(number, length, character) {
	if(character == null) {
		character = '0';
    }
	var result = String(number);
	for(var i = result.length; i < length; ++i) {
		result = character + result;
	}
	return result;
}




export const incluirInventarioMovimentoSaida = async (idEmpresa, lstProdMov) => {
    try {
        const date = new Date();
        const dd = ("0" + date.getDate()).slice(-2);
        const mm = ("0" + (date.getMonth() + 1)).slice(-2);
        const y = date.getFullYear();
        const data = `${y}-${mm}-${dd}`;

        for (let i = 0; i < lstProdMov.length; i++) {
            const registro = lstProdMov[i];

            // Verifica se já existe movimento no dia
            const queryExistsMov = `
                SELECT * FROM ${databaseSchema}.INVENTARIOMOVIMENTO 
                WHERE IDPRODUTO = ? 
                AND (DTMOVIMENTO BETWEEN '${data} 00:00:00' AND '${data} 23:59:59') 
                AND IDEMPRESA = ? AND STATIVO = 'True'`;

            const paramsExistsMov = [registro.IDPRODUTO, idEmpresa];
            const statementExistsMov = await conn.prepare(queryExistsMov);
            const idMovExists = await statementExistsMov.exec(paramsExistsMov);

            let qtdInicio = 0;
            let qtdEntradaVoucher = -parseInt(registro.QTD);
            let qtdFinal = 0;

            if (idMovExists.length === 0) {
                // Não existe movimento no dia
                const queryMovAnt = `
                    SELECT * FROM ${databaseSchema}.INVENTARIOMOVIMENTO 
                    WHERE STATIVO = 'True' 
                    AND IDPRODUTO = ? AND IDEMPRESA = ?`;

                const paramsMovAnt = [registro.IDPRODUTO, idEmpresa];
                const statementMovAnt = await conn.prepare(queryMovAnt);
                const UltMovimentoProduto = await statementMovAnt.exec(paramsMovAnt);

                if (UltMovimentoProduto.length > 0) {
                    qtdInicio = parseInt(UltMovimentoProduto[0].QTDFINAL);
                    qtdFinal = qtdInicio + qtdEntradaVoucher;

                    // Atualiza o status do último movimento para 'False'
                    const queryAtualizaStatus = `
                        UPDATE ${databaseSchema}.INVENTARIOMOVIMENTO 
                        SET "STATIVO" = 'False' 
                        WHERE "IDINVMOVIMENTO" = ?`;

                    const paramsAtualizaStatus = [UltMovimentoProduto[0].IDINVMOVIMENTO];
                    const statementAtualizaStatus = await conn.prepare(queryAtualizaStatus);
                    await statementAtualizaStatus.exec(paramsAtualizaStatus);
                    await conn.commit();
                } else {
                    qtdInicio = 0;
                    qtdFinal = qtdInicio + qtdEntradaVoucher;
                }

                // Inserir novo movimento de saída
                const queryInsertMov = `
                    INSERT INTO ${databaseSchema}.INVENTARIOMOVIMENTO (
                        "IDINVMOVIMENTO", 
                        "IDEMPRESA", 
                        "DTMOVIMENTO", 
                        "IDPRODUTO", 
                        "QTDINICIO", 
                        "QTDENTRADAVOUCHER", 
                        "QTDENTRADA", 
                        "QTDSAIDA", 
                        "QTDSAIDATRANSFERENCIA", 
                        "QTDRETORNOAJUSTEPEDIDO", 
                        "QTDFINAL", 
                        "QTDAJUSTEBALANCO", 
                        "STATIVO"
                    ) 
                    VALUES (${databaseSchema}.SEQ_INVENTARIOMOVIMENTO.NEXTVAL, ?, now(), ?, ?, ?, 0, 0, 0, 0, ?, 0, 'True')`;

                const paramsInsertMov = [idEmpresa, registro.IDPRODUTO, qtdInicio, qtdEntradaVoucher, qtdFinal];
                const statementInsertMov = await conn.prepare(queryInsertMov);
                await statementInsertMov.exec(paramsInsertMov);
                await conn.commit();
            } else {
                // Movimento já existe, atualizar
                qtdInicio = parseInt(idMovExists[0].QTDINICIO);
                const qtdSaida = parseInt(idMovExists[0].QTDSAIDA);
                qtdEntradaVoucher = parseInt(idMovExists[0].QTDENTRADAVOUCHER) - parseInt(registro.QTD);
                qtdFinal = qtdInicio + parseInt(idMovExists[0].QTDENTRADA) + qtdEntradaVoucher - qtdSaida + parseInt(idMovExists[0].QTDSAIDATRANSFERENCIA);

                const queryAtualizaMovimento = `
                    UPDATE ${databaseSchema}.INVENTARIOMOVIMENTO 
                    SET "QTDFINAL" = ?, "QTDENTRADAVOUCHER" = ? 
                    WHERE "IDINVMOVIMENTO" = ?`;

                const paramsAtualizaMovimento = [qtdFinal, qtdEntradaVoucher, idMovExists[0].IDINVMOVIMENTO];
                const statementAtualizaMovimento = await conn.prepare(queryAtualizaMovimento);
                await statementAtualizaMovimento.exec(paramsAtualizaMovimento);
                await conn.commit();
            }
        }
    } catch (error) {
        console.error('Erro ao incluir movimentação de saída do inventário', error);
        throw error;
    }
};

export const getAtualizaStatusProdutosOrigemVoucher = async (idVoucher, stAtivo, stCancelado, stStatus,  page, pageSize) => {
    try {
        let stTroca = 'False'    
        
        if(stCancelado === 'False') {
            stTroca = 'True'
            let queryProdVoucher = `
                SELECT
                    TBRV."IDEMPRESAORIGEM",
                    TBDV."IDVOUCHER",
                    TBDV."IDPRODUTO",
                    TBDV."QTD",
                    TBRV."STATIVO",
                    TBRV."STCANCELADO",
                    TBRV."STSTATUS"
                FROM
                    ${databaseSchema}.RESUMOVOUCHER TBRV
                INNER JOIN ${databaseSchema}.DETALHEVOUCHER TBDV ON
                    TBRV."IDVOUCHER" = TBDV."IDVOUCHER"
                WHERE
                    TBDV."IDVOUCHER" = ?
                ORDER BY
                    IDVOUCHER
            `;
            
            const params = [idVoucher];
            const statement = await conn.prepare(queryProdVoucher);
            const result = await statement.exec(params);
            if((stStatus === 'NOVO' || stStatus === 'EM ANALISE' || stStatus === 'LIBERADO PARA O CLIENTE' || stStatus === 'FINALIZADO') && 
            (!detalheProdVoucher[0].STSTATUS || detalheProdVoucher[0].STSTATUS === 'CANCELADO' || detalheProdVoucher[0].STSTATUS === 'NEGADO')) {
                await incluirInventarioMovimentoEntrada(detalheProdVoucher[0].IDEMPRESAORIGEM, detalheProdVoucher);
            }
        } else {
            let queryProdVoucher = `
                SELECT
                    TBRV."IDEMPRESAORIGEM",
                    TBDV."IDVOUCHER",
                    TBDV."IDPRODUTO",
                    TBDV."QTD",
                    TBRV."STATIVO",
                    TBRV."STCANCELADO",
                    TBRV."STSTATUS"
                FROM
                    ${databaseSchema}.RESUMOVOUCHER TBRV
                INNER JOIN ${databaseSchema}.DETALHEVOUCHER TBDV ON
                    TBRV."IDVOUCHER" = TBDV."IDVOUCHER"
                WHERE
                    TBDV."IDVOUCHER" = ?
                ORDER BY
                    IDVOUCHER
            `;
            const params = [idVoucher];
            const statement = await conn.prepare(queryProdVoucher);
            const result = await statement.exec(params);
            if ((stStatus === 'CANCELADO' || stStatus === 'NEGADO') &&
            (!detalheProdVoucher[0].STSTATUS || detalheProdVoucher[0].STSTATUS === 'NOVO' || detalheProdVoucher[0].STSTATUS === 'EM ANALISE' || detalheProdVoucher[0].STSTATUS === 'LIBERADO PARA O CLIENTE' || detalheProdVoucher[0].STSTATUS === 'FINALIZADO')) {
                // Chamar função para inclusão de movimentação de saída
                await incluirInventarioMovimentoSaida(detalheProdVoucher[0].IDEMPRESAORIGEM, detalheProdVoucher);
            }
        }
        
    
        // Atualizar detalhe voucher
        let queryDetalheVoucher = `
            UPDATE ${databaseSchema}.DETALHEVOUCHER 
            SET "STATIVO" = ?, "STCANCELADO" = ? 
            WHERE "IDVOUCHER" = ?`;

        let detalheParams = [stAtivo, stCancelado, idVoucher];
        let statementDetalheVoucher = await conn.prepare(queryDetalheVoucher);
        await statementDetalheVoucher.exec(detalheParams);

        await conn.commit();

        return { msg: "Atualização realizada com sucesso!" };
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};

export const updateResumoVoucher = async (data) => {
    try {
      const query = `
        UPDATE "${databaseSchema}"."RESUMOVOUCHER" 
        SET 
          "STATIVO" = ?,
          "STCANCELADO" = ?,
          "DSMOTIVOCANCELAMENTO" = ?,
          "IDUSRCANCELAMENTO" = ?,
          "STSTATUS" = ?,
          "STTIPOTROCA" = ?,
        WHERE 
          "IDVOUCHER" = ?`;
  
      const statement = conn.prepare(query);
  
      for (const registro of data) {
   
  
        const params = [
          registro.STATIVO,
            registro.STCANCELADO,
            registro.DSMOTIVOCANCELAMENTO,
            registro.IDUSRCANCELAMENTO,
            registro.STSTATUS,
            registro.STTIPOTROCA,
            registro.IDVOUCHER
        ];
  
        await statement.exec(params);
      }
  
      statement.close();
      conn.commit();
  
      return { msg: "Atualização realizada com sucesso!" };
    } catch (error) {
      console.error('Erro ao executar a atualização de funcionários:', error);
      throw error;
    }
};



export const incluirInventarioMovimentoEntrada = async (idEmpresa, lstProd) => {
    try {
        const date = new Date();
        const dd = ("0" + date.getDate()).slice(-2);
        const mm = ("0" + (date.getMonth() + 1)).slice(-2);
        const y = date.getFullYear();
        const dataVoucher = `${y}-${mm}-${dd}`;
  
        for (let i = 0; i < lstProd.length; i++) {
            const registro = lstProd[i];
  
            let queryExistsMov = `
                SELECT * FROM ${databaseSchema}.INVENTARIOMOVIMENTO 
                WHERE IDPRODUTO = ? 
                AND (DTMOVIMENTO BETWEEN '${dataVoucher} 00:00:00' AND '${dataVoucher} 23:59:59') 
                AND IDEMPRESA = ? AND STATIVO = 'True'`;
  
            const paramsExistsMov = [registro.IDPRODUTO, parseInt(idEmpresa)];
            const statementExistsMov = await conn.prepare(queryExistsMov);
            const idMovExists = await statementExistsMov.exec(paramsExistsMov);
  
            let qtdInicio = 0;
            let qtdEntradaVoucher = parseInt(registro.QTD);
            let qtdFinal = 0;
  
            if (idMovExists.length === 0) {
                // Não existe movimento anterior
                let queryMovAnt = `
                    SELECT * FROM ${databaseSchema}.INVENTARIOMOVIMENTO 
                    WHERE STATIVO = 'True' 
                    AND IDPRODUTO = ? AND IDEMPRESA = ?`;
  
                const paramsMovAnt = [registro.IDPRODUTO, parseInt(idEmpresa)];
                const statementMovAnt = await conn.prepare(queryMovAnt);
                const UltMovimentoProduto = await statementMovAnt.exec(paramsMovAnt);
  
                if (UltMovimentoProduto.length > 0) {
                    qtdInicio = parseInt(UltMovimentoProduto[0].QTDFINAL);
                    qtdFinal = qtdInicio + qtdEntradaVoucher;
  
                    // Atualiza o status do último movimento para 'False'
                    let queryAtualizaStatus = `
                        UPDATE ${databaseSchema}.INVENTARIOMOVIMENTO 
                        SET "STATIVO" = 'False' 
                        WHERE "IDINVMOVIMENTO" = ?`;
  
                    const paramsAtualizaStatus = [UltMovimentoProduto[0].IDINVMOVIMENTO];
                    const statementAtualizaStatus = await conn.prepare(queryAtualizaStatus);
                    await statementAtualizaStatus.exec(paramsAtualizaStatus);
                    await conn.commit();
                } else {
                    qtdFinal = qtdInicio + qtdEntradaVoucher;
                }
  
                // Inserir novo movimento
                let queryInsertMov = `
                    INSERT INTO ${databaseSchema}.INVENTARIOMOVIMENTO (
                        "IDINVMOVIMENTO", 
                        "IDEMPRESA", 
                        "DTMOVIMENTO", 
                        "IDPRODUTO", 
                        "QTDINICIO", 
                        "QTDENTRADAVOUCHER", 
                        "QTDENTRADA", 
                        "QTDSAIDA", 
                        "QTDSAIDATRANSFERENCIA", 
                        "QTDRETORNOAJUSTEPEDIDO", 
                        "QTDFINAL", 
                        "QTDAJUSTEBALANCO", 
                        "STATIVO"
                    ) 
                    VALUES (${databaseSchema}.SEQ_INVENTARIOMOVIMENTO.NEXTVAL, ?, now(), ?, ?, ?, 0, 0, 0, 0, ?, 0, 'True')`;
  
                const paramsInsertMov = [parseInt(idEmpresa), registro.IDPRODUTO, qtdInicio, qtdEntradaVoucher, qtdFinal];
                const statementInsertMov = await conn.prepare(queryInsertMov);
                await statementInsertMov.exec(paramsInsertMov);
                await conn.commit();
            } else {
                // Movimento já existe, atualizar
                qtdEntradaVoucher += parseInt(idMovExists[0].QTDENTRADAVOUCHER);
                qtdFinal = parseInt(idMovExists[0].QTDINICIO) + parseInt(idMovExists[0].QTDENTRADA) + qtdEntradaVoucher - parseInt(idMovExists[0].QTDSAIDA) + parseInt(idMovExists[0].QTDSAIDATRANSFERENCIA);
  
                let queryAtualizaMovimento = `
                    UPDATE ${databaseSchema}.INVENTARIOMOVIMENTO 
                    SET "QTDENTRADAVOUCHER" = ?, "QTDFINAL" = ? 
                    WHERE "IDINVMOVIMENTO" = ?`;
  
                const paramsAtualizaMovimento = [qtdEntradaVoucher, qtdFinal, idMovExists[0].IDINVMOVIMENTO];
                const statementAtualizaMovimento = await conn.prepare(queryAtualizaMovimento);
                await statementAtualizaMovimento.exec(paramsAtualizaMovimento);
                await conn.commit();
            }
        }
    } catch (error) {
        console.error('Erro ao incluir movimentação de inventário', error);
        throw error;
    }
};

export const incluirDetalheVoucher = async (idVoucher, lstDet, conn) => {
    try {
        
        const query = `
            INSERT INTO "${databaseSchema}"."DETALHEVOUCHER"  
            (
                "IDDETALHEVOUCHER",
                "IDVOUCHER",
                "IDPRODUTO",
                "QTD",
                "VRUNIT",
                "VRTOTALBRUTO",
                "VRDESCONTO",
                "VRTOTALLIQUIDO",
                "STATIVO",
                "STCANCELADO"
            ) 
            VALUES(?,?,?,?,?,?,?,?,?,?)
        `;

        // Itera sobre os detalhes do voucher
        for (const registro of lstDet) {
            // Gera o próximo ID para "IDDETALHEVOUCHER"
            const queryId = `
                SELECT IFNULL(MAX(TO_INT("IDDETALHEVOUCHER")), 0) + 1 AS NEXT_ID 
                FROM "${databaseSchema}"."DETALHEVOUCHER"
            `;
            const [result] = await conn.exec(queryId);
            const nextId = result.NEXT_ID;

            // Prepara os parâmetros para a inserção
            const params = [
                nextId,
                idVoucher,
                registro.IDPRODUTO,
                parseFloat(registro.QTD),
                parseFloat(registro.VRUNIT),
                parseFloat(registro.VRTOTALBRUTO),
                parseFloat(registro.VRDESCONTO),
                parseFloat(registro.VRTOTALLIQUIDO),
                registro.STATIVO,
                registro.STCANCELADO
            ];


            const statement = await conn.prepare(query);
            await statement.exec(params);
        }

        // Confirma a transação
        await conn.commit();
        console.log("Detalhes do voucher incluídos com sucesso!");
    } catch (error) {
        console.error("Erro ao incluir detalhes do voucher:", error);
        throw error;
    }
};

export const createResumoVoucher = async (data) => {
    try {
        const query = `
        INSERT INTO "${databaseSchema}"."RESUMOVOUCHER" 
            (   
                "IDVOUCHER",
                "IDEMPRESAORIGEM",
                "IDCAIXAORIGEM",
                "IDNFEDEVOLUCAO",
                "DTINVOUCHER",
                "IDUSRINVOUCHER",
                "IDVENDEDOR",
                "IDCLIENTE",
                "VRVOUCHER",
                "NUVOUCHER",
                "STATIVO",
                "STCANCELADO",
                "IDRESUMOVENDAWEB",
                "STSTATUS",
                "STTIPOTROCA",
                "MOTIVOTROCA",
                "IDUSRLIBERACAOCRIACAO"
            ) 
            VALUES(?,?,?,?,now(),?,?,?,?,?,?,?,?,?,?,?,?)
        `;
            
            const idQuery = `SELECT IFNULL(MAX(TO_INT("IDVOUCHER")), 0) + 1 FROM "${databaseSchema}"."RESUMOVOUCHER" WHERE 1 = 1`;
      const statement = conn.prepare(query);
  
      for (const registro of data) {
   
  
        const params = [
          registro.IDVOUCHER,
            registro.IDEMPRESAORIGEM,
            registro.IDCAIXAORIGEM,
            registro.IDNFEDEVOLUCAO,
            registro.DTINVOUCHER,
            registro.IDUSRINVOUCHER,
            registro.IDVENDEDOR,
            registro.IDCLIENTE,
            registro.VRVOUCHER,
            padLeft(registro.NUVOUCHER, 10, '0'),
            registro.STATIVO,
            registro.STCANCELADO,
            registro.IDRESUMOVENDAWEB,
            registro.STSTATUS,
            registro.STTIPOTROCA,
            registro.MOTIVOTROCA,
            registro.IDUSRLIBERACAOCRIACAO
        ];
  
        await statement.exec(params);
      }
  
      statement.close();
      conn.commit();
  
      return { msg: "Atualização realizada com sucesso!" };
    } catch (error) {
      console.error('Erro ao executar a atualização de funcionários:', error);
      throw error;
    }
};



// export const incluirInventarioMovimentoEntradas = async (idEmpresa, lstProd, conn) => {
//     try {
//         const date = new Date();
//         const dd = ("0" + date.getDate()).slice(-2);
//         const mm = ("0" + (date.getMonth() + 1)).slice(-2);
//         const y = date.getFullYear();
//         const dataVoucher = `${y}-${mm}-${dd}`;

//         for (const registro of lstProd) {
//             let queryExistsMov = `
//                 SELECT * FROM "${databaseSchema}"."INVENTARIOMOVIMENTO" 
//                 WHERE IDPRODUTO = ? 
//                 AND (DTMOVIMENTO BETWEEN '${dataVoucher} 00:00:00' AND '${dataVoucher} 23:59:59') 
//                 AND IDEMPRESA = ? AND STATIVO = 'True'`;

//             const paramsExistsMov = [registro.IDPRODUTO, parseInt(idEmpresa)];
//             const statementExistsMov = await conn.prepare(queryExistsMov);
//             const idMovExists = await statementExistsMov.exec(paramsExistsMov);
//             await statementExistsMov.close();

//             let qtdInicio = 0;
//             let qtdEntradaVoucher = parseInt(registro.QTD);
//             let qtdFinal = 0;

//             if (idMovExists.length === 0) {
//                 let queryMovAnt = `
//                     SELECT * FROM "${databaseSchema}"."INVENTARIOMOVIMENTO" 
//                     WHERE STATIVO = 'True' 
//                     AND IDPRODUTO = ? AND IDEMPRESA = ?`;

//                 const paramsMovAnt = [registro.IDPRODUTO, parseInt(idEmpresa)];
//                 const statementMovAnt = await conn.prepare(queryMovAnt);
//                 const UltMovimentoProduto = await statementMovAnt.exec(paramsMovAnt);
//                 await statementMovAnt.close();

//                 if (UltMovimentoProduto.length > 0) {
//                     qtdInicio = parseInt(UltMovimentoProduto[0].QTDFINAL);
//                     qtdFinal = qtdInicio + qtdEntradaVoucher;

//                     let queryAtualizaStatus = `
//                         UPDATE "${databaseSchema}"."INVENTARIOMOVIMENTO" 
//                         SET "STATIVO" = 'False' 
//                         WHERE "IDINVMOVIMENTO" = ?`;

//                     const paramsAtualizaStatus = [UltMovimentoProduto[0].IDINVMOVIMENTO];
//                     const statementAtualizaStatus = await conn.prepare(queryAtualizaStatus);
//                     await statementAtualizaStatus.exec(paramsAtualizaStatus);
//                     await statementAtualizaStatus.close();
//                 } else {
//                     qtdFinal = qtdInicio + qtdEntradaVoucher;
//                 }

//                 let queryInsertMov = `
//                     INSERT INTO "${databaseSchema}"."INVENTARIOMOVIMENTO" (
//                         "IDINVMOVIMENTO", 
//                         "IDEMPRESA", 
//                         "DTMOVIMENTO", 
//                         "IDPRODUTO", 
//                         "QTDINICIO", 
//                         "QTDENTRADAVOUCHER", 
//                         "QTDENTRADA", 
//                         "QTDSAIDA", 
//                         "QTDSAIDATRANSFERENCIA", 
//                         "QTDRETORNOAJUSTEPEDIDO", 
//                         "QTDFINAL", 
//                         "QTDAJUSTEBALANCO", 
//                         "STATIVO"
//                     ) 
//                     VALUES ("${databaseSchema}"."SEQ_INVENTARIOMOVIMENTO".NEXTVAL, ?, now(), ?, ?, ?, 0, 0, 0, 0, ?, 0, 'True')`;

//                 const paramsInsertMov = [
//                     parseInt(idEmpresa),
//                     registro.IDPRODUTO,
//                     qtdInicio,
//                     qtdEntradaVoucher,
//                     qtdFinal
//                 ];

//                 const statementInsertMov = await conn.prepare(queryInsertMov);
//                 await statementInsertMov.exec(paramsInsertMov);
//                 await statementInsertMov.close();
//             } else {
//                 qtdEntradaVoucher += parseInt(idMovExists[0].QTDENTRADAVOUCHER);
//                 qtdFinal = parseInt(idMovExists[0].QTDINICIO) + parseInt(idMovExists[0].QTDENTRADA) + 
//                           qtdEntradaVoucher - parseInt(idMovExists[0].QTDSAIDA) - 
//                           parseInt(idMovExists[0].QTDSAIDATRANSFERENCIA);

//                 let queryAtualizaMovimento = `
//                     UPDATE "${databaseSchema}"."INVENTARIOMOVIMENTO" 
//                     SET "QTDENTRADAVOUCHER" = ?, "QTDFINAL" = ? 
//                     WHERE "IDINVMOVIMENTO" = ?`;

//                 const paramsAtualizaMovimento = [
//                     qtdEntradaVoucher, 
//                     qtdFinal, 
//                     idMovExists[0].IDINVMOVIMENTO
//                 ];

//                 const statementAtualizaMovimento = await conn.prepare(queryAtualizaMovimento);
//                 await statementAtualizaMovimento.exec(paramsAtualizaMovimento);
//                 await statementAtualizaMovimento.close();
//             }
//         }
//     } catch (error) {
//         console.error('Erro ao incluir movimentação de inventário', error);
//         throw error;
//     }
// };

// export const createResumoVouchers = async (data) => {
//     let conn;
//     try {
//         conn = await getConnection(); // Obter uma nova conexão
        
//         // Iniciar transação
//         await conn.exec("BEGIN TRANSACTION");

//         // Obter próximo ID para Voucher
//         const idQuery = `SELECT IFNULL(MAX(TO_INT("IDVOUCHER")), 0) + 1 AS NEXT_ID FROM "${databaseSchema}"."RESUMOVOUCHER"`;
//         const [idResult] = await conn.exec(idQuery);
//         const nextVoucherId = idResult.NEXT_ID;

//         const query = `
//             INSERT INTO "${databaseSchema}"."RESUMOVOUCHER" 
//             (   
//                 "IDVOUCHER",
//                 "IDEMPRESAORIGEM",
//                 "IDCAIXAORIGEM",
//                 "IDNFEDEVOLUCAO",
//                 "DTINVOUCHER",
//                 "IDUSRINVOUCHER",
//                 "IDVENDEDOR",
//                 "IDCLIENTE",
//                 "VRVOUCHER",
//                 "NUVOUCHER",
//                 "STATIVO",
//                 "STCANCELADO",
//                 "IDRESUMOVENDAWEB",
//                 "STSTATUS",
//                 "STTIPOTROCA",
//                 "MOTIVOTROCA",
//                 "IDUSRLIBERACAOCRIACAO"
//             ) 
//             VALUES(?,?,?,?,now(),?,?,?,?,?,?,?,?,?,?,?,?)
//         `;

//         const statement = await conn.prepare(query);

//         for (const registro of data) {
//             // Formatar número do voucher conforme original
//             const numVoucher = padLeft(registro.IDGRUPOEMPRESARIAL, 2) + 
//                              padLeft(registro.IDEMPRESAORIGEM, 3) + 
//                              padLeft(registro.IDCAIXAORIGEM, 5) + 
//                              padLeft(registro.IDUSRLIBERACAOCRIACAO, 5) + 
//                              nextVoucherId;

//             const params = [
//                 nextVoucherId,
//                 registro.IDEMPRESAORIGEM,
//                 registro.IDCAIXAORIGEM,
//                 registro.IDNFEDEVOLUCAO,
//                 registro.IDUSRINVOUCHER,
//                 registro.IDVENDEDOR || null,
//                 registro.IDCLIENTE,
//                 registro.VRVOUCHER,
//                 numVoucher,
//                 registro.STATIVO,
//                 registro.STCANCELADO,
//                 registro.IDRESUMOVENDAWEB || null,
//                 registro.STSTATUS,
//                 registro.STTIPOTROCA,
//                 registro.MOTIVOTROCA || null,
//                 registro.IDUSRLIBERACAOCRIACAO
//             ];

//             await statement.exec(params);

//             // Incluir detalhes do voucher
//             await incluirDetalheVoucher(nextVoucherId, registro.detVoucher, conn);
            
//             // Incluir movimentação de inventário
//             await incluirInventarioMovimentoEntrada(registro.IDEMPRESAORIGEM, registro.detVoucher, conn);
//         }

//         await statement.close();
//         await conn.exec("COMMIT");

//         return { 
//             success: true,
//             idVoucher: nextVoucherId,
//             msg: "Voucher criado com sucesso!" 
//         };
//     } catch (error) {
//         if (conn) {
//             await conn.exec("ROLLBACK");
//         }
//         console.error('Erro ao criar voucher:', error);
//         throw error;
//     } finally {
//         if (conn) {
//             conn.close();
//         }
//     }
// };