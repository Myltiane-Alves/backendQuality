import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
import { toFloat } from "../../../utils/toFloat.js";
const databaseSchema = process.env.HANA_DATABASE;

export const getListaPCJ = async (idMovimento, limit, offset) => {
    try {
        const query = `
            SELECT 
                SUM(tbv.VRRECCARTAO) AS TOTALVENDIDOCARTAO, 
                (SELECT IFNULL(SUM(tbvp.VALORRECEBIDO), 0) 
                FROM "${databaseSchema}".VENDAPAGAMENTO tbvp 
                INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA = tbv1.IDVENDA 
                WHERE tbv1.IDMOVIMENTOCAIXAWEB = '${idMovimento}' 
                AND tbv1.STCANCELADO = 'False' 
                AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) 
                AND (tbvp.NOAUTORIZADOR = 'Credsystem' OR tbvp.NOAUTORIZADOR = 'CREDSYSTEM' OR tbvp.NOAUTORIZADOR = 'PL') 
                AND (tbvp.DSTIPOPAGAMENTO != 'GIRO PREMIADO') 
                AND (tbvp.NPARCELAS = 7 OR tbvp.NPARCELAS = 8)) AS TOTALPCJ78, 
                (SELECT IFNULL(SUM(tbvp.VALORRECEBIDO), 0) 
                FROM "${databaseSchema}".VENDAPAGAMENTO tbvp 
                INNER JOIN "${databaseSchema}".VENDA tbv1 ON tbvp.IDVENDA = tbv1.IDVENDA 
                WHERE tbv1.IDMOVIMENTOCAIXAWEB = '${idMovimento}' 
                AND tbv1.STCANCELADO = 'False' 
                AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) 
                AND (tbvp.NOAUTORIZADOR = 'Credsystem' OR tbvp.NOAUTORIZADOR = 'CREDSYSTEM' OR tbvp.NOAUTORIZADOR = 'PL') 
                AND (tbvp.DSTIPOPAGAMENTO != 'GIRO PREMIADO')) AS TOTALPCJ18 
            FROM "${databaseSchema}".VENDA tbv 
            WHERE tbv.IDMOVIMENTOCAIXAWEB = ? 
            AND tbv.STCANCELADO = 'False'
        `;

        const [rows] = await conn.execute(query, [idMovimento, limit, offset]);

        if (!Array.isArray(rows) || rows.length === 0) return [];
        const lines = rows.map((row, index) => ({
            "@nItem": index + 1,
            "venda-pcj": {
                "TOTALPCJ78": row.TOTALPCJ78 || 0,
                "TOTALPCJ18": row.TOTALPCJ18 || 0
            }
        }));

        return lines;

    } catch (error) {
        throw new Error(error.message);
    }
};

