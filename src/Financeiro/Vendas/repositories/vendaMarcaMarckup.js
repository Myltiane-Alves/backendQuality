import { toFloat } from '../../../utils/toFloat.js'
import conn from '../../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;


export const getValorVoucher = async (dataPesquisaInicio, dataPesquisaFim, idEmpresa) => {
  try {

    const query = `
      SELECT SUM(v1.VRRECVOUCHER) as VRRECVOUCHER
		    FROM "${databaseSchema}".VENDA v1
		    WHERE v1.IDEMPRESA = ?
		    AND v1.STCANCELADO = 'False'
		    AND (v1.DTHORAFECHAMENTO BETWEEN ? AND ?)
    `;
    const params = [idEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];


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

export const getValorPago = async (dataPesquisaInicio, dataPesquisaFim, idEmpresa) => {
  try {

    const query = `
      SELECT SUM(v1.VRTOTALPAGO) as VRTOTALPAGO
		    FROM "${databaseSchema}".VENDA v1
		    WHERE v1.IDEMPRESA = ?
		    AND v1.STCANCELADO = 'False'
		    AND (v1.DTHORAFECHAMENTO BETWEEN ? AND ?)
    `;

    const params = [idEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];


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

export const getValorDesconto = async (dataPesquisaInicio, dataPesquisaFim, idEmpresa) => {
  try {

    const query = `
      SELECT IFNULL(SUM(v1.NFE_INFNFE_TOTAL_ICMSTOT_VDESC), 0) as VRTOTALDESCONTO
		    FROM "${databaseSchema}".VENDA v1
		    WHERE v1.IDEMPRESA = ?
		    AND v1.STCANCELADO = 'False'
		    AND (v1.DTHORAFECHAMENTO BETWEEN ? AND ?)
    `;
    const params = [idEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];


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

export const getVendasMarcaMarckup = async (idEmpresa, idLoja, idLojaPesquisa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
  try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

    let query = `
      SELECT DISTINCT 
        v2.IDEMPRESA,
        v2.NOFANTASIA,
        SUM(v2.QTD) AS QTD,
        SUM(v2.VRTOTALLIQUIDO) AS VRTOTALLIQUIDO,
        SUM((v2.QTD * v2.PRECO_COMPRA)) AS TOTALCUSTO
      FROM 
        "${databaseSchema}".VW_VENDAS_PRODUTO_GRUPO_SUBGRUPO v2
      WHERE 
        1 = ? 
    `;

    const params = [1];

    if (idEmpresa) {
      query += ` AND v2.IDEMPRESA IN (${idEmpresa}) `;

    }

    if(idLoja != 0) {
        query += ` AND v2.IDEMPRESA IN (${idLoja}) `;
   
    } else {
      if(idMarca != 0 ) {
        query += ` AND v2.IDGRUPOEMPRESARIAL = ? `;
        params.push(idMarca)
      }
    }

    if(idMarca) {
        query += `And  v2.IDGRUPOEMPRESARIAL = ?`
        params.push(idMarca)
    }

    if (idLojaPesquisa) {
      query += ` AND v2.IDEMPRESA IN (${idLojaPesquisa}) `;
  
    }
    
    if (dataPesquisaInicio && dataPesquisaFim) {
      query += ` AND (v2.DTHORAFECHAMENTO BETWEEN ? AND ?) `;
      params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
    }

    query += `GROUP BY v2.IDEMPRESA, v2.NOFANTASIA`;
    query += `LIMIT ? OFFSET ?`;
    params.push(pageSize, (page - 1) * pageSize);
    
    
    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    const data = await Promise.all(result.map(async (registro) => {
      const voucher = await getValorVoucher(dataPesquisaInicio, dataPesquisaFim, registro.IDEMPRESA);
      const valorPago = await getValorPago(dataPesquisaInicio, dataPesquisaFim, registro.IDEMPRESA);
      const valorDesconto = await getValorDesconto(dataPesquisaInicio, dataPesquisaFim, registro.IDEMPRESA);
      return {
        "vendaMarca": {
          "IDEMPRESA": registro.IDEMPRESA,
          "NOFANTASIA": registro.NOFANTASIA,
          "QTD": registro.QTD,
          "VRTOTALLIQUIDO": registro.VRTOTALLIQUIDO,
          "TOTALCUSTO": registro.TOTALCUSTO
        },
        voucher,
        valorPago,
        valorDesconto,
      };
    }));

    return {
      page,
      pageSize,
      data: data,
      rows: data.length,
    };
  } catch (error) {
    console.error("Erro na consulta getVendasMarcaMarckup:", error);
    throw error;
  }
};