import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getMalortesPorLoja = async (
    idEmpresa,
    idGrupoEmpresarial,
    idMalote,
    statusMalote,
    pendenciaMalote,
    dataPesquisaInicio,
    dataPesquisaFim,
    dataConferenciaInicio,
    dataConferenciaFim,
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
                    ${ idGrupoEmpresarial ? ' AND TBE.IDGRUPOEMPRESARIAL = ' + idGrupoEmpresarial : ''}
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
                    ${ idGrupoEmpresarial ? ' AND TBE.IDGRUPOEMPRESARIAL = ' + idGrupoEmpresarial : ''}
                    ${ idEmpresa ? ' AND TBE.IDEMPRESA = ' + idEmpresa : ''}
                    ${ statusMalote ? ` AND CONTAINS(TBM.STSTATUS, '%${statusMalote}%')` : ''}
                    ${ !dataConferenciaInicio && dataPesquisaInicio ? ` AND (TO_DATE(TBM.DATAMOVIMENTOCAIXA) BETWEEN '${dataPesquisaInicio}' AND '${dataPesquisaFim}')` : ''}
                    ${ dataConferenciaInicio ? ` AND (TO_DATE(TBM.DATAHORACONFERENCIA ) BETWEEN '${dataConferenciaInicio}' AND '${dataConferenciaFim}')` : ''}
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

        if(idMalote || pendenciaMalote || (statusMalote && statusMalote !== 'Pendente de Envio') || dataConferenciaInicio){
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
                    IFNULL(TO_VARCHAR(TO_DATE(TBM.DATAHORACRIACAO), 'DD/mm/YYYY'), '') AS DATAHORACRIACAOMALOTE,
                    TBF_CONF.NOFUNCIONARIO AS NOFUNCIONARIOCONFERENCIA
                FROM 
                    "${databaseSchema}".MALOTECAIXALOJA TBM
                INNER JOIN "${databaseSchema}".EMPRESA TBE ON 
                    TBM.IDEMPRESA = TBE.IDEMPRESA
                LEFT JOIN "${databaseSchema}".FUNCIONARIO TBF_CONF ON 
                    TBM.IDUSERCONFERENCIA = TBF_CONF.IDFUNCIONARIO
                WHERE
                    TBM.STATIVO ='True'
                    ${ idMalote ? ' AND TBM.IDMALOTE = ' + idMalote : ''}
                    ${ idGrupoEmpresarial ? ' AND TBE.IDGRUPOEMPRESARIAL = ' + idGrupoEmpresarial : ''}
                    ${ idEmpresa ? ' AND TBE.IDEMPRESA = ' + idEmpresa : ''}
                    ${ statusMalote ? ` AND CONTAINS(TBM.STSTATUS, '${statusMalote}')` : ''}
                    ${ !dataConferenciaInicio && dataPesquisaInicio ? ` AND (TO_DATE(TBM.DATAMOVIMENTOCAIXA) BETWEEN '${dataPesquisaInicio}' AND '${dataPesquisaFim}')` : ''}
                    ${ dataConferenciaInicio ? ` AND (TO_DATE(TBM.DATAHORACONFERENCIA ) BETWEEN '${dataConferenciaInicio}' AND '${dataConferenciaFim}')` : ''}
                    ${ pendenciaMalote ? ` 
                        AND TBM.IDMALOTE IN(
                            SELECT 
                                IDMALOTE
                            FROM 
                                "${databaseSchema}".VINCULOPENDENCIAMALOTECAIXALOJA 
                            WHERE 
                                IDPENDENCIA = ${pendenciaMalote}
                        )` : ''}
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
                    ${ idGrupoEmpresarial ? ' AND TBE.IDGRUPOEMPRESARIAL = ' + idGrupoEmpresarial : ''}
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
        console.error('Erro ao executar a consulta de Malotes por Loja:', error);
        throw error;
    }
};