export const getVenda = async (idMovimento) => {
    try {

        const query = `
            SELECT 
                SUM(tbv.VRRECDINHEIRO) AS TOTALVENDIDODINHEIRO, 
                SUM(tbv.VRRECCARTAO) AS TOTALVENDIDOCARTAO, 
                (SELECT IFNULL(SUM(tbvp.VALORRECEBIDO), 0) 
                FROM "${databaseSchema}".VENDAPAGAMENTO tbvp 
                INNER JOIN "${databaseSchema}".VENDA tbv1 
                ON tbvp.IDVENDA = tbv1.IDVENDA 
                WHERE tbv1.IDMOVIMENTOCAIXAWEB = '${idMovimento}' 
                AND tbv1.STCANCELADO = 'False' 
                AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) 
                AND tbvp.NOTEF = 'POS' 
                AND (tbvp.DSTIPOPAGAMENTO != 'PIX')) AS TOTALVENDIDOPOS, 
                (SELECT IFNULL(SUM(tbvp.VALORRECEBIDO), 0) 
                FROM "${databaseSchema}".VENDAPAGAMENTO tbvp 
                INNER JOIN "${databaseSchema}".VENDA tbv1 
                ON tbvp.IDVENDA = tbv1.IDVENDA 
                WHERE tbv1.IDMOVIMENTOCAIXAWEB = '${idMovimento}' 
                AND tbv1.STCANCELADO = 'False' 
                AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) 
                AND tbvp.NOTEF = 'PIX' 
                AND (tbvp.DSTIPOPAGAMENTO = 'PIX')) AS TOTALVENDIDOPIX, 
                (SELECT IFNULL(SUM(tbvp.VALORRECEBIDO), 0) 
			 FROM "${databaseSchema}".VENDAPAGAMENTO tbvp 
                INNER JOIN "${databaseSchema}".VENDA tbv1 
                ON tbvp.IDVENDA = tbv1.IDVENDA 
                WHERE tbv1.IDMOVIMENTOCAIXAWEB = '${idMovimento}' 
                AND tbv1.STCANCELADO = 'False' 
                AND (tbvp.STCANCELADO = 'False' OR tbvp.STCANCELADO IS NULL) 
                AND tbvp.NOTEF = 'POS' 
                AND (tbvp.DSTIPOPAGAMENTO = 'MoovPay')) AS TOTALVENDIDOMOOVPAY, 
                SUM(tbv.VRRECVOUCHER) AS TOTALVENDIDOVOUCHER, 
                SUM(tbv.VRTOTALPAGO) AS TOTALVENDIDO,  
                SUM(tbv.VRRECCONVENIO) AS TOTALVENDIDOCONVENIO,  
                SUM(tbv.NFE_INFNFE_TOTAL_ICMSTOT_VNF) AS TOTALNOTA  
		    FROM 
			    "${databaseSchema}".VENDA tbv 
		    WHERE 
			    tbv.IDMOVIMENTOCAIXAWEB = '${idMovimento}' 
			    AND tbv.STCANCELADO = 'False'
        `;

        const [rows] = await conn.execute(query, [idMovimento]);

        if (!Array.isArray(rows) || rows.length === 0) return [];

        const lines = rows.map((row, index) => ({
            "@nItem": index + 1,
            "venda-movimento": {
                "TOTALVENDIDODINHEIRO": toFloat(row.TOTALVENDIDODINHEIRO) || 0,
                "TOTALVENDIDOCARTAO": toFloat(row.TOTALVENDIDOCARTAO) || 0,
                "TOTALVENDIDOPOS": toFloat(row.TOTALVENDIDOPOS) || 0,
                "TOTALVENDIDOPIX": toFloat(row.TOTALVENDIDOPIX) || 0,
                "TOTALVENDIDOMOOVPAY": toFloat(row.TOTALVENDIDOMOOVPAY) || 0,
                "TOTALVENDIDOVOUCHER": toFloat(row.TOTALVENDIDOVOUCHER)|| 0,
                "TOTALVENDIDO": toFloat(row.TOTALVENDIDO) || 0,
                "TOTALVENDIDOCONVENIO": toFloat(row.TOTALVENDIDOCONVENIO) || 0,
                "TOTALNOTA": toFloat(row.TOTALNOTA) || 0
            }
        }));

        return lines;

    } catch (error) {
        throw new Error(error.message);
    }
};

export const getFatura = async (idEmpresa, idMovimento) => {
    try {
        const query = `
            SELECT 
                SUM(tbdf.VRRECEBIDO) AS TOTALRECEBIDO 
            FROM 
                "${databaseSchema}".DETALHEFATURA tbdf 
            WHERE 
                tbdf.IDEMPRESA = ? 
                AND tbdf.STCANCELADO = 'False'
                AND (tbdf.STPIX = 'False' OR tbdf.STPIX IS NULL)
                AND tbdf.IDMOVIMENTOCAIXAWEB = ?
        `;

        const [rows] = await conn.execute(query, [idEmpresa, idMovimento]);

        if (!Array.isArray(rows) || rows.length === 0) return [];
        const lines = rows.map((row, index) => ({
            "@nItem": index + 1,
            "fatura-movimento": {
                "TOTALRECEBIDOFATURA": row.TOTALRECEBIDO || 0
            }
        }));

        return lines;

    } catch (error) {
        console.error("Error:", error);
        throw new Error(error.message);
    }
};

