import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getResumoVenda = async (idEmpresa, dataFechamento, page, pageSize) => {
    try {
  
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
        let query = `
            SELECT 
                SUM(rv.VRTOTALPAGO) AS VRTOTALVENDA, 
                SUM(rv.VRRECDINHEIRO) AS VRRECDINHEIRO, 
                SUM(rv.VRRECCARTAO) AS VRRECCARTAO, 
                SUM(rv.VRRECCONVENIO) AS VRRECCONVENIO, 
                SUM(rv.VRRECPOS) AS VRRECPOS, 
                SUM(rv.VRRECCHEQUE) AS VRRECCHEQUE, 
                SUM(rv.VRRECVOUCHER) AS VRRECVOUCHER, 
                SUM(NFE_INFNFE_TOTAL_ICMSTOT_VNF - rv.VRRECVOUCHER) AS VRTOTAL,
                COUNT(rv.IDVENDA) AS QTDVENDAS, 
                SUM(rv.VRRECDINHEIRO + rv.VRRECCARTAO + rv.VRRECCONVENIO + rv.VRRECPOS + rv.VRRECCHEQUE) / COUNT(rv.IDVENDA) AS VRTICKETWEB 
            FROM                                          
                "QUALITY_CONC_TST".VENDA rv 
            WHERE 
                1 = ? 
            AND rv.STCANCELADO = 'False'
        `;

    
        const params = [1];

        if (idEmpresa > 0) {
            query += ' AND rv.IDEMPRESA = ?';
            params.push(idEmpresa);
        }


        if (dataFechamento) {
            query += ' AND (rv.DTHORAFECHAMENTO BETWEEN ? AND ?) ';
            params.push(`${dataFechamento} 00:00:00`, `${dataFechamento} 23:59:59`);
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
        console.error('Erro ao executar a consulta Resumo venda :', error);
        throw error;
    }
};
