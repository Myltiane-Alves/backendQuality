import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getMalortesPorLoja = async (
    idEmpresa,
    idMalote,
    statusMalote,
    pendenciaMalote,
    dataPesquisaInicio,
    dataPesquisaFim,
    page,
    pageSize
) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
        WITH MOVIMENTO_CAIXA_DADOS AS (
            SELECT DISTINCT 
                NULL AS IDMALOTE,
                TBE.IDEMPRESA,
                TBE.NOFANTASIA,
                TO_DATE(TBV.DTHORAFECHAMENTO) AS DTHORAFECHAMENTO,
                TO_VARCHAR(TO_DATE(TBV.DTHORAFECHAMENTO), 'DD/mm/YYYY') AS DTHORAFECHAMENTOFORMATADA,
                IFNULL (SUM(tbv.VRRECDINHEIRO),0) AS VALORTOTALDINHEIRO, 
                IFNULL (SUM(tbv. VRRECCARTAO),0) AS VALORTOTALCARTAO, 
                IFNULL (SUM(tbv.VRRECCONVENIO),0) AS VALORTOTALCONVENIO, 
                (SELECT IFNULL (SUM(tbvp.VALORRECEBIDO),0) FROM "${databaseSchema}".VENDAPAGAMENTO tbvp INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA=tbv1.IDVENDA WHERE TO_DATE(tbv1.DTHORAFECHAMENTO) = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbv1.IDEMPRESA = tbv.IDEMPRESA AND tbv1.STCANCELADO = 'False' AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) AND tbvp.NOTEF = 'POS' AND (tbvp.DSTIPOPAGAMENTO!='PIX')) AS VALORTOTALPOS, 
                (SELECT IFNULL (SUM(tbvp.VALORRECEBIDO),0) FROM "${databaseSchema}".VENDAPAGAMENTO tbvp INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA=tbv1.IDVENDA WHERE TO_DATE(tbv1.DTHORAFECHAMENTO) = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbv1.IDEMPRESA = tbv.IDEMPRESA AND tbv1.STCANCELADO = 'False' AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) AND tbvp.NOTEF = 'PIX' AND (tbvp.DSTIPOPAGAMENTO ='PIX')) AS VALORTOTALPIX, 
                (SELECT IFNULL (SUM(tbvp.VALORRECEBIDO),0) FROM "${databaseSchema}".VENDAPAGAMENTO tbvp INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA=tbv1.IDVENDA WHERE TO_DATE(tbv1.DTHORAFECHAMENTO) = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbv1.IDEMPRESA = tbv.IDEMPRESA AND tbv1.STCANCELADO = 'False' AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) AND tbvp.NOTEF = 'POS' AND (tbvp.DSTIPOPAGAMENTO ='MoovPay')) AS VALORTOTALMOOVPAY, 
                IFNULL (SUM(tbv.VRRECVOUCHER),0) AS VALORTOTALVOUCHER, 
                (SELECT IFNULL (SUM(tbdf.VRRECEBIDO),0) FROM "${databaseSchema}".DETALHEFATURA tbdf WHERE tbdf.DTPROCESSAMENTO = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbdf.IDEMPRESA = tbv.IDEMPRESA AND tbdf.STCANCELADO = 'False' AND (tbdf.STPIX = 'False' OR tbdf.STPIX IS NULL)) AS VALORTOTALFATURA, 
                (SELECT IFNULL (SUM(tbdf.VRRECEBIDO),0) FROM "${databaseSchema}".DETALHEFATURA tbdf WHERE tbdf.DTPROCESSAMENTO = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbdf.IDEMPRESA = tbv.IDEMPRESA AND tbdf.STCANCELADO = 'False' AND tbdf.STPIX = 'True') AS VALORTOTALFATURAPIX, 
                (SELECT IFNULL (SUM(tbd.VRDESPESA),0) FROM "${databaseSchema}".DESPESALOJA tbd WHERE tbd.DTDESPESA = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbd.IDEMPRESA = tbv.IDEMPRESA AND tbd.STCANCELADO = 'False') AS VALORTOTALDESPESA, 
                (SELECT IFNULL (SUM(tbas.VRVALORDESCONTO),0) FROM "${databaseSchema}".ADIANTAMENTOSALARIAL tbas WHERE tbas.DTLANCAMENTO = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbas.IDEMPRESA = tbv.IDEMPRESA AND tbas.STATIVO = 'True') AS VALORTOTALADIANTAMENTOSALARIAL, 
                (SELECT IFNULL (SUM(dl.VRFISICODINHEIRO),0) FROM "${databaseSchema}".MOVIMENTOCAIXA dl WHERE TO_DATE(dl.DTABERTURA) = TO_DATE(tbv.DTHORAFECHAMENTO) AND dl.IDEMPRESA = tbv.IDEMPRESA AND dl.STCANCELADO = 'False' AND dl.STFECHADO = 'True') AS VRFISICODINHEIRO, 
                (SELECT IFNULL (SUM(dl.VRAJUSTDINHEIRO),0) FROM "${databaseSchema}".MOVIMENTOCAIXA dl WHERE TO_DATE(dl.DTABERTURA) = TO_DATE(tbv.DTHORAFECHAMENTO) AND dl.IDEMPRESA = tbv.IDEMPRESA AND dl.STCANCELADO = 'False' AND dl.STFECHADO = 'True') AS VRAJUSTEDINHEIRO, 
                (SELECT IFNULL (SUM(CASE WHEN IFNULL(dl.VRAJUSTDINHEIRO, 0) <> 0 THEN dl.VRAJUSTDINHEIRO ELSE dl.VRRECDINHEIRO  END ), 0) FROM "${databaseSchema}".MOVIMENTOCAIXA dl WHERE TO_DATE(dl.DTABERTURA) = TO_DATE(tbv.DTHORAFECHAMENTO) AND dl.IDEMPRESA = tbv.IDEMPRESA AND dl.STCANCELADO = 'False' AND dl.STFECHADO = 'True') AS VRRECDINHEIRO,
                0 AS VRTOTALRECEBIDO,
                0 AS VRDISPONIVEL,
                'Pendente de Envio' AS STATUSMALOTE,
                '' AS OBSERVACAOADMINISTRATIVOMALOTE,
                '' AS OBSERVACAOLOJAMALOTE,
                '' AS STATIVOMALOTE,
                '' AS DATAHORACRIACAOMALOTE
            FROM
                "${databaseSchema}".VENDA TBV
            INNER JOIN "${databaseSchema}".EMPRESA TBE ON
                TBE.IDEMPRESA = TBV.IDEMPRESA
            WHERE
                TBV.STCANCELADO='False'
                ${ dataPesquisaInicio ? ` AND (TO_DATE(TBV.DTHORAFECHAMENTO) BETWEEN '${dataPesquisaInicio}' AND '${dataPesquisaFim}' )` : ''}
                ${ idEmpresa ? ' AND TBE.IDEMPRESA = ' + idEmpresa : ''}
            GROUP BY 
                TBE.IDEMPRESA,
                TBV.IDEMPRESA,
                TBE.NOFANTASIA,
                TO_DATE(TBV.DTHORAFECHAMENTO)
        ),
        
        MALOTE_DADOS AS (
            SELECT 
                TBM.IDMALOTE,
                TBE.IDEMPRESA,
                TBE.NOFANTASIA,
                TBM.DATAMOVIMENTOCAIXA AS DTHORAFECHAMENTO,
                TO_VARCHAR(TO_DATE(TBM.DATAMOVIMENTOCAIXA), 'DD/mm/YYYY') AS DTHORAFECHAMENTOFORMATADA,
                TBM.VRDINHEIRO AS VALORTOTALDINHEIRO, 
                TBM.VRCARTAO AS VALORTOTALCARTAO, 
                TBM.VRCONVENIO AS VALORTOTALCONVENIO, 
                TBM.VRPOS AS VALORTOTALPOS, 
                TBM.VRPIX AS VALORTOTALPIX, 
                0 AS VALORTOTALMOOVPAY, 
                TBM.VRVOUCHER AS VALORTOTALVOUCHER, 
                TBM.VRFATURA AS VALORTOTALFATURA, 
                TBM.VRFATURAPIX AS VALORTOTALFATURAPIX, 
                TBM.VRDESPESA AS VALORTOTALDESPESA, 
                0 AS VALORTOTALADIANTAMENTOSALARIAL, 
                0 AS VRFISICODINHEIRO, 
                0 AS VRAJUSTEDINHEIRO, 
                0 AS VRRECDINHEIRO,
                TBM.VRTOTALRECEBIDO,
                TBM.VRDISPONIVEL,
                TBM.STSTATUS AS STATUSMALOTE,
                TO_VARCHAR(TBM.OBSERVACAOADMINISTRATIVO) AS OBSERVACAOADMINISTRATIVOMALOTE,
                TO_VARCHAR(TBM.OBSERVACAOLOJA) AS OBSERVACAOLOJAMALOTE,
                TBM.STATIVO AS STATIVOMAOTE,
                IFNULL(TO_VARCHAR(TO_DATE(TBM.DATAHORACRIACAO), 'DD/mm/YYYY'), '') AS DATAHORACRIACAOMALOTE
            FROM 
                "${databaseSchema}".MALOTECAIXALOJA TBM
            INNER JOIN "${databaseSchema}".EMPRESA TBE ON 
                TBM.IDEMPRESA = TBE.IDEMPRESA 
            WHERE
                TBM.STATIVO ='True'
                ${ idMalote ? ' AND TBM.IDMALOTE = ' + idMalote : ''}
                ${ idEmpresa ? ' AND TBE.IDEMPRESA = ' + idEmpresa : ''}
                ${ statusMalote ? ` AND CONTAINS(TBM.STSTATUS, '${statusMalote}}')` : ''}
                ${ dataPesquisaInicio ? ` AND (TO_DATE(TBM.DATAMOVIMENTOCAIXA) BETWEEN '${dataPesquisaInicio}' AND '${dataPesquisaFim}')` : ''}
            )
            SELECT 
                * 
            FROM 
                MALOTE_DADOS
                
            UNION ALL
                
            SELECT 
                * 
            FROM 
                MOVIMENTO_CAIXA_DADOS TBMC 
            WHERE 
                NOT EXISTS (
                    SELECT 
                        1 
                    FROM 
                        MALOTE_DADOS TBMD 
                    WHERE 
                        TBMD.IDEMPRESA = TBMC.IDEMPRESA 
                        AND TBMD.DTHORAFECHAMENTO = TBMC.DTHORAFECHAMENTO
                        AND 1 = ?
            )
            ORDER BY DTHORAFECHAMENTO
        `;
        
        if(idMalote || (statusMalote && statusMalote !== 'Pendente de Envio')){
            query = `
                SELECT 
                    TBM.IDMALOTE,
                    TBE.IDEMPRESA,
                    TBE.NOFANTASIA,
                    TBM.DATAMOVIMENTOCAIXA AS DTHORAFECHAMENTO,
                    TO_VARCHAR(TO_DATE(TBM.DATAMOVIMENTOCAIXA), 'DD/mm/YYYY') AS DTHORAFECHAMENTOFORMATADA,
                    TBM.VRDINHEIRO AS VALORTOTALDINHEIRO, 
                    TBM.VRCARTAO AS VALORTOTALCARTAO, 
                    TBM.VRCONVENIO AS VALORTOTALCONVENIO, 
                    TBM.VRPOS AS VALORTOTALPOS, 
                    TBM.VRPIX AS VALORTOTALPIX, 
                    0 AS VALORTOTALMOOVPAY, 
                    TBM.VRVOUCHER AS VALORTOTALVOUCHER, 
                    TBM.VRFATURA AS VALORTOTALFATURA, 
                    TBM.VRFATURAPIX AS VALORTOTALFATURAPIX, 
                    TBM.VRDESPESA AS VALORTOTALDESPESA, 
                    0 AS VALORTOTALADIANTAMENTOSALARIAL, 
                    0 AS VRFISICODINHEIRO, 
                    0 AS VRAJUSTEDINHEIRO, 
                    0 AS VRRECDINHEIRO,
                    TBM.VRTOTALRECEBIDO,
                    TBM.VRDISPONIVEL,
                    TBM.STSTATUS AS STATUSMALOTE,
                    TO_VARCHAR(TBM.OBSERVACAOADMINISTRATIVO) AS OBSERVACAOADMINISTRATIVOMALOTE,
                    TO_VARCHAR(TBM.OBSERVACAOLOJA) AS OBSERVACAOLOJAMALOTE,
                    TBM.STATIVO AS STATIVOMAOTE,
                    IFNULL(TO_VARCHAR(TO_DATE(TBM.DATAHORACRIACAO), 'DD/mm/YYYY'), '') AS DATAHORACRIACAOMALOTE
                FROM 
                    "${databaseSchema}".MALOTECAIXALOJA TBM
                INNER JOIN "${databaseSchema}".EMPRESA TBE ON 
                    TBM.IDEMPRESA = TBE.IDEMPRESA 
                WHERE
                    TBM.STATIVO ='True'
                    ${ idMalote ? ' AND TBM.IDMALOTE = ' + idMalote : ''}
                    ${ idEmpresa ? ' AND TBE.IDEMPRESA = ' + idEmpresa : ''}
                    ${ statusMalote ? ` AND CONTAINS(TBM.STSTATUS, '${statusMalote}')` : ''}
                    ${ dataPesquisaInicio ? ` AND (TO_DATE(TBM.DATAMOVIMENTOCAIXA) BETWEEN '${dataPesquisaInicio}' AND '${dataPesquisaFim}')` : ''}
                    AND 1 = ? 
                ORDER BY 
                    TBM.DATAMOVIMENTOCAIXA
            `;
        } else if(statusMalote == 'Pendente de Envio'){
            query = `
                SELECT DISTINCT 
                    NULL AS IDMALOTE,
                    TBE.IDEMPRESA,
                    TBE.NOFANTASIA,
                    TO_DATE(TBV.DTHORAFECHAMENTO) AS DTHORAFECHAMENTO,
                    TO_VARCHAR(TO_DATE(TBV.DTHORAFECHAMENTO), 'DD/mm/YYYY') AS DTHORAFECHAMENTOFORMATADA,
                    IFNULL (SUM(tbv.VRRECDINHEIRO),0) AS VALORTOTALDINHEIRO, 
                    IFNULL (SUM(tbv. VRRECCARTAO),0) AS VALORTOTALCARTAO, 
                    IFNULL (SUM(tbv.VRRECCONVENIO),0) AS VALORTOTALCONVENIO, 
                    (SELECT IFNULL (SUM(tbvp.VALORRECEBIDO),0) FROM "${databaseSchema}".VENDAPAGAMENTO tbvp INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA=tbv1.IDVENDA WHERE TO_DATE(tbv1.DTHORAFECHAMENTO) = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbv1.IDEMPRESA = tbv.IDEMPRESA AND tbv1.STCANCELADO = 'False' AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) AND tbvp.NOTEF = 'POS' AND (tbvp.DSTIPOPAGAMENTO!='PIX')) AS VALORTOTALPOS, 
                    (SELECT IFNULL (SUM(tbvp.VALORRECEBIDO),0) FROM "${databaseSchema}".VENDAPAGAMENTO tbvp INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA=tbv1.IDVENDA WHERE TO_DATE(tbv1.DTHORAFECHAMENTO) = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbv1.IDEMPRESA = tbv.IDEMPRESA AND tbv1.STCANCELADO = 'False' AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) AND tbvp.NOTEF = 'PIX' AND (tbvp.DSTIPOPAGAMENTO ='PIX')) AS VALORTOTALPIX, 
                    (SELECT IFNULL (SUM(tbvp.VALORRECEBIDO),0) FROM "${databaseSchema}".VENDAPAGAMENTO tbvp INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA=tbv1.IDVENDA WHERE TO_DATE(tbv1.DTHORAFECHAMENTO) = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbv1.IDEMPRESA = tbv.IDEMPRESA AND tbv1.STCANCELADO = 'False' AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) AND tbvp.NOTEF = 'POS' AND (tbvp.DSTIPOPAGAMENTO ='MoovPay')) AS VALORTOTALMOOVPAY, 
                    IFNULL (SUM(tbv.VRRECVOUCHER),0) AS VALORTOTALVOUCHER, 
                    (SELECT IFNULL (SUM(tbdf.VRRECEBIDO),0) FROM "${databaseSchema}".DETALHEFATURA tbdf WHERE tbdf.DTPROCESSAMENTO = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbdf.IDEMPRESA = tbv.IDEMPRESA AND tbdf.STCANCELADO = 'False' AND (tbdf.STPIX = 'False' OR tbdf.STPIX IS NULL)) AS VALORTOTALFATURA, 
                    (SELECT IFNULL (SUM(tbdf.VRRECEBIDO),0) FROM "${databaseSchema}".DETALHEFATURA tbdf WHERE tbdf.DTPROCESSAMENTO = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbdf.IDEMPRESA = tbv.IDEMPRESA AND tbdf.STCANCELADO = 'False' AND tbdf.STPIX = 'True') AS VALORTOTALFATURAPIX, 
                    (SELECT IFNULL (SUM(tbd.VRDESPESA),0) FROM "${databaseSchema}".DESPESALOJA tbd WHERE tbd.DTDESPESA = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbd.IDEMPRESA = tbv.IDEMPRESA AND tbd.STCANCELADO = 'False') AS VALORTOTALDESPESA, 
                    (SELECT IFNULL (SUM(tbas.VRVALORDESCONTO),0) FROM "${databaseSchema}".ADIANTAMENTOSALARIAL tbas WHERE tbas.DTLANCAMENTO = TO_DATE(tbv.DTHORAFECHAMENTO) AND tbas.IDEMPRESA = tbv.IDEMPRESA AND tbas.STATIVO = 'True') AS VALORTOTALADIANTAMENTOSALARIAL, 
                    (SELECT IFNULL (SUM(dl.VRFISICODINHEIRO),0) FROM "${databaseSchema}".MOVIMENTOCAIXA dl WHERE TO_DATE(dl.DTABERTURA) = TO_DATE(tbv.DTHORAFECHAMENTO) AND dl.IDEMPRESA = tbv.IDEMPRESA AND dl.STCANCELADO = 'False' AND dl.STFECHADO = 'True') AS VRFISICODINHEIRO, 
                    (SELECT IFNULL (SUM(dl.VRAJUSTDINHEIRO),0) FROM "${databaseSchema}".MOVIMENTOCAIXA dl WHERE TO_DATE(dl.DTABERTURA) = TO_DATE(tbv.DTHORAFECHAMENTO) AND dl.IDEMPRESA = tbv.IDEMPRESA AND dl.STCANCELADO = 'False' AND dl.STFECHADO = 'True') AS VRAJUSTEDINHEIRO, 
                    (SELECT IFNULL(SUM(CASE WHEN IFNULL(dl.VRAJUSTDINHEIRO, 0) <> 0 THEN dl.VRAJUSTDINHEIRO ELSE dl.VRRECDINHEIRO  END ), 0) FROM "${databaseSchema}".MOVIMENTOCAIXA dl WHERE TO_DATE(dl.DTABERTURA) = TO_DATE(tbv.DTHORAFECHAMENTO) AND dl.IDEMPRESA = tbv.IDEMPRESA AND dl.STCANCELADO = 'False' AND dl.STFECHADO = 'True') AS VRRECDINHEIRO,
                    0 AS VRTOTALRECEBIDO,
                    0 AS VRDISPONIVEL,
                    'Pendente de Envio' AS STATUSMALOTE,
                    '' AS OBSERVACAOADMINISTRATIVOMALOTE,
                    '' AS OBSERVACAOLOJAMALOTE,
                    '' AS STATIVOMALOTE,
                    '' AS DATAHORACRIACAOMALOTE
                FROM
                    "${databaseSchema}".VENDA TBV
                INNER JOIN "${databaseSchema}".EMPRESA TBE ON
                    TBE.IDEMPRESA = TBV.IDEMPRESA
                WHERE
                    TBV.STCANCELADO='False'
                    ${ dataPesquisaInicio ? ` AND (TO_DATE(TBV.DTHORAFECHAMENTO) BETWEEN '${dataPesquisaInicio}' AND '${dataPesquisaFim}' )` : ''}
                    ${ idEmpresa ? ' AND TBE.IDEMPRESA = ' + idEmpresa : ''}
                    AND NOT EXISTS (
                        SELECT 
                            1 
                        FROM 
                            "${databaseSchema}".MALOTECAIXALOJA TBM
                        WHERE 
                            TBM.IDEMPRESA = TBV.IDEMPRESA 
                            AND TBM.DATAMOVIMENTOCAIXA = TO_DATE(TBV.DTHORAFECHAMENTO)
                        )
                        AND 1 = ?
                GROUP BY 
                    TBE.IDEMPRESA,
                    TBV.IDEMPRESA,
                    TBE.NOFANTASIA,
                    TO_DATE(TBV.DTHORAFECHAMENTO)
                ORDER BY 
                    TO_DATE(TBV.DTHORAFECHAMENTO)
            `;
        }

        const params = [1];


        // if (dataPesquisaInicio && dataPesquisaFim) {
        //     query += 'AND TBV.DTHORAFECHAMENTO BETWEEN ? AND ?';
        //     params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        // }

        query += ` LIMIT ? OFFSET ?`;
        params.push(pageSize, (page - 1) * pageSize);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao executar a consulta Malotes por Loja', error);
        throw error;
    }
};


export const insertHistorico = async (IDMALOTE, IDUSERULTIMAALTERACAO, STATUSMALOTE) => {
    try {
        let queryInsertHistorico = `
            INSERT INTO
                "${databaseSchema}".HISTORICOMALOTECAIXALOJA 
            (
                IDMALOTE,
                IDEMPRESA,
                DATAMOVIMENTOCAIXA,
                VRDINHEIRO,
                VRCARTAO,
                VRPOS,
                VRPIX,
                VRCONVENIO,
                VRVOUCHER,
                VRFATURA,
                VRFATURAPIX,
                VRDESPESA,
                VRTOTALRECEBIDO,
                VRDISPONIVEL,
                STSTATUS,
                IDUSERCRIACAO,
                DATAHORACRIACAO,
                IDUSERENVIO,
                DATAHORAENVIO,
                IDUSERRECEPCAO,
                DATAHORARECEPCAO,
                IDUSERCONFERENCIA,
                DATAHORACONFERENCIA,
                IDUSERDEVOLUCAO,
                DATAHORADEVOLUCAO,
                IDUSERREENVIO,
                DATAHORAREENVIO,
                IDVINCULOPENDENCIA,
                OBSERVACAOLOJA,
                OBSERVACAOADMINISTRATIVO,
                STATIVO,
                IDUSERULTIMAALTERACAO,
                DATAHORAULTIMAALTERACAO
            ) 
            SELECT 
                TBM.IDMALOTE,
                TBM.IDEMPRESA,
                TBM.DATAMOVIMENTOCAIXA,
                TBM.VRDINHEIRO,
                TBM.VRCARTAO,
                TBM.VRPOS,
                TBM.VRPIX,
                TBM.VRCONVENIO,
                TBM.VRVOUCHER,
                TBM.VRFATURA,
                TBM.VRFATURAPIX,
                TBM.VRDESPESA,
                TBM.VRTOTALRECEBIDO,
                TBM.VRDISPONIVEL,
                ${!STATUSMALOTE ? 'TBM.STSTATUS' : `'${STATUSMALOTE}'`} AS STSTATUS,
                TBM.IDUSERCRIACAO,
                TBM.DATAHORACRIACAO, 
                TBM.IDUSERENVIO,
                TBM.DATAHORAENVIO,
                TBM.IDUSERRECEPCAO,
                TBM.DATAHORARECEPCAO,
                TBM.IDUSERCONFERENCIA,
                TBM.DATAHORACONFERENCIA,
                TBM.IDUSERDEVOLUCAO,
                TBM.DATAHORADEVOLUCAO,
                TBM.IDUSERREENVIO,
                TBM.DATAHORAREENVIO,
                TBM.IDVINCULOPENDENCIA,
                TBM.OBSERVACAOLOJA,
                TBM.OBSERVACAOADMINISTRATIVO,
                TBM.STATIVO,
                TBM.IDUSERULTIMAALTERACAO,
                TBM.DATAHORAULTIMAALTERACAO
            FROM 
                "${databaseSchema}".MALOTECAIXALOJA  TBM
            WHERE 
                TBM.IDMALOTE = ?
        `;

        const params = [IDMALOTE];
       
        const statement = await conn.prepare(queryInsertHistorico);
        const result = await statement.exec(params);

        return result;
    } catch (error) {
        console.error('Erro ao executar a inserção de histórico:', error);
        throw new Error(error.message);
    }
};


export const createMalote = async (dados) => {
    try {
        for(const item of dados) {
        
            const {
                IDEMPRESA,
                DATAMOVIMENTOCAIXA,
                VRDINHEIRO,
                VRCARTAO,
                VRPOS,
                VRPIX,
                VRCONVENIO,
                VRVOUCHER,
                VRFATURA,
                VRFATURAPIX,
                VRDESPESA,
                VRTOTALRECEBIDO,
                VRDISPONIVEL,
                IDUSERCRIACAO,
                IDUSERENVIO,
                OBSERVACAOLOJA,
                IDUSERULTIMAALTERACAO,
                DATAHORAENVIO = new Date().toISOString(),
                STSTATUS = 'Enviado',
            } = item;
    
            let queryInsert = `
                INSERT INTO "${databaseSchema}".MALOTECAIXALOJA
                (
            `;

            let queryValues = `VALUES(`;

            const params = [];

            if(IDEMPRESA) {
                queryInsert += `IDEMPRESA, `;
                queryValues += `?, `;
                console.log('IDEMPRESA', IDEMPRESA)
                params.push(IDEMPRESA);
            }

            if(DATAMOVIMENTOCAIXA) {
                queryInsert += `DATAMOVIMENTOCAIXA, `;
                queryValues += `TO_DATE(?, 'YYYY-MM-DD'), `;
                console.log('DATAMOVIMENTOCAIXA', DATAMOVIMENTOCAIXA)
                params.push(DATAMOVIMENTOCAIXA);
            }

            if(VRDINHEIRO) {
                queryInsert += `VRDINHEIRO, `;
                queryValues += `?,`;
                console.log('VRDINHEIRO', VRDINHEIRO)
                params.push(VRDINHEIRO);
            }

            if (VRCARTAO) {
                queryInsert += `VRCARTAO, `;
                queryValues += `?, `;
                console.log('VRCARTAO', VRCARTAO)
                params.push(VRCARTAO);
            }

            if (VRPOS !== null && VRPOS !== undefined) {
                queryInsert += `VRPOS, `;
                queryValues += `?, `;
                console.log('VRPOS', VRPOS);
                params.push(VRPOS);
            }

            if (VRPIX) {
                queryInsert += `VRPIX, `;
                queryValues += `?, `;
                console.log('VRPIX', VRPIX)
                params.push(VRPIX);
            }

            if (VRCONVENIO) {
                queryInsert += `VRCONVENIO, `;
                queryValues += `?, `;
                console.log('VRCONVENIO', VRCONVENIO)
                params.push(VRCONVENIO);
            }

            if (VRVOUCHER) {
                queryInsert += `VRVOUCHER, `;
                queryValues += `?, `;
                console.log('VRVOUCHER', VRVOUCHER)
                params.push(VRVOUCHER);
            }

            if (VRFATURA) {
                queryInsert += `VRFATURA, `;
                queryValues += `?, `;
                console.log('VRFATURA', VRFATURA)
                params.push(VRFATURA);
            }

            if (VRFATURAPIX) {
                queryInsert += `VRFATURAPIX, `;
                queryValues += `?, `;
                console.log('VRFATURAPIX', VRFATURAPIX)
                params.push(VRFATURAPIX);
            }

            if (VRDESPESA !== null && VRDESPESA !== undefined) {
                queryInsert += `VRDESPESA, `;
                queryValues += `?, `;
                console.log('VRDESPESA', VRDESPESA)
                params.push(VRDESPESA);
            }

            if (VRTOTALRECEBIDO) {
                queryInsert += `VRTOTALRECEBIDO, `;
                queryValues += `?, `;
                console.log('VRTOTALRECEBIDO', VRTOTALRECEBIDO)
                params.push(VRTOTALRECEBIDO);
            }

            if (VRDISPONIVEL) {
                queryInsert += `VRDISPONIVEL, `;
                queryValues += `?, `;
                console.log('VRDISPONIVEL', VRDISPONIVEL)
                params.push(VRDISPONIVEL);
            }

            if (IDUSERCRIACAO !== null && IDUSERCRIACAO !== undefined) {
                queryInsert += `IDUSERCRIACAO, `;
                queryValues += `?, `;
                console.log('IDUSERCRIACAO', IDUSERCRIACAO)
                params.push(IDUSERCRIACAO);
            }

            if (IDUSERENVIO) {
                queryInsert += `IDUSERENVIO, `;
                queryValues += `?, `;
                console.log('IDUSERENVIO', IDUSERENVIO)
                params.push(IDUSERENVIO);
            }

            if (OBSERVACAOLOJA) {
                queryInsert += `OBSERVACAOLOJA, `;
                queryValues += `?, `;
                console.log('OBSERVACAOLOJA', OBSERVACAOLOJA)
                params.push(OBSERVACAOLOJA);
            }

            if (IDUSERULTIMAALTERACAO !== null && IDUSERULTIMAALTERACAO !== undefined) {
                queryInsert += `IDUSERULTIMAALTERACAO, `;
                queryValues += `?, `;
                console.log('IDUSERULTIMAALTERACAO', IDUSERULTIMAALTERACAO)
                params.push(IDUSERULTIMAALTERACAO);
            }

            if(DATAHORAENVIO) {
                queryInsert += `DATAHORAENVIO, `;
                queryValues += `?, `;
                console.log('DATAHORAENVIO', DATAHORAENVIO)
                params.push(DATAHORAENVIO);
            }

            if(STSTATUS) {
                queryInsert += `STSTATUS `;
                queryValues += `? `;
                console.log('STSTATUS', STSTATUS)
                params.push(STSTATUS);
            }
            // queryInsert += `DATAHORAENVIO, STSTATUS) `;
            // queryValues += `CURRENT_TIMESTAMP, 'Enviado')`;

            queryInsert += `) `;
            queryValues += `)`;

            queryInsert += queryValues;
            console.log('queryInsert', queryInsert)
            console.log('params', params)
            const insertStatement = await conn.prepare(queryInsert);
            await insertStatement.exec(params);
            const queryRegistroExisteMalote = `
                SELECT 
                    IDMALOTE
                FROM 
                    "${databaseSchema}".MALOTECAIXALOJA
                WHERE  
                    IDEMPRESA = ?
                    AND DATAMOVIMENTOCAIXA = ?
                    AND 1 = ?
            `;

            const statementRegistroMalote = await conn.prepare(queryRegistroExisteMalote);
            const resultRegistroMalote = await statementRegistroMalote.exec([IDEMPRESA, DATAMOVIMENTOCAIXA, 1]);

            if(resultRegistroMalote.length > 0) {
                return {
                    status: false,
                    message: 'Malote Já Enviado, Recarregue a pagina e tente novamente!'
                }
            }

            const queryId = `
                ${databaseSchema}."SELECT "${databaseSchema}".SEQ_MALOTECAIXALOJA_ID".NEXTVAL FROM DUMMY WHERE 1 = ?
            `;
            const statementId = await conn.prepare(queryId);
            const resultId = await statementId.exec(paramsInsert);

            // const queryNextId = `SELECT "${databaseSchema}"."SEQ_MALOTECAIXALOJA_ID".NEXTVAL AS IDMALOTE FROM DUMMY`;
            // const statementNextId = await conn.prepare(queryNextId);
            // const resultNextId = await statementNextId.exec([]);

            const IDMALOTE = resultId[0].NEXTVAL;
            
            await insertStatement.exec(params);

            await insertHistorico(IDMALOTE, IDUSERCRIACAO, 'Criacao');
        }
        
      
        await conn.commit();
        
        return {
            status: true,
            message: 'Malote Criado com sucesso!',
        };
    } catch (error) {
        console.error('Erro ao executar a inserção de malote:', error);
        throw new Error(error.message);
    }
}

// export const updateMalote = async (dados) => {
//     try {
//         const queryUpdateMalote = `
//             UPDATE "${databaseSchema}"."MALOTECAIXALOJA"
//             SET IDEMPRESA = ?, DATAMOVIMENTOCAIXA = ?, VRDINHEIRO = ?, VRCARTAO = ?, VRPOS = ?,
//                 VRPIX = ?, VRCONVENIO = ?, VRVOUCHER = ?, VRFATURA = ?, VRFATURAPIX = ?,
//                 VRDESPESA = ?, VRTOTALRECEBIDO = ?, VRDISPONIVEL = ?, STSTATUS = ?, 
//                 DATAHORAENVIO = ?, IDUSERULTIMAALTERACAO = ?, DATAHORAULTIMAALTERACAO = CURRENT_TIMESTAMP
//             WHERE IDMALOTE = ?
//         `;

