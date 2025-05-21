import { toFloat } from '../../../../../web/src/utils/toFloat.js';
import conn from '../../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getValorICMS = async (dataPesquisaInicio, dataPesquisaFim, idGrupoEmpresa) => {
  try {

    const query = `
      SELECT IFNULL(SUM(v1.NFE_INFNFE_TOTAL_ICMSTOT_VICMS), 0) as VRRICMS
    FROM "${databaseSchema}".VENDA v1
    INNER JOIN "${databaseSchema}".EMPRESA v3 ON v1.IDEMPRESA = v3.IDEMPRESA
    INNER JOIN "${databaseSchema}".GRUPOEMPRESARIAL v4 ON v3.IDGRUPOEMPRESARIAL = v4.IDGRUPOEMPRESARIAL
    WHERE v4.IDGRUPOEMPRESARIAL = ?
      AND v1.STCANCELADO = 'False'
      AND (v1.DTHORAFECHAMENTO BETWEEN ? AND ?)
    `;

    const params = [idGrupoEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];

    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    if (!Array.isArray(result) || result.length === 0) return null;
    const det = result[0];
    const docLine = {
      vrTotalICMS: toFloat(det.VRRICMS)
    }

    return docLine;
  } catch (error) {
    console.error("Erro ao consulta getValorICMS:", error);
    throw error;
  }
};

export const getValorVoucher = async (dataPesquisaInicio, dataPesquisaFim, idGrupoEmpresa) => {
  try {

    const query = `
      SELECT IFNULL(SUM(v1.VRRECVOUCHER), 0) as VRRECVOUCHER
        FROM "${databaseSchema}".VENDA v1
        INNER JOIN "${databaseSchema}".EMPRESA v3 ON v1.IDEMPRESA = v3.IDEMPRESA
        INNER JOIN "${databaseSchema}".GRUPOEMPRESARIAL v4 ON v3.IDGRUPOEMPRESARIAL = v4.IDGRUPOEMPRESARIAL
      WHERE v4.IDGRUPOEMPRESARIAL = ?
        AND v1.STCANCELADO = 'False'
        AND (v1.DTHORAFECHAMENTO BETWEEN ? AND ?)
    `;

    const params = [idGrupoEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];


    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    if (!Array.isArray(result) || result.length === 0) return null;
    const det = result[0];
    const docLine = {
      vrTotalVoucher: toFloat(det.VRRECVOUCHER)
    }

    return docLine;
  } catch (error) {
    console.error("Erro ao consulta getValorVoucher:", error);
    throw error;
  }
};

export const getValorPago = async (dataPesquisaInicio, dataPesquisaFim, idGrupoEmpresa) => {
  try {

    const query = `
      SELECT IFNULL(SUM(v1.VRTOTALPAGO), 0) as VRTOTALPAGO
        FROM "${databaseSchema}".VENDA v1
        INNER JOIN "${databaseSchema}".EMPRESA v3 ON v1.IDEMPRESA = v3.IDEMPRESA
        INNER JOIN "${databaseSchema}".GRUPOEMPRESARIAL v4 ON v3.IDGRUPOEMPRESARIAL = v4.IDGRUPOEMPRESARIAL
      WHERE v4.IDGRUPOEMPRESARIAL = ?
        AND v1.STCANCELADO = 'False'
        AND (v1.DTHORAFECHAMENTO BETWEEN ? AND ?)
    `;

    const params = [idGrupoEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];


    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    if (!Array.isArray(result) || result.length === 0) return null;
    const det = result[0];
    const docLine = {
      vrTotalPago: toFloat(det.VRTOTALPAGO)
    }

    return docLine;
  } catch (error) {
    console.error("Erro ao consulta getValorPago:", error);
    throw error;
  }
};

