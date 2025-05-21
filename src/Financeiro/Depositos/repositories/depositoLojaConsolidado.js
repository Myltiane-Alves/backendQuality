import conn from '../../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDepositoLojaConsolidado = async (
    idDeposito, 
    dataCompInicio, 
    dataCompFim, 
    dataMovInicio, 
    dataMovFim, 
    dataPesquisaInicio, 
    dataPesquisaFim, 
    page, 
    pageSize
) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

    

        if (dataPesquisaInicio && dataPesquisaFim) {
            var tipodatapesq = "d.DTDEPOSITO";
            var datapesqini = dataPesquisaInicio;
            var datapesqfin = dataPesquisaFim;
        } else if (dataCompInicio && dataCompFim) {
            var tipodatapesq = "d.DTCOMPENSACAO";
            var datapesqini = dataCompInicio;
            var datapesqfin = dataCompFim;
        } else if (dataMovInicio && dataMovFim) {
            var tipodatapesq = "d.DTMOVIMENTOCAIXA";
            var datapesqini = dataMovInicio;
            var datapesqfin = dataMovFim;
        }

        let query = `
            SELECT DISTINCT
                tbsge.DSSUBGRUPOEMPRESARIAL,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 43 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPBB,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 218 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPITAU,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 58 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPBRAD,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10006 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPBRB,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10018 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPCX,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10008 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPSANT,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPCXTES,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10024 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPTED,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10019 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPCREDS,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10021 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPDPIX,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10022 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPDDIN,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10023 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPPROM,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 3 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPTVALOR,
                (SELECT IFNULL(SUM(d.VRDEPOSITO), 0) FROM "${databaseSchema}".DEPOSITOLOJA d
                    INNER JOIN "${databaseSchema}".EMPRESA tbe1 ON d.IDEMPRESA = tbe1.IDEMPRESA
                    INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge1 ON tbe1.IDSUBGRUPOEMPRESARIAL = tbsge1.IDSUBGRUPOEMPRESARIAL
                    WHERE tbsge1.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL AND d.IDCONTABANCO = 10020 AND d.STATIVO = 'True' AND d.STCANCELADO = 'False'
                    AND (${tipodatapesq} BETWEEN '${datapesqini} 00:00:00' AND '${datapesqfin} 23:59:59')) AS TOTALDEPDEVCX
            FROM
                "${databaseSchema}".DEPOSITOLOJA tbdl
                INNER JOIN "${databaseSchema}".EMPRESA tbe ON tbdl.IDEMPRESA = tbe.IDEMPRESA
                INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL tbsge ON tbe.IDSUBGRUPOEMPRESARIAL = tbsge.IDSUBGRUPOEMPRESARIAL
            WHERE
                1 = ?
        `;

        const params = [1];

        if (idDeposito) {
            query += 'AND tbdl.IDDEPOSITOLOJA = ?';
            params.push(idDeposito)
        }
        
        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (tbdl.DTDEPOSITO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if (dataCompInicio && dataCompFim) {
            query += ' AND (tbdl.DTCOMPENSACAO BETWEEN ? AND ?)';
            params.push(`${dataCompInicio} 00:00:00`, `${dataCompFim} 23:59:59`);
        }
        
        if (dataMovInicio && dataMovFim) {
            query += ' AND (tbdl.DTMOVIMENTOCAIXA BETWEEN ? AND ?)';
            params.push(`${dataMovInicio} 00:00:00`, `${dataMovFim} 23:59:59`);
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
        throw new Error(error.message);
    }
};