import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
export const getObterLinhasDoDetalhe = async (idResumoLista) => {
  try {
    var query = `
        SELECT DISTINCT
            TBD.IDDETALHEALTERACAOPRECOPRODUTO,
            TBD.IDRESUMOALTERACAOPRECOPRODUTO,
            TBD.IDPRODUTO,
            TBP.DSNOME,
            TBP.NUCODBARRAS,
            TBD.PRECOVENDAANTERIOR,
            TBD.PRECOVENDANOVO
        FROM
            "${databaseSchema}.DETALHEALTERACAOPRECOPRODUTO TBD
        INNER JOIN "${databaseSchema}.PRODUTO TBP ON
            TBP.IDPRODUTO = TBD.IDPRODUTO
        WHERE
            TBD.IDRESUMOALTERACAOPRECOPRODUTO = ?
    `;

    query += `ORDER BY TBD.IDRESUMOALTERACAOPRECOPRODUTO, TBD.IDDETALHEALTERACAOPRECOPRODUTO`
    const params = [idResumoLista];
    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    if (!Array.isArray(result) || result.length === 0) return null;

    const det = result[0];
    
    const docLine = {
        "@nItem": i + 1,
        "produto": {
            "IDRESUMOALTERACAOPRECOPRODUTO": det.IDRESUMOALTERACAOPRECOPRODUTO,
            "IDDETALHEALTERACAOPRECOPRODUTO": det.IDDETALHEALTERACAOPRECOPRODUTO,
            "IDPRODUTO": det.IDPRODUTO,
            "DSNOME": det.DSNOME,
            "NUCODBARRAS": det.NUCODBARRAS,
            "PRECOVENDAANTERIOR": det.PRECOVENDAANTERIOR,
            "PRECOVENDANOVO": det.PRECOVENDANOVO
        }
    };
    return docLine;
  } catch (error) {
    console.error("Erro ao consulta Detalhe Alteração preço produto", error);
    throw error;
  }
};
export const getAlteracoesPrecoResumo = async (idResumoAlteracao, idLoja, idLista, idUsuario, idProduto, codBarras, descProduto, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
  try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
    let query = `
      SELECT DISTINCT 
        TBR.IDRESUMOALTERACAOPRECOPRODUTO,
        TBR.TPALTERACAO,
        TBRL.IDRESUMOLISTAPRECO,
        TBRL.NOMELISTA,
        TBE.IDEMPRESA,
        TBE.NOFANTASIA,
        TBR.IDUSUARIO,
        TBF.NOFUNCIONARIO,
        TBR.QTDITENS,
        TBR.STCANCELADO,
        TBR.STEXECUTADO,
        TO_VARCHAR(TBR.DATAALTERACAO, 'DD/MM/YYYY HH24:MI:SS') AS DATACRIACAOFORMATADA,
        TO_VARCHAR(TBR.DATAALTERACAO, 'YYYY-MM-DD HH24:MI:SS') as DATACRIACAO, 
        TBR.IDUSUARIO,
        TO_VARCHAR(TBR.AGENDAMENTOALTERACAO, 'DD/MM/YYYY HH24:MI:SS') AS AGENDAMENTOALTERACAOFORMATADO,
        TO_VARCHAR(TBR.AGENDAMENTOALTERACAO, 'YYYY-MM-DD HH24:MI:SS') as AGENDAMENTOALTERACAO
      FROM
        "${databaseSchema}".RESUMOALTERACAOPRECOPRODUTO TBR
      LEFT JOIN "${databaseSchema}".DETALHEALTERACAOPRECOPRODUTO TBD ON
        TBR.IDRESUMOALTERACAOPRECOPRODUTO = TBD.IDRESUMOALTERACAOPRECOPRODUTO
      INNER JOIN "${databaseSchema}".FUNCIONARIO TBF ON 
          TBR.IDUSUARIO = TBF.IDFUNCIONARIO
      LEFT JOIN "${databaseSchema}".PRODUTO TBP ON
          TBD.IDPRODUTO = TBP.IDPRODUTO
      LEFT JOIN "${databaseSchema}".EMPRESA TBE ON
        TBD.IDGRUPOEMP = TBE.IDEMPRESA
        AND TBD.TPALTERADOGRUPOEMP = 1
      LEFT JOIN "${databaseSchema}".RESUMOLISTAPRECO TBRL ON
        TBD.IDGRUPOEMP = TBRL.IDRESUMOLISTAPRECO
        AND TBD.TPALTERADOGRUPOEMP = 0
      LEFT JOIN "${databaseSchema}".DETALHELISTAPRECO TBDL ON
          TBRL.IDRESUMOLISTAPRECO = TBDL.IDRESUMOLISTAPRECO
      WHERE 
          1 = ? 
    `;
    const params = [1];

    if (idResumoAlteracao) {
      query += ` AND TBR.IDRESUMOALTERACAOPRECOPRODUTO = ? `;
      params.push(idResumoAlteracao);
    }

    if(idLista) {
      query += ` AND TBD.TPALTERADOGRUPOEMP = 0 AND TBRL.IDRESUMOLISTAPRECO = ? `;
      params.push(idLista);
    }

    if(idUsuario) {
      query += ` AND TBR.IDUSUARIO = ? `;
      params.push(idUsuario);
    }

    if(idProduto) {
      query += ` AND TBD.IDPRODUTO = ? `;
      params.push(idProduto);
    }

    if(codBarras) {
      query += ` AND CONTAINS(TBP.NUCODBARRAS = ?)`;
      params.push(`%${codBarras}%`);
    }

    if(descProduto) {
      query += ` AND CONTAINS(TBR.DATAALTERACAO = ?)`;
      params.push(`%${descProduto}%`);
    }

    if (dataPesquisaInicio && dataPesquisaFim) {
      query += ` AND (tbrp.DTPEDIDO  BETWEEN ? AND ?) `;
      query += `AND (TBR.DATAALTERACAO BETWEEN ? AND ? OR TBR.AGENDAMENTOALTERACAO BETWEEN ? AND ?)`
      params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
      params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
    }

    query += ` ORDER BY TBR.IDRESUMOALTERACAOPRECOPRODUTO `;
    const statement = conn.prepare(query);
    const result = await statement.exec(params);
    const data = await Promise.all(result.map(async registro => {
      const detalheGrade = await getDetalhePedido(registro.IDDETPEDIDO);
      return {
        "detpedido": {
          "IDDETPEDIDO": registro.IDDETPEDIDO,
          "IDPEDIDO": registro.IDPEDIDO,
          "IDCOR": registro.IDCOR,
          "IDESTRUTURAMERCADOLOGICA": registro.IDESTRUTURAMERCADOLOGICA,
          "DSSUBGRUPOESTRUTURA": registro.DSSUBGRUPOESTRUTURA,
          "DSGRUPOESTRUTURA": registro.DSGRUPOESTRUTURA,
          "IDCATEGORIAPEDIDO": registro.IDCATEGORIAPEDIDO,
          "DSCATEGORIAPEDIDO": registro.DSCATEGORIAPEDIDO,
          "DSCOR": registro.DSCOR,
          "DSLOCALEXPOSICAO": registro.DSLOCALEXPOSICAO,
          "DSESTILO": registro.DSESTILO,
          "DSTIPOTECIDO": registro.DSTIPOTECIDO,
          "NUREF": registro.NUREF,
          "DSPRODUTO": registro.DSPRODUTO,
          "QTDTOTAL": registro.QTDTOTAL,
          "NUCAIXA": registro.NUCAIXA,
          "DSSIGLA": registro.DSSIGLA,
          "VRUNITBRUTODETALHEPEDIDO": registro.VRUNITBRUTODETALHEPEDIDO,
          "DESC01": registro.DESC01,
          "DESC02": registro.DESC02,
          "DESC03": registro.DESC03,
          "VRUNITLIQDETALHEPEDIDO": registro.VRUNITLIQDETALHEPEDIDO,
          "VRVENDADETALHEPEDIDO": registro.VRVENDADETALHEPEDIDO,
          "VRTOTALDETALHEPEDIDO": registro.VRTOTALDETALHEPEDIDO,
          "STRECEBIDO": registro.STRECEBIDO,
          "STCANCELADO": registro.STCANCELADO,
          "STREDESOCIAL": registro.STREDESOCIAL,
          "STECOMMERCE": registro.STECOMMERCE,
          "OBSPRODUTO": registro.OBSPRODUTO,
          "DTPEDIDO": registro.DTPEDIDO
        },
        "detalheGrade": detalheGrade
      };
    }));
    return {
      page,
      pageSize,
      rows: data.length,
      data: data
    };
  } catch (error) {
    console.error("erro ao consultar detalhe pedido:", error);
    throw error;
  }
};