export const getValorDesconto = async (dataPesquisaInicio, dataPesquisaFim, idGrupoEmpresa) => {
  try {

    const query = `
      SELECT IFNULL(SUM(v1.NFE_INFNFE_TOTAL_ICMSTOT_VDESC), 0) as VRTOTALDESCONTO
		  FROM "${databaseSchema}".VENDA v1
		  INNER JOIN "${databaseSchema}".EMPRESA v3 ON v1.IDEMPRESA = v3.IDEMPRESA
		  INNER JOIN "${databaseSchema}".GRUPOEMPRESARIAL v4 ON v3.IDGRUPOEMPRESARIAL = v4.IDGRUPOEMPRESARIAL
		WHERE v4.IDGRUPOEMPRESARIAL = ?
		  AND v1.STCANCELADO = 'False'
		  AND (v1.DTHORAFECHAMENTO BETWEEN ? AND ?)
    `
    const params = [idGrupoEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];


    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    if (!Array.isArray(result) || result.length === 0) return null;
    const det = result[0];
    const docLine = {
      vrTotalDesconto: toFloat(det.VRTOTALDESCONTO)
    }

    return docLine;
  } catch (error) {
    console.error("Erro ao consulta getValorDesconto:", error);
    throw error;
  }
};

export const getVendasMarcaRob = async (idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
  try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

    let query = `
      SELECT DISTINCT 
        v2.IDGRUPOEMPRESARIAL,
        v3.DSGRUPOEMPRESARIAL,
        SUM(v2.QTD) AS QTD,
        SUM(v2.VRTOTALLIQUIDO) AS VRTOTALLIQUIDO,
        SUM((v2.QTD * v2.PRECO_COMPRA)) AS TOTALCUSTO 
      FROM 
        "${databaseSchema}".VW_VENDAS_PRODUTO_GRUPO_SUBGRUPO v2
        INNER JOIN "${databaseSchema}".GRUPOEMPRESARIAL v3 ON v2.IDGRUPOEMPRESARIAL = v3.IDGRUPOEMPRESARIAL
      WHERE 
        1 = ? 
      `;

    const params = [1];

    if (idEmpresa > 0) {
      query += ` AND v2.IDEMPRESA = ? `;
      params.push(idEmpresa);
    }

    if(idMarca > 0) {
        query += `And  v2.IDGRUPOEMPRESARIAL = ?`
        params.push(idMarca)
    }

    if (dataPesquisaInicio && dataPesquisaFim) {
      query += ` AND (v2.DTHORAFECHAMENTO BETWEEN ? AND ?) `;
      params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
    }

    query += `GROUP BY v2.IDGRUPOEMPRESARIAL, v3.DSGRUPOEMPRESARIAL`;
    query += ` LIMIT ? OFFSET ?`;
    const offset = (page - 1) * pageSize;
    params.push(pageSize, offset);
    
    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    const data = await Promise.all(result.map(async (registro) => {
      const valorICMS = await getValorICMS(dataPesquisaInicio, dataPesquisaFim, registro.IDGRUPOEMPRESARIAL);
      const voucher = await getValorVoucher(dataPesquisaInicio, dataPesquisaFim, registro.IDGRUPOEMPRESARIAL);
      const valorPago = await getValorPago(dataPesquisaInicio, dataPesquisaFim, registro.IDGRUPOEMPRESARIAL);
      const valorDesconto = await getValorDesconto(dataPesquisaInicio, dataPesquisaFim, registro.IDGRUPOEMPRESARIAL);
      return {
        "vendaMarca": {
          "IDGRUPOEMPRESARIAL": registro.IDGRUPOEMPRESARIAL,
          "DSGRUPOEMPRESARIAL": registro.DSGRUPOEMPRESARIAL,
          "QTD": registro.QTD,
          "VRTOTALLIQUIDO": registro.VRTOTALLIQUIDO,
          "TOTALCUSTO": registro.TOTALCUSTO
        },
        voucher,
        valorPago,
        valorDesconto,
        valorICMS
      };
    }));

    return {
      page,
      pageSize,
      data: data,
      rows: data.length,
    };
  } catch (error) {
    console.error("Erro na consulta getVendasMarcaRob:", error);
    throw error;
  }
};