//         const updateStatement = await conn.prepare(queryUpdateMalote);

//         // Executa inserção do histórico antes de atualizar os registros
//         await Promise.all(dados.map(async (registro) => {
//             const historicoInserido = await insertHistorico(registro.IDMALOTE, registro.IDUSERULTIMAALTERACAO, registro.STATUS);
//             if (!historicoInserido) throw new Error(`Falha ao inserir histórico para IDMALOTE: ${registro.IDMALOTE}`);

//             return updateStatement.exec([
//                 registro.IDEMPRESA,
//                 registro.DATAMOVIMENTOCAIXA,
//                 registro.VRDINHEIRO,
//                 registro.VRCARTAO,
//                 registro.VRPOS,
//                 registro.VRPIX,
//                 registro.VRCONVENIO,
//                 registro.VRVOUCHER,
//                 registro.VRFATURA,
//                 registro.VRFATURAPIX,
//                 registro.VRDESPESA,
//                 registro.VRTOTALRECEBIDO,
//                 registro.VRDISPONIVEL,
//                 registro.STATUS,
//                 registro.DATAHORAENVIO,
//                 registro.IDUSERULTIMAALTERACAO,
//                 registro.IDMALOTE
//             ]);
//         }));

//         // Confirma a transação
//         await conn.commit();

