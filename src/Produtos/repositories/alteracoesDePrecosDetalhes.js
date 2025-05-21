import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
const databaseSchemaSBO = process.env.HANA_DATABASE_SBO;

export const getObterEtoqueAtual = async (idProduto, tpAlteracao, idListaOuEmpresa) => {
  try {
    let qtdEstoqueAtual = 0;

    let query = `
      SELECT
        SUM(IFNULL(TBI.QTDFINAL, 0)) AS QTDESTOQUE  
      FROM 
        "${databaseSchema}".INVENTARIOMOVIMENTO TBI
    `;

    query += ` AND TBI.IDPRODUTO = '${idProduto}' AND TBI.STATIVO = 'True' `;
    
    if(tpAlteracao == '0') {
      query += `
        INNER JOIN "${databaseSchema}".DETALHELISTAPRECO TBD ON
          TBI.IDEMPRESA = TBD.IDEMPRESA
        WHERE 
          TBD.IDRESUMOLISTAPRECO = ?
      `;
      params.push(idListaOuEmpresa);
    } else {
      query += `WHERE AND TBI.IDEMPRESA = ? `;
      params.push(idListaOuEmpresa);
    }

    query += ` AND TBI.IDPRODUTO = '${idProduto}' AND TBI.STATIVO = 'True' `;
    const params = [];
    const statement = conn.prepare(query);
    const result = await statement.exec(params);

    if (!Array.isArray(result) || result.length === 0) return null;

    const det = result[0];
    
    return det.QTDESTOQUE;
  } catch (error) {
    console.error("Erro ao consulta Estoque Atual", error);
    throw error;
  }
};

