import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getObterLinhasDoDetalhe = async (idResumoLista) => {
  try {

    let query = `
        SELECT
            TBD.IDDETALHELISTAPRECO,
            TBD.IDRESUMOLISTAPRECO,
            TBD.IDGRUPOEMPRESARIAL,
            TBD.IDEMPRESA,
            TBE.NOFANTASIA,
            TBD.STATIVO
        FROM
            "${databaseSchema}".DETALHELISTAPRECO TBD
        INNER JOIN "${databaseSchema}".EMPRESA TBE ON
            TBE.IDEMPRESA = TBD.IDEMPRESA
        WHERE
            TBD.IDRESUMOLISTAPRECO = ?
    `;
    
    const params = [idResumoLista];
    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    if (!Array.isArray(result) || result.length === 0) return [];

    return result.map((det, index) => ({
        "@nItem": index + 1,
        "loja": {
          "IDDETALHELISTAPRECO": det.IDDETALHELISTAPRECO,
          "IDRESUMOLISTAPRECO": det.IDRESUMOLISTAPRECO,
          "IDGRUPOEMPRESARIAL": det.IDGRUPOEMPRESARIAL,
          "IDEMPRESA": det.IDEMPRESA,
          "NOFANTASIA": det.NOFANTASIA,
          "STATIVO": det.STATIVO,
        }
    }));
  } catch (error) {
    console.error("Erro ao consulta Detalhe ", error);
    throw error;
  }
};

export const getListaPrecos = async (idResumoLista, idLoja, nomeLista,  dataPesquisaInicio, dataPesquisaFim,  page, pageSize) => {
  try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

    let query = `
        SELECT DISTINCT
            TBR.IDRESUMOLISTAPRECO,
            TBR.NOMELISTA,
            TBR.IDUSERCRIACAO,
            TO_VARCHAR(TBR.DATACRIACAO, 'DD/MM/YYYY') AS DATACRIACAO,
            TBR.IDUSERALTERACAO,
            TO_VARCHAR(TBR.DATAALTERACAO, 'DD/MM/YYYY') AS DATAALTERACAO,
            TBR.STATIVO
        FROM 
            "${databaseSchema}".RESUMOLISTAPRECO TBR
        INNER JOIN "${databaseSchema}".DETALHELISTAPRECO TBD ON
            TBD.IDRESUMOLISTAPRECO = TBR.IDRESUMOLISTAPRECO
        WHERE 
            1 = ?
    `;

    const params = [1];

    if (idResumoLista) {
      query += ` AND TBR.IDRESUMOLISTAPRECO = ? `;
      params.push(idResumoLista);
    }

    if (idLoja) {
        query += ` AND TBD.IDEMPRESA = ? `;
        params.push(idLoja);
    }

    if (nomeLista) {
        query += ` AND CONTAINS((TBR.NOMELISTA, TBR.IDRESUMOLISTAPRECO), ? )`;
        params.push(`%${nomeLista}%`);
    }
   

    if (dataPesquisaInicio && dataPesquisaFim) {
        query += ` AND (TBR.DATACRIACAO BETWEEN ? AND ? OR TBR.DATAALTERACAO BETWEEN ? AND ?) `;
        params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
    }

    query += ` ORDER BY TBR.IDRESUMOLISTAPRECO `;
    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    const data = await Promise.all(result.map(async (registro) => {
      const detalheLista = await getObterLinhasDoDetalhe(registro.IDRESUMOLISTAPRECO);
      return {
        "listaPreco": {
            "IDRESUMOLISTAPRECO": registro.IDRESUMOLISTAPRECO,
            "NOMELISTA": registro.NOMELISTA,
            "IDUSERCRIACAO": registro.IDUSERCRIACAO,
            "DATACRIACAO": registro.DATACRIACAO,
            "IDUSERALTERACAO": registro.IDUSERALTERACAO,
            "DATAALTERACAO": registro.DATAALTERACAO,
            "STATIVO": registro.STATIVO,
        },
        "detalheLista": detalheLista
      };
    }));

    return {
        page,
        pageSize,
        rows: data.length,
        data: data,
    };
  } catch (error) {
    console.error("erro ao consultar Lista de Preços:", error);
    throw error;
  }
};