//         return { status: 'success', message: 'Malote atualizado com sucesso!' };
//     } catch (error) {
//         console.error('Erro ao atualizar malote:', error);
//         throw new Error('Erro ao atualizar os dados do malote.');
//     }
// };



export const updateMalote = async (dados) => {
    try {

            
    // let queryUpdateMalote = `
    //     UPDATE 
    //         "${databaseSchema}"."MALOTECAIXALOJA" 
    //     SET
    //         IDEMPRESA = ?,
    //         DATAMOVIMENTOCAIXA = ?,
    //         VRDINHEIRO = ?,
    //         VRCARTAO = ?,
    //         VRPOS = ?,
    //         VRPIX = ?,
    //         VRCONVENIO = ?,
    //         VRVOUCHER = ?,
    //         VRFATURA = ?,
    //         VRFATURAPIX = ?,
    //         VRDESPESA = ?,
    //         VRTOTALRECEBIDO = ?,
    //         VRDISPONIVEL = ?,
    //         STSTATUS = ?,
    //         DATAHORAENVIO = ?,
    //         IDUSERULTIMAALTERACAO = ?,
    //         DATAHORAULTIMAALTERACAO = CURRENT_TIMESTAMP
    //     WHERE 
    //         "IDMALOTE" =  ?
    // `;
                
        

        // const updateStatement = await conn.prepare(queryUpdateMalote);

        // if (!historicoInserido) throw new Error(`Falha ao inserir histórico para IDMALOTE: ${registro.IDMALOTE}`);
        
        for(const registro of dados) {

            const {
               IDMALOTE,
               IDEMPRESA,
               DATAMOVIMENTOCAIXA,
               VRDINHEIRO,
               VRCARTAO,
               VRPOS,
               VRPIX,
               VRCONVENIO,
               VRVOUCHER,
               VRFATURA,
               VRFATURAPIX,
               VRDESPESA,
               VRTOTALRECEBIDO,
               VRDISPONIVEL,
               STATUS,
               DATAHORAENVIO,
               IDUSERULTIMAALTERACAO
            } = registro;

            let queryUpdateMalote = `
                UPDATE "${databaseSchema}"."MALOTECAIXALOJA"
                SET
            `;
        const params = [];

        if (IDEMPRESA) {
            queryUpdateMalote += ` IDEMPRESA = ?,`;
            params.push(IDEMPRESA);
        }
        if (DATAMOVIMENTOCAIXA) {
            queryUpdateMalote += ` DATAMOVIMENTOCAIXA = ?,`;
            params.push(DATAMOVIMENTOCAIXA);
        }
        if (VRDINHEIRO) {
            queryUpdateMalote += ` VRDINHEIRO = ?,`;
            params.push(VRDINHEIRO);
        }
        if (VRCARTAO) {
            queryUpdateMalote += ` VRCARTAO = ?,`;
            params.push(VRCARTAO);
        }
        if (VRPOS) {
            queryUpdateMalote += ` VRPOS = ?,`;
            params.push(VRPOS);
        }
        if (VRPIX) {
            queryUpdateMalote += ` VRPIX = ?,`;
            params.push(VRPIX);
        }
        if (VRCONVENIO) {
            queryUpdateMalote += ` VRCONVENIO = ?,`;
            params.push(VRCONVENIO);
        }
        if (VRVOUCHER) {
            queryUpdateMalote += ` VRVOUCHER = ?,`;
            params.push(VRVOUCHER);
        }
        if (VRFATURA) {
            queryUpdateMalote += ` VRFATURA = ?,`;
            params.push(VRFATURA);
        }
        if (VRFATURAPIX) {
            queryUpdateMalote += ` VRFATURAPIX = ?,`;
            params.push(VRFATURAPIX);
        }
        if (VRDESPESA) {
            queryUpdateMalote += ` VRDESPESA = ?,`;
            params.push(VRDESPESA);
        }
        if (VRTOTALRECEBIDO) {
            queryUpdateMalote += ` VRTOTALRECEBIDO = ?,`;
            params.push(VRTOTALRECEBIDO);
        }
        if (VRDISPONIVEL) {
            queryUpdateMalote += ` VRDISPONIVEL = ?,`;
            params.push(VRDISPONIVEL);
        }
        if (STATUS) {
            queryUpdateMalote += ` STSTATUS = ?,`;
            params.push(STATUS);
        }
        if (DATAHORAENVIO) {
            queryUpdateMalote += ` DATAHORAENVIO = ?,`;
            params.push(DATAHORAENVIO);
        }

        // Campos obrigatórios
        queryUpdateMalote += `
            IDUSERULTIMAALTERACAO = ?,
            DATAHORAULTIMAALTERACAO = CURRENT_TIMESTAMP
            WHERE IDMALOTE = ?
        `;
        params.push(IDUSERULTIMAALTERACAO, IDMALOTE);

        // Insere o histórico antes de atualizar
        const historicoInserido = await insertHistorico(IDMALOTE, IDUSERULTIMAALTERACAO, STATUS);

        if (!historicoInserido) {
            throw new Error(`Erro ao inserir histórico para o malote ${IDMALOTE}`);
        }

        // Executa a query de atualização
        const statement = await conn.prepare(queryUpdateMalote);
        await statement.exec(params);
        }

        // Confirma a transação
        conn.commit();

       
        return {
            status: 'success',
            message: 'malote atualizada com sucesso!',
        }
    } catch (error) {
        console.error('Erro ao executar a atualização do malote:', error);
        throw new Error(error.message);
    }
};

