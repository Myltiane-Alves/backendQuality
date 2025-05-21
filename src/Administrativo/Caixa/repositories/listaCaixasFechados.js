import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getCaixasFechados = async (idEmpresa, dataFechamento, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                MC.ID AS IDMOVIMENTO, 
                MC.IDCAIXA AS IDCAIXAFECHAMENTO, 
                CX.DSCAIXA AS DSCAIXAFECHAMENTO, 
                TO_VARCHAR(MC.DTABERTURA, 'DD-MM-YYYY HH24:MI:SS') AS DTHORAABERTURACAIXA, 
                TO_VARCHAR(MC.DTFECHAMENTO, 'DD-MM-YYYY HH24:MI:SS') AS DTHORAFECHAMENTOCAIXA, 
                FC.NOFUNCIONARIO AS OPERADORFECHAMENTO, 
                (MC.VRFISICODINHEIRO) AS TOTALFECHAMENTODINHEIROFISICO, 
                (MC.VRRECDINHEIRO) AS TOTALFECHAMENTODINHEIRO, 
                IFNULL(MC.VRAJUSTDINHEIRO, 0) AS TOTALFECHAMENTODINHEIROAJUSTE, 
                (MC.VRRECTEF) AS TOTALFECHAMENTOCARTAO, 
                (MC.VRRECPOS) AS TOTALFECHAMENTOPOS, 
                (MC.VRRECVOUCHER) AS TOTALFECHAMENTOVOUCHER, 
                (MC.VRRECFATURA) AS TOTALFECHAMENTOFATURA, 
                (MC.VRRECCONVENIO) AS TOTALFECHAMENTOCONVENIO, 
                (MC.VRRECPIX) AS TOTALFECHAMENTOPIX, 
                (MC.VRRECPL) AS TOTALFECHAMENTOCPL, 
                MC.STCONFERIDO 
            FROM 
                "${databaseSchema}".MOVIMENTOCAIXA MC 
                LEFT JOIN "${databaseSchema}".CAIXA CX ON MC.IDCAIXA = CX.IDCAIXAWEB  
                LEFT JOIN "${databaseSchema}".FUNCIONARIO FC ON MC.IDOPERADOR = FC.IDFUNCIONARIO  
            WHERE 
                1 = ?
                AND MC.STCANCELADO = 'False'
        `;

        const params = [1];

        if (idEmpresa) {
            query += `AND MC.IDEMPRESA = ?`;
            params.push(idEmpresa);
        }

        if (dataFechamento) {
            query += ' AND (MC.DTABERTURA BETWEEN ? AND ?)';
            params.push(`${dataFechamento} 00:00:00`, `${dataFechamento} 23:59:59`);
        }

       
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, (page - 1) * pageSize);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);



        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (e) {
        console.error("Error in getListaMovimentoCaixa:", e);
        return {
            status: 400,
            body: JSON.stringify({ message: e.toString() })
        };
    }
};


