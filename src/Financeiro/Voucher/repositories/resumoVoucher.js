import conn from "../../../config/dbConnection.js";
import 'dotenv/config';

const databaseSchema = process.env.HANA_DATABASE;

export const getResumoVoucher = async (idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page) => {

    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
        SELECT 
            tbrv.IDVOUCHER,
            tbrv.NUVOUCHER,
            tbrv.VRVOUCHER,
            TO_VARCHAR(tbrv.DTINVOUCHER,'DD/mm/YYYY') AS DTINVOUCHER,
            tbc.DSCAIXA,
            tbf.NOFUNCIONARIO,
            tbf.NOLOGIN
        FROM 
            "${databaseSchema}".RESUMOVOUCHER tbrv
            INNER JOIN "${databaseSchema}".CAIXA tbc ON tbc.IDCAIXAWEB = tbrv.IDCAIXADESTINO
            LEFT JOIN "${databaseSchema}".FUNCIONARIO tbf ON tbf.IDFUNCIONARIO = tbrv.IDUSRINVOUCHER
        WHERE 
            1 = 1
        AND tbrv.STCANCELADO = 'False'
    `;

        const params = [];

        if (idEmpresa > 0) {
            query += ' AND tbrv.IDEMPRESADESTINO = ?';
            params.push(idEmpresa);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (tbrv.DTINVOUCHER BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        const statement = conn.prepare(query);
        const result = statement.exec(params);

        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
}