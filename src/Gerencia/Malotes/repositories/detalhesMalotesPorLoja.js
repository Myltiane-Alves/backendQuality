import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalhesMalortesPorLoja = async (
    idEmpresa,
    idMalote,
    statusMalote,
    dataPesquisaInicio,
    dataPesquisaFim,
    page,
    pageSize
) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                TBM.IDMALOTE,
                TBE.IDEMPRESA,
                TBE.NOFANTASIA,
                TBM.DATAMOVIMENTOCAIXA AS DTHORAFECHAMENTO,
                TO_VARCHAR(TO_DATE(TBM.DATAMOVIMENTOCAIXA), 'DD/MM/YYYY') AS DATAMOVIMENTOCAIXA,
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
                TBFCRIACAO.NOFUNCIONARIO AS NOFUNCIONARIOCRIACAO,
                TO_VARCHAR(TBM.DATAHORACRIACAO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORACRIACAO,
                TBFENVIO.NOFUNCIONARIO AS NOFUNCIONARIOENVIO,
                TO_VARCHAR(TBM.DATAHORAENVIO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORAENVIADO,
                TBFRECEPCAO.NOFUNCIONARIO AS NOFUNCIONARIORECEPCAO,
                TO_VARCHAR(TBM.DATAHORARECEPCAO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORARECEBIDO,
                TBFCONFERENCIA.NOFUNCIONARIO AS NOFUNCIONARIOCONFERENCIA,
                TO_VARCHAR(TBM.DATAHORACONFERENCIA, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORACONFERIDO,
                TBFDEVOLUCAO.NOFUNCIONARIO AS NOFUNCIONARIODEVOLUCAO,
                TO_VARCHAR(TBM.DATAHORADEVOLUCAO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORADEVOLVIDO,
                TBFREENVIO.NOFUNCIONARIO AS NOFUNCIONARIOREENVIO,
                TO_VARCHAR(TBM.DATAHORAREENVIO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORAREENVIADO
            FROM 
                "${databaseSchema}".MALOTECAIXALOJA TBM
            INNER JOIN "${databaseSchema}".EMPRESA TBE ON 
                TBM.IDEMPRESA = TBE.IDEMPRESA
            INNER JOIN "${databaseSchema}".FUNCIONARIO TBFCRIACAO ON
                TBM.IDUSERCRIACAO = TBFCRIACAO.IDFUNCIONARIO
            INNER JOIN "${databaseSchema}".FUNCIONARIO TBFENVIO ON
                TBM.IDUSERENVIO = TBFENVIO.IDFUNCIONARIO
            LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFRECEPCAO ON
                TBM.IDUSERRECEPCAO = TBFRECEPCAO.IDFUNCIONARIO
            LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFCONFERENCIA ON
                TBM.IDUSERCONFERENCIA = TBFCONFERENCIA.IDFUNCIONARIO
            LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFDEVOLUCAO ON
                TBM.IDUSERDEVOLUCAO = TBFDEVOLUCAO.IDFUNCIONARIO
            LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFREENVIO ON
                TBM.IDUSERREENVIO = TBFREENVIO.IDFUNCIONARIO
            WHERE
                TBM.STATIVO ='True'
                ${ idMalote ? ' AND TBM.IDMALOTE = ' + idMalote : ''}
                ${ idEmpresa ? ' AND TBE.IDEMPRESA = ' + idEmpresa : ''}
                ${ statusMalote ? ' AND TBM.STATUS = ' + statusMalote : ''}
                ${ dataPesquisaInicio ? ` AND (TO_DATE(TBM.DATAMOVIMENTOCAIXA) BETWEEN '${dataPesquisaInicio}' AND '${dataPesquisaFim}')` : ''}
                AND 1 = ?
        `;
        

        const params = [1];


        // if (dataPesquisaInicio && dataPesquisaFim) {
        //     query += 'AND TBV.DTHORAFECHAMENTO BETWEEN ? AND ?';
        //     params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        // }

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao executar a consulta DetalhesMalortesPorLoja:', error);
        throw error;
    }
};