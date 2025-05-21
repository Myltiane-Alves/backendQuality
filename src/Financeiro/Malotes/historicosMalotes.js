import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getObterPendencias = async (idHistoricoMalote) => {
    try {

        let query = `
            SELECT 
                *
            FROM 
                "${databaseSchema}".HISTORICOVINCULOPENDENCIAMALOTECAIXALOJA 
            WHERE
                STATIVO = 'True'
                AND STRESOLVIDO = 'False'
                AND IDHISTORICOMALOTE = ?
        `;
    
        const params = [idHistoricoMalote];
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);
        return result;
    } catch (error) {
        console.error('Erro ao executar a consulta de histórico vínculo pendências:', error);
        throw error;
    }
}

export const getHistoricosMalotes = async (
    idHistoricoMalote,
    idMalote,
    idEmpresa,
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
            TBH.IDHISTORICO AS IDHISTORICOMALOTE,
            TBH.IDMALOTE,
            TBH.IDEMPRESA,
            TBE.NOFANTASIA,
            TO_VARCHAR(TBH.DATAMOVIMENTOCAIXA, 'DD/MM/YYYY' ) AS DATAMOVIMENTOCAIXA,
            TBH.VRDINHEIRO,
            TBH.VRCARTAO,
            TBH.VRPOS,
            TBH.VRPIX,
            TBH.VRCONVENIO,
            TBH.VRVOUCHER,
            TBH.VRFATURA,
            TBH.VRFATURAPIX,
            TBH.VRDESPESA,
            TBH.VRTOTALRECEBIDO,
            TBH.VRDISPONIVEL,
            TBH.STSTATUS AS STATUSMALOTE,
            TBH.OBSERVACAOADMINISTRATIVO AS OBSERVACAOADMINISTRATIVOMALOTE,
            TBH.OBSERVACAOLOJA AS OBSERVACAOLOJAMALOTE,
            TBFCRIACAO.NOFUNCIONARIO AS NOFUNCIONARIOCRIACAO,
            TO_VARCHAR(TBH.DATAHORACRIACAO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORACRIACAO,
            TBFENVIO.NOFUNCIONARIO AS NOFUNCIONARIOENVIO,
            TO_VARCHAR(TBH.DATAHORAENVIO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORAENVIADO,
            TBFRECEPCAO.NOFUNCIONARIO AS NOFUNCIONARIORECEPCAO,
            TO_VARCHAR(TBH.DATAHORARECEPCAO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORARECEBIDO,
            TBFCONFERENCIA.NOFUNCIONARIO AS NOFUNCIONARIOCONFERENCIA,
            TO_VARCHAR(TBH.DATAHORACONFERENCIA, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORACONFERIDO,
            TBFDEVOLUCAO.NOFUNCIONARIO AS NOFUNCIONARIODEVOLUCAO,
            TO_VARCHAR(TBH.DATAHORADEVOLUCAO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORADEVOLVIDO,
            TBFREENVIO.NOFUNCIONARIO AS NOFUNCIONARIOREENVIO,
            TO_VARCHAR(TBH.DATAHORAREENVIO, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORAREENVIADO,
            TBH.IDVINCULOPENDENCIA,
            TBH.STATIVO,
            TBH.IDUSERULTIMAALTERACAO,
            TO_VARCHAR(TBH.DATAHORAULTIMAALTERACAO, 'DD/MM/YYYY HH24:MI:SS' ) AS DATAHOTAALTERACAO
        FROM
            "${databaseSchema}".HISTORICOMALOTECAIXALOJA TBH
        INNER JOIN "${databaseSchema}".EMPRESA TBE ON 
            TBH.IDEMPRESA = TBE.IDEMPRESA 
        INNER JOIN "${databaseSchema}".FUNCIONARIO TBFCRIACAO ON
            TBH.IDUSERCRIACAO = TBFCRIACAO.IDFUNCIONARIO
        INNER JOIN "${databaseSchema}".FUNCIONARIO TBFENVIO ON
            TBH.IDUSERENVIO = TBFENVIO.IDFUNCIONARIO
        LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFRECEPCAO ON
            TBH.IDUSERRECEPCAO = TBFRECEPCAO.IDFUNCIONARIO
        LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFCONFERENCIA ON
            TBH.IDUSERCONFERENCIA = TBFCONFERENCIA.IDFUNCIONARIO
        LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFDEVOLUCAO ON
            TBH.IDUSERDEVOLUCAO = TBFDEVOLUCAO.IDFUNCIONARIO
        LEFT JOIN "${databaseSchema}".FUNCIONARIO TBFREENVIO ON
            TBH.IDUSERREENVIO = TBFREENVIO.IDFUNCIONARIO
        WHERE 
            1 = ?
    `;

    const params = [1];

        if (idHistoricoMalote) {
            query += 'AND TBH.IDHISTORICO = ?';
            params.push(idHistoricoMalote);
        }
        
        if (idMalote) {
            query += 'AND TBH.IDMALOTE = ?';
            params.push(idMalote);
        }

        if (idEmpresa) {
            query += 'AND TBH.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += 'AND TO_DATE(TBH.DATAHOTAALTERACAO) BETWEEN ? AND ?';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }


        query += 'ORDER BY TBH.IDMALOTE, TBH.IDHISTORICO LIMIT ? OFFSET ?';
        params.push(pageSize, (page - 1) * pageSize);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);
        const rows = Array.isArray(result) ? result : [];

        const data = await Promise.all(rows.map(async (registro) => {
            const pendencias = await getObterPendencias(registro.IDHISTORICOMALOTE);
            return {
                "IDHISTORICOMALOTE": registro.IDHISTORICOMALOTE,
                "IDMALOTE": registro.IDMALOTE,
                "IDEMPRESA": registro.IDEMPRESA,
                "NOFANTASIA": registro.NOFANTASIA,
                "DTHORAFECHAMENTO": registro.DTHORAFECHAMENTO,
                "DATAMOVIMENTOCAIXA": registro.DATAMOVIMENTOCAIXA,
                "VALORTOTALDINHEIRO": registro.VALORTOTALDINHEIRO,
                "VALORTOTALCARTAO": registro.VALORTOTALCARTAO,
                "VALORTOTALCONVENIO": registro.VALORTOTALCONVENIO,
                "VALORTOTALPOS": registro.VALORTOTALPOS,
                "VALORTOTALPIX": registro.VALORTOTALPIX,
                "VALORTOTALMOOVPAY": registro.VALORTOTALMOOVPAY,
                "VALORTOTALVOUCHER": registro.VALORTOTALVOUCHER,
                "VALORTOTALFATURA": registro.VALORTOTALFATURA,
                "VALORTOTALFATURAPIX": registro.VALORTOTALFATURAPIX,
                "VALORTOTALDESPESA": registro.VALORTOTALDESPESA,
                "VALORTOTALADIANTAMENTOSALARIAL": registro.VALORTOTALADIANTAMENTOSALARIAL,
                "VRFISICODINHEIRO": registro.VRFISICODINHEIRO,
                "VRAJUSTEDINHEIRO": registro.VRAJUSTEDINHEIRO,
                "VRRECDINHEIRO": registro.VRRECDINHEIRO,
                "VRTOTALRECEBIDO": registro.VRTOTALRECEBIDO,
                "VRDISPONIVEL": registro.VRDISPONIVEL,
                "STATUSMALOTE": registro.STATUSMALOTE,
                "OBSERVACAOADMINISTRATIVO": registro.OBSERVACAOADMINISTRATIVOMALOTE,
                "OBSERVACAOLOJA": registro.OBSERVACAOLOJAMALOTE,
                "STATIVOMAOTE": registro.STATIVOMAOTE,
                "NOFUNCIONARIOCRIACAO": registro.NOFUNCIONARIOCRIACAO,
                "DATAHORACRIACAO": registro.DATAHORACRIACAO,
                "NOFUNCIONARIOENVIO": registro.NOFUNCIONARIOENVIO,
                "DATAHORAENVIADO": registro.DATAHORAENVIADO,
                "NOFUNCIONARIORECEPCAO": registro.NOFUNCIONARIORECEPCAO,
                "DATAHORARECEBIDO": registro.DATAHORARECEBIDO,
                "NOFUNCIONARIOCONFERENCIA": registro.NOFUNCIONARIOCONFERENCIA,
                "DATAHORACONFERIDO": registro.DATAHORACONFERIDO,
                "NOFUNCIONARIODEVOLUCAO": registro.NOFUNCIONARIODEVOLUCAO,
                "DATAHORADEVOLVIDO": registro.DATAHORADEVOLVIDO,
                "NOFUNCIONARIOREENVIO": registro.NOFUNCIONARIOREENVIO,
                "DATAHORAREENVIADO": registro.DATAHORAREENVIADO,
                "IDVINCULOMOTIVODEVOLUCAO": registro.IDVINCULOMOTIVODEVOLUCAO,
                "STATIVO": registro.STATIVO,
                "DATAHOTAALTERACAO": registro.DATAHOTAALTERACAO,
                "IDUSERULTIMAALTERACAO": registro.IDUSERULTIMAALTERACAO,
                "PENDENCIAS": getObterPendencias(registro.IDHISTORICOMALOTE),
            }
        }));
        return {
            page,
            pageSize,
            rows: data.length,
            data: data,
        };
    } catch (error) {
        console.error('Erro ao executar a consulta de Historicos de malotes:', error);
        throw error;
    }
}