export const getObterLinhasDoDetalhe = async (idResumoLista) => {
  try {
    let query = `
      SELECT DISTINCT
          TBD.IDDETALHEALTERACAOPRECOPRODUTO,
          TBD.IDRESUMOALTERACAOPRECOPRODUTO,
          TBD.TPALTERADOGRUPOEMP,
          TBD.IDGRUPOEMP,
          TBD.IDPRODUTO,
          TO_VARCHAR(IFNULL(TBP.DTCADASTRO, (SELECT "CreateDate" FROM ${databaseSchemaSBO}.OITM WHERE "ItemCode" = TBP.IDPRODUTO)), 'DD/MM/YYYY HH24:MI:SS') AS DTCADASTRO,
          TBP.DSNOME,
          TBP.NUCODBARRAS,
          TBD.PRECOVENDAANTERIOR,
          TBD.PRECOVENDANOVO,
          TBD.QTDESTOQUEAOCADASTRAR,
          TBD.QTDESTOQUEAOEXECUTAR,
          TBD.STATIVO,
          CASE 
        WHEN TBD.TPALTERADOGRUPOEMP = 0 THEN (
        SELECT
            IFNULL(SUM(IFNULL(QTDFINAL, 0)), 0) AS QTDESTOQUE  
        FROM 
            "${databaseSchema}".INVENTARIOMOVIMENTO TBI
        INNER JOIN "${databaseSchema}".DETALHELISTAPRECO TBDP ON
            TBI.IDEMPRESA = TBDP.IDEMPRESA
        WHERE 
            TBI.IDPRODUTO = TBP.IDPRODUTO
            AND TBDP.IDRESUMOLISTAPRECO = TBD.IDGRUPOEMP
            AND TBI.STATIVO = 'True'
        )
        ELSE (
          SELECT
            IFNULL(SUM(IFNULL(QTDFINAL, 0)), 0) AS QTDESTOQUE  
          FROM 
            "${databaseSchema}".INVENTARIOMOVIMENTO TBI
          WHERE 
            TBI.IDPRODUTO = TBD.IDPRODUTO
            AND TBI.IDEMPRESA = TBD.IDGRUPOEMP
            AND TBI.STATIVO = 'True'
        )
			END AS QTDESTOQUEATUAL
        FROM
          "${databaseSchema}".DETALHEALTERACAOPRECOPRODUTO TBD
        INNER JOIN "${databaseSchema}".PRODUTO TBP ON
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
        "DTCADASTRO": det.DTCADASTRO,
        "DSNOME": det.DSNOME,
        "NUCODBARRAS": det.NUCODBARRAS,
        "PRECOVENDAANTERIOR": det.PRECOVENDAANTERIOR,
        "PRECOVENDANOVO": det.PRECOVENDANOVO,
        "QTDESTOQUEAOCADASTRAR": det.QTDESTOQUEAOCADASTRAR,
        "QTDESTOQUEAOEXECUTAR": det.QTDESTOQUEAOEXECUTAR,
        "QTDESTOQUEATUAL": det.QTDESTOQUEATUAL,//obterEstoqueAtual(det.IDPRODUTO, det.TPALTERADOGRUPOEMP, det.IDGRUPOEMP),
        "STATIVO": det.STATIVO
      }
    };
    return docLine;
  } catch (error) {
    console.error("Erro ao consulta Detalhe Alteração preço produto", error);
    throw error;
  }
};


export const getAlteracoesPrecosDetalhe = async (idResumoAlteracao, idLoja, idLista, idUsuario, idProduto, codBarras, descProduto, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
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
        TO_VARCHAR(TBR.AGENDAMENTOALTERACAO, 'YYYY-MM-DD HH24:MI:SS') as AGENDAMENTOALTERACAO,
        TBR.RESPATUALIZACAO,
        TO_VARCHAR(TBR.DATAATUALIZACAO, 'YYYY-MM-DD HH24:MI:SS') as DATAATUALIZACAO
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

    if(idLoja) {
      query += `AND TBD.TPALTERADOGRUPOEMP = 1 AND TBE.IDEMPRESA = ? OR TBDL.IDEMPRESA = ? `;
      params.push(idLoja, idLoja);
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
      descProduto = descProduto.replace(/\s+/g, '%');
      query += ` AND CONTAINS(TBR.DATAALTERACAO = ?)`;
      params.push(`%${descProduto}%`);
    }

    if (dataPesquisaInicio && dataPesquisaFim) {
      query += ` AND (tbrp.DTPEDIDO  BETWEEN ? AND ?) `;
      query += `AND (TBR.DATAALTERACAO BETWEEN ? AND ? OR TBR.AGENDAMENTOALTERACAO BETWEEN ? AND ?)`
      params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
      params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
    }

    query += ` ORDER BY TBR.IDRESUMOALTERACAOPRECOPRODUTO`;
    const statement = conn.prepare(query);
    const result = await statement.exec(params);
    const data = await Promise.all(result.map(async registro => {
      
      return {
        "alteracaoPreco": {
          "IDRESUMOALTERACAOPRECOPRODUTO": registro.IDRESUMOALTERACAOPRECOPRODUTO,
          "NOMELISTA": registro.NOMELISTA,
          "IDUSUARIO": registro.IDUSUARIO,
          "NOFUNCIONARIO": registro.NOFUNCIONARIO,
          "DATACRIACAO": registro.DATACRIACAO,
          "DATACRIACAOFORMATADA": registro.DATACRIACAOFORMATADA,
          "NOEMPRESA": registro.NOFANTASIA,
          "QTDITENS": registro.QTDITENS,
          "STCANCELADO": registro.STCANCELADO,
          "STEXECUTADO": registro.STEXECUTADO,
          "AGENDAMENTOALTERACAO": registro.AGENDAMENTOALTERACAO,
          "AGENDAMENTOALTERACAOFORMATADO": registro.AGENDAMENTOALTERACAOFORMATADO,
          "RESPATUALIZACAO": registro.RESPATUALIZACAO,
          "DATAATUALIZACAO": registro.DATAATUALIZACAO,
          "detalheAlteracao": getObterLinhasDoDetalhe(registro.IDRESUMOALTERACAOPRECOPRODUTO)
        },
        
      };
    }));
    return {
      page,
      pageSize,
      rows: data.length,
      data: data
    };
  } catch (error) {
    console.error("erro ao consultar alteração preço detalhe:", error);
    throw error;
  }
};