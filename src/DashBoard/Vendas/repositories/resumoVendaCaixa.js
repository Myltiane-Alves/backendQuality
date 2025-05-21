import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getResumoVendaCaixa = async (idVenda, idEmpresa, dataFechamento, statusCancelado, page, pageSize) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

       
        let query = `
            SELECT DISTINCT 
                TBV.IDVENDA, 
                TBE.NOFANTASIA, 
                TBC.IDCAIXAWEB, 
                TBC.DSCAIXA, 
                TBF.NOFUNCIONARIO, 
                TBV.IDMOVIMENTOCAIXAWEB, 
                TBV.NFE_INFNFE_IDE_SERIE, 
                TBV.NFE_INFNFE_TOTAL_ICMSTOT_VPROD, 
                TBV.NFE_INFNFE_TOTAL_ICMSTOT_VDESC, 
                TBV.VRTOTALVENDA, 
                TBV.PROTNFE_INFPROT_CHNFE, 
                TBV.PROTNFE_INFPROT_NPROT, 
                TBV.NFE_INFNFE_IDE_NNF, 
                TBV.DEST_CPF, 
                TBV.VRRECCONVENIO, 
                TBV.VRRECVOUCHER, 
                TBV.VRTOTALDESCONTO, 
                TO_VARCHAR(TBV.DTHORAABERTURA, 'DD-MM-YYYY HH24:MI:SS') AS DTHORAABERTURA, 
                TO_VARCHAR(TBV.DTHORAFECHAMENTO, 'DD-MM-YYYY HH24:MI:SS') AS DTHORAFECHAMENTO, 
                TBV.NFE_INFNFE_TOTAL_ICMSTOT_VNF AS VRTOTALPAGO, 
                TO_VARCHAR(TBV.TXTMOTIVOCANCELAMENTO) AS TXTMOTIVOCANCELAMENTO, 
                TBV.STATIVO, 
                TBV.STCANCELADO, 
                TO_VARCHAR(TBV.TXTMOTIVODESCONTO) AS TXTMOTIVODESCONTO, 
                TBV.STCONTINGENCIA 
            FROM 
                "${databaseSchema}".VENDA TBV 
                INNER JOIN "${databaseSchema}".CAIXA TBC ON TBV.IDCAIXAWEB = TBC.IDCAIXAWEB 
                INNER JOIN "${databaseSchema}".FUNCIONARIO TBF ON TBV.IDOPERADOR = TBF.IDFUNCIONARIO 
                INNER JOIN "${databaseSchema}".EMPRESA TBE ON TBV.IDEMPRESA = TBE.IDEMPRESA 
            WHERE 
                1 = ?
        `;

        const params = [1];

        if(statusCancelado) {
            query += ` AND TBV.STCANCELADO = ?`
            params.push(statusCancelado)
        }

        if(idVenda) {
            query += ` AND TBV.IDVENDA = ?`
            params.push(idVenda)
        }

        if (idEmpresa > 0) {
            query += ' AND TBV.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if(dataFechamento){
            query += ` AND (TBV.DTHORAFECHAMENTO BETWEEN ? AND ? )`;
            params.push(`${dataFechamento} 00:00:00`, `${dataFechamento} 23:59:59`)
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
            data: result,
        };

    } catch (error) {
        console.error('Erro ao executar a consulta de vendas resumidas:', error);
        throw error;
    }
};
