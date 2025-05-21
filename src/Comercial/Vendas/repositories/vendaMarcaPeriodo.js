import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getObterValorVoucher = async (idEmpresa, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        let query = `
            SELECT (v1.VRRECVOUCHER) as VRRECVOUCHER FROM "${databaseSchema}".VENDA v1
                WHERE v1.IDEMPRESA = ?
            AND v1.STCANCELADO = 'False'
            AND (v1.DTHORAFECHAMENTO BETWEEN '${dataPesquisaInicio} 00:00:00' AND '${dataPesquisaFim} 23:59:59')
        `;

        const params = [idEmpresa];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			"VRRECVOUCHER": det.VRRECVOUCHER
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter valor voucher: ' + e.message);
    }
};

export const getObterValorPago = async (idEmpresa, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        let query = `SELECT (v1.VRTOTALPAGO) as VRTOTALPAGO
            FROM "${databaseSchema}".VENDA v1
            WHERE v1.IDEMPRESA = ?
            AND v1.STCANCELADO = 'False'
            AND (v1.DTHORAFECHAMENTO BETWEEN '${dataPesquisaInicio} 00:00:00' AND '${dataPesquisaFim} 23:59:59')
        `;

        const params = [idEmpresa];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			"VRTOTALPAGO": det.VRTOTALPAGO
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter valor pago: ' + e.message);
    }
};

export const getObterValorDesconto = async (idEmpresa, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        let query = `SELECT IFNULL(ROUND(SUM(v1.NFE_INFNFE_TOTAL_ICMSTOT_VDESC), 2), 0) as VRTOTALDESCONTO
            FROM "${databaseSchema}".VENDA v1
            WHERE v1.IDEMPRESA = ?
            AND v1.STCANCELADO = 'False'
            AND (v1.DTHORAFECHAMENTO BETWEEN '${dataPesquisaInicio} 00:00:00' AND '${dataPesquisaFim} 23:59:59')
        `;


        const params = [idEmpresa];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			"VRTOTALDESCONTO": det.VRTOTALDESCONTO
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter valor desconto: ' + e.message);
    }
};

export const getVendasMarcaPeriodo = async (idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT DISTINCT 
                v2.IDEMPRESA,
                v2.NOFANTASIA,
                v2.IDGRUPOEMPRESARIAL,
                ROUND(SUM(v2.QTD)) AS QTD,
                ROUND(SUM(v2.VRTOTALLIQUIDO), 2) AS VRTOTALLIQUIDO,
                ROUND(SUM((v2.QTD * v2.PRECO_COMPRA)), 2) AS TOTALCUSTO
            FROM 
                "${databaseSchema}".VW_VENDAS_PRODUTO_GRUPO_SUBGRUPO v2
            WHERE 
                1 = ? 
        `;
            
        const params = [1];

        if(idEmpresa)  {
            query += 'AND v2.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if(idMarca > 0) {
            query += ' AND v2.IDGRUPOEMPRESARIAL = ?';
            params.push(idMarca);
        }

        if(dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (v2.DTHORAFECHAMENTO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        query += `GROUP BY v2.IDEMPRESA, v2.NOFANTASIA, v2.IDGRUPOEMPRESARIAL `;
        query += `ORDER BY v2.IDEMPRESA`;


        const result = await conn.exec(query, params); 
        const rows = Array.isArray(result) ? result : [];
       
        const data = await Promise.all(rows.map(async (registro) => ({
            vendaMarca: {
                IDEMPRESA: registro.IDEMPRESA,
                NOFANTASIA: registro.NOFANTASIA,
                IDGRUPOEMPRESARIAL: registro.IDGRUPOEMPRESARIAL,
                QTD: registro.QTD,
                VRTOTALLIQUIDO: registro.VRTOTALLIQUIDO,
                TOTALCUSTO: registro.TOTALCUSTO,
            },
            voucher: await getObterValorVoucher(registro.IDEMPRESA, dataPesquisaInicio, dataPesquisaFim),
            valorPago: await getObterValorPago(registro.IDEMPRESA, dataPesquisaInicio, dataPesquisaFim),
            valorDesconto: await getObterValorDesconto(registro.IDEMPRESA, dataPesquisaInicio, dataPesquisaFim)
        })));
        
        return {
            page: page,  
            pageSize: pageSize, 
            rows: data.length,
            data: data
        };
    } catch (error) {
        throw new Error(`Error executar consulta Vendas Marca Periodo: ${error.message}`);
    }
};