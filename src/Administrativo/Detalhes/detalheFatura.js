import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalheFatura = async (idDetalheFatura, idEmpresa, dataPesquisaInicio, dataPesquisaFim, nuCodigoAutorizacao, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = ` 
            SELECT 
                tbdf.IDDETALHEFATURA,
                tbdf.IDEMPRESA,
                tbdf.IDFUNCIONARIO,
                tbdf.IDDETALHEFATURALOCAL,
                tbdf.IDCAIXAWEB,
                tbdf.IDCAIXALOCAL,
                tbdf.NUESTABELECIMENTO,
                tbdf.NUCARTAO,
                TO_VARCHAR(tbdf.DTPROCESSAMENTO, 'DD-MM-YYYY') AS DTPROCESSAMENTO,
                TO_VARCHAR(tbdf.HRPROCESSAMENTO, 'HH24:MI:SS') AS HRPROCESSAMENTO,
                tbdf.NUNSU,
                tbdf.NUNSUHOST,
                tbdf.NUCODAUTORIZACAO,
                tbdf.VRRECEBIDO,
                TO_VARCHAR(tbdf.DTHRMIGRACAO, 'YYYY-MM-DD HH24:MI:SS') AS DTHRMIGRACAO,
                tbdf.STCANCELADO,
                tbdf.IDUSRCACELAMENTO,
                tbf.NOFUNCIONARIO,
                tbc.DSCAIXA,
                tbdf.IDMOVIMENTOCAIXAWEB,
                tbdf.TXTMOTIVOCANCELAMENTO,
                tbmc.STCONFERIDO
            FROM 
                "${databaseSchema}".DETALHEFATURA tbdf
                INNER JOIN "${databaseSchema}".CAIXA tbc ON tbc.IDCAIXAWEB = tbdf.IDCAIXAWEB
                LEFT JOIN "${databaseSchema}".FUNCIONARIO tbf ON tbdf.IDFuncionario = tbf.IDFuncionario
                LEFT JOIN "${databaseSchema}".MOVIMENTOCAIXA tbmc ON tbdf.IDMOVIMENTOCAIXAWEB = tbmc.ID
            WHERE 
                1 = ?
        `;

        const params = [1];    
        
        if (idDetalheFatura) {
            query += ' AND tbdf.IDDETALHEFATURA = ?';
            params.push(idDetalheFatura);
        }

        if (idEmpresa) {
            query += ' AND tbdf.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if (nuCodigoAutorizacao) {
            query += ' AND tbdf.NUCODAUTORIZACAO = ?';
            params.push(nuCodigoAutorizacao);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (tbdf.DTPROCESSAMENTO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

     

        query += ' ORDER BY tbdf.DTPROCESSAMENTO DESC, tbdf.IDDETALHEFATURA DESC';
        
        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page, 
            pageSize,
            rows: result.length, 
            data: result, 
        };
    } catch (error) {
        console.error('Erro ao executar a consulta Detalhe Fatura', error);
        throw error;
    }
};