export const getFaturaPIX = async (idEmpresa, idMovimento) => {
    try {
        const query = `
            SELECT 
                SUM(tbdf.VRRECEBIDO) AS TOTALRECEBIDOPIX 
            FROM 
                "${databaseSchema}".DETALHEFATURA tbdf 
            WHERE 
                tbdf.IDEMPRESA = ? 
                AND tbdf.STCANCELADO = 'False'
                AND tbdf.STPIX = 'True'
                AND tbdf.IDMOVIMENTOCAIXAWEB = ?
        `;

        const params = [idEmpresa, idMovimento];

        const [rows] = await conn.execute(query, params);

        if (!Array.isArray(rows) || rows.length === 0) return [];
        const lines = rows.map((row, index) => ({
            "@nItem": index + 1,
            "fatura-movimento-pix": {
                "TOTALRECEBIDOFATURAPIX": row.TOTALRECEBIDOPIX || 0
            }
        }));

        return lines;

    } catch (error) {
        console.error("Error:", error);
        throw new Error(error.message);
    }
};

export const getListaMovimentoCaixa = async (byId, idEmpresa, dataFechamento, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                tbmc.ID, 
                tbmc.IDOPERADOR, 
                tbmc.VRRECDINHEIRO, 
                tbc.IDCAIXAWEB, 
                tbc.DSCAIXA, 
                tbc.IDEMPRESA, 
                tbf.NOFUNCIONARIO, 
                tbf.NUCPF, 
                tbmc.STFECHADO, 
                TO_VARCHAR(tbmc.DTABERTURA,'YYYY-MM-DD HH24:MI:SS') AS DTABERTURA
            FROM 
                "${databaseSchema}".MOVIMENTOCAIXA tbmc 
                INNER JOIN "${databaseSchema}".CAIXA tbc ON tbmc.IDCAIXA = tbc.IDCAIXAWEB 
                LEFT JOIN "${databaseSchema}".FUNCIONARIO tbf ON tbmc.IDOPERADOR = tbf.IDFUNCIONARIO  
            WHERE 
                1 = 1
        `;

        const params = [];
        
        if(byId) {
            query += ` AND tbmc.ID = ?`;
            params.push(byId);
        }
        
        if (idEmpresa) {
            query += ` AND tbmc.IDEMPRESA = ?`;
           params.push(idEmpresa);
        }

        if (dataFechamento) {
            // query += ' AND (tbmc.DTABERTURA BETWEEN ? AND ?) AND tbmc.ID > 0';
            query += ' AND (tbmc.DTABERTURA BETWEEN ? AND ?)';
            params.push(`${dataFechamento} 00:00:00`, `${dataFechamento} 23:59:59`);
        }

        query += ' GROUP BY tbmc.ID, tbc.IDCAIXAWEB, tbmc.IDOPERADOR, tbf.NUCPF, tbc.DSCAIXA, tbf.NOFUNCIONARIO, tbc.IDEMPRESA, tbmc.STFECHADO, tbmc.DTABERTURA, tbmc.VRRECDINHEIRO';
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, (page - 1) * pageSize);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        const rows = Array.isArray(result) ? result : [];

        const data = await Promise.all(rows.map(async (registro) => ({

            caixa: {
                ID: registro.ID,
                IDOPERADOR: registro.IDOPERADOR,
                VRRECDINHEIRO: registro.VRRECDINHEIRO,
                IDCAIXAWEB: registro.IDCAIXAWEB,
                DSCAIXA: registro.DSCAIXA,
                NOFUNCIONARIO: registro.NOFUNCIONARIO,
                NUCPF: registro.NUCPF,
                DTABERTURA: registro.DTABERTURA,
                STFECHADO: registro.STFECHADO
            },
            venda: await getVenda(registro.ID),
            fatura: await getFatura(idEmpresa, registro.ID),
            faturaPIX: await getFaturaPIX(idEmpresa, registro.ID),
            pcj: await getListaPCJ(registro.ID)
        })));

        return {
            page,
            pageSize,
            rows: data.length,
            data: data
        };
    } catch (e) {
        console.error("Error in getListaMovimentoCaixa:", e);
        return {
            status: 400,
            body: JSON.stringify({ message: e.toString() })
        };
    }
};


