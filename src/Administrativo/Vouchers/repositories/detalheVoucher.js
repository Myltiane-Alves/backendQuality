import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalheVoucher = async (idEmpresa, dataPesquisa, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(page) : 1000;

        let query = `
            SELECT 
                tbrv.IDVOUCHER,  
                TO_VARCHAR(tbrv.DTINVOUCHER,'DD-MM-YYYY') AS DTINVOUCHER,  
                TO_VARCHAR(tbrv.DTOUTVOUCHER,'DD-MM-YYYY') AS DTOUTVOUCHER,  
                tbcorigem.DSCAIXA AS DSCAIXAORIGEM,  
                tbcdestino.DSCAIXA AS DSCAIXADESTINO,  
                tbrv.NUVOUCHER,  
                tbrv.VRVOUCHER,  
                tbrv.STATIVO,  
                tbrv.STCANCELADO,  
                tbemp.NOFANTASIA  
            FROM 
                "${databaseSchema}".RESUMOVOUCHER tbrv 
                LEFT JOIN "${databaseSchema}".CAIXA tbcorigem ON tbrv.IDCAIXAORIGEM = tbcorigem.IDCAIXAWEB 
                LEFT JOIN "${databaseSchema}".CAIXA tbcdestino ON tbrv.IDCAIXAORIGEM = tbcdestino.IDCAIXAWEB 
                LEFT JOIN "${databaseSchema}".EMPRESA tbemp ON tbrv.IDEMPRESADESTINO = tbemp.IDEMPRESA  
            WHERE 
                1 = 1
        `;

        const params = [];

        if(idEmpresa) {
            query += 'AND tbrv.IDEMPRESAORIGEM = ?';
            params.push(idEmpresa);
        }

        if(dataPesquisa) {
            query += ' AND (tbrv.DTOUTVOUCHER BETWEEN ? AND ?)';
            params.push(`${dataPesquisa} 00:00:00`, `${dataPesquisa} 23:59:59`);
        }


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
        console.error('Erro ao executar a consulta Detalhe Voucher:', error);
        throw error;
    }
};