export const insertHistorico = async (IDMALOTE, IDUSERULTIMAALTERACAO) => {
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
                TBM.STSTATUS,
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

export const updatePendenciasMalote = async (IDMALOTE, IDUSER, PENDENCIAS,) => {
    try {
            const queryIdHistoricoMalote = `
                SELECT MAX(IDHISTORICO) AS IDHISTORICOMALOTE  
                FROM "${databaseSchema}".HISTORICOMALOTECAIXALOJA 
                WHERE IDMALOTE = ? 
            `;
            
            const statementIdHistorico = await conn.prepare(queryIdHistoricoMalote);
            const resultIdHistorico = await statementIdHistorico.exec([IDMALOTE]);
            const idHistoricoMalote = resultIdHistorico[0]?.IDHISTORICOMALOTE;

            if (!idHistoricoMalote) {
                throw new Error('ID do histórico do malote não encontrado.');
            }

            const queryInsertHistPendencias = `
                INSERT INTO
                    "${databaseSchema}".HISTORICOVINCULOPENDENCIAMALOTECAIXALOJA
                (
                    IDHISTORICOMALOTE,
                    IDMALOTE,
                    IDPENDENCIA,
                    OBSERVACAO,
                    STRESOLVIDO,
                    STATIVO,
                    DATAHORACRIACAO 
                )
                SELECT
                    ${idHistoricoMalote} AS IDHISTORICOMALOTE,
                    ${IDMALOTE} AS IDMALOTE,
                    IDPENDENCIA,
                    OBSERVACAO,
                    STRESOLVIDO,
                    STATIVO,
                    DATAHORACRIACAO
                FROM
                    "${databaseSchema}".VINCULOPENDENCIAMALOTECAIXALOJA TBV
                WHERE 
                    TBV.IDMALOTE = ?
            `;
    
            const statementInsertHistPendencias = await conn.prepare(queryInsertHistPendencias);
            await statementInsertHistPendencias.exec([idHistoricoMalote, IDMALOTE, IDMALOTE]);

            if(PENDENCIAS.length > 0) {
                const queryDeletePendencias = `
                DELETE FROM
                    "${databaseSchema}".VINCULOPENDENCIAMALOTECAIXALOJA
                WHERE
                    IDMALOTE = ?
            `;
            const statementDeletePendencias = await conn.prepare(queryDeletePendencias);
            await statementDeletePendencias.exec([IDMALOTE]);
        }

        // Insere novas pendências
        for (let { IDPENDENCIA } of PENDENCIAS) {
            const queryInsertVincPendencia = `
                INSERT INTO 
                    "${databaseSchema}".VINCULOPENDENCIAMALOTECAIXALOJA
                (
                    IDPENDENCIA,
                    IDMALOTE
                )
                VALUES(?, ?)
            `;
            const statementInsertVincPendencia = await conn.prepare(queryInsertVincPendencia);
            await statementInsertVincPendencia.exec([IDPENDENCIA, IDMALOTE]);
        }

        // Confirma a transação
        await conn.commit();

        console.log('Pendências do malote atualizadas com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao executar a atualização de pendências do malote:', error);
        throw new Error(error.message);
    }
};

export const updateMalote = async (bodyJson) => {
    try {

        for(let i = 0; i < bodyJson.length; i++) {
            let {
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
                DATAHORAENVIADO,
                DATAHORARECEBIDO,
                DATAHORADEVOLVIDO,
                DATAHORACONFERIDO,
                OBSERVACAOLOJA,
                OBSERVACAOADMINISTRATIVO,
                PENDENCIAS,
                IDUSERULTIMAALTERACAO,
            } = bodyJson[i];
    
            if(!IDMALOTE || !IDUSERULTIMAALTERACAO){
                throw 'Os parametros de IDMALOTE e IDUSERULTIMAALTERACAO são obrigatorios!';
            }
    
            let queryUpdateMalote = `
                UPDATE 
                    "${databaseSchema}"."MALOTECAIXALOJA" 
                SET
                    ${ IDEMPRESA ? 'IDEMPRESA = ' + IDEMPRESA + ',' : ''}
                    ${ DATAMOVIMENTOCAIXA ? ` DATAMOVIMENTOCAIXA = '${DATAMOVIMENTOCAIXA}', `: ''}
                    ${ VRDINHEIRO ? 'VRDINHEIRO =' + VRDINHEIRO + ',' : ''}
                    ${ VRCARTAO ? 'VRCARTAO =' + VRCARTAO + ',' : ''}
                    ${ VRPOS ? 'VRPOS =' + VRPOS + ',' : ''}
                    ${ VRPIX ? 'VRPIX =' + VRPIX + ',' : ''}
                    ${ VRCONVENIO ? 'VRCONVENIO ='+ VRCONVENIO + ',' : ''}
                    ${ VRVOUCHER ? 'VRVOUCHER =' + VRVOUCHER + ',' : ''}
                    ${ VRFATURA ? 'VRFATURA =' + VRFATURA + ',' : ''}
                    ${ VRFATURAPIX ? 'VRFATURAPIX =' + VRFATURAPIX + ',' : ''}
                    ${ VRDESPESA ? 'VRDESPESA =' + VRDESPESA + ',' : ''}
                    ${ VRTOTALRECEBIDO ? 'VRTOTALRECEBIDO =' + VRTOTALRECEBIDO + ',' : ''}
                    ${ VRDISPONIVEL ? 'VRDISPONIVEL =' + VRDISPONIVEL + ',' : ''}
                    ${ STATUS ? `STSTATUS = '${STATUS}', ` : ''}
                    ${ DATAHORAENVIADO ? ` DATAHORAENVIO = '${DATAHORAENVIADO}', `: ''}
                    ${ (STATUS == 'Devolvido' && IDUSERULTIMAALTERACAO) ? ` IDUSERDEVOLUCAO = ${IDUSERULTIMAALTERACAO}, `: ''}
                    ${ (STATUS == 'Devolvido' || DATAHORADEVOLVIDO) ? ` DATAHORADEVOLUCAO = ${STATUS == 'Devolvido' ? 'CURRENT_TIMESTAMP' : '${DATAHORADEVOLVIDO}'}, `: ''}
                    ${ (STATUS == 'Devolvido' || STATUS == 'Conferido' && IDUSERULTIMAALTERACAO) ? ` IDUSERCONFERENCIA = ${IDUSERULTIMAALTERACAO}, `: ''}
                    ${ (STATUS == 'Conferido' || STATUS == 'Devolvido' || DATAHORACONFERIDO) ? ` DATAHORACONFERENCIA = ${(STATUS == 'Conferido' || STATUS == 'Devolvido') ? 'CURRENT_TIMESTAMP' : '${DATAHORACONFERIDO}'}, `: ''}
                    ${ OBSERVACAOLOJA ? ` OBSERVACAOLOJA = '${OBSERVACAOLOJA}', `: ''}
                    ${ OBSERVACAOADMINISTRATIVO ? ` OBSERVACAOADMINISTRATIVO = '${OBSERVACAOADMINISTRATIVO}', `: ''}
                    IDUSERULTIMAALTERACAO = ?,
                    DATAHORAULTIMAALTERACAO = CURRENT_TIMESTAMP
                WHERE 
                    "IDMALOTE" =  ?
            `;
    
            const historicoInserido = await insertHistorico(IDMALOTE, IDUSERULTIMAALTERACAO);
            if (!historicoInserido) {
                throw new Error('Erro ao tentar inserir o histórico do malote!');
            }
    
    
            await updatePendenciasMalote(IDMALOTE, IDUSERULTIMAALTERACAO, PENDENCIAS);
    
            // Prepara e executa a query de atualização do malote
            const statementUpdate = await connection.prepare(queryUpdateMalote);
            await statementUpdate.exec([IDUSERULTIMAALTERACAO, IDMALOTE]);
    
        }
    
        await conn.commit();
    
        return {
            status: true,
            message: 'Malote atualizado com sucesso!',
        };
    } catch (error) {
            console.error('Erro ao executar a atualização do malote:', error);
            throw new Error(error.message);
    }
}
