import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalhePedidos = async (idPedido, idDetalhePedido, stTransformado, stReposicao, dataPesquisaInicio, dataPesquisaFim,  page, pageSize) => {
  try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

    let query = `
        SELECT 
            tbrp.IDGRUPOEMPRESARIAL, 
            tbrp.IDSUBGRUPOEMPRESARIAL, 
            tbrp.IDANDAMENTO, 
            tband.DSSETOR, 
            tbdp.IDDETALHEPEDIDO AS IDDETPEDIDO, 
            tbdp.IDRESUMOPEDIDO AS IDPEDIDO, 
            tbdp.IDCOR, 
            tbdp.IDTIPOTECIDO, 
            SE.IDGRUPOESTRUTURA, 
            tbdp.IDSUBGRUPOESTRUTURA, 
            SE.DSSUBGRUPOESTRUTURA, 
            tbdp.IDCATEGORIAPEDIDO, 
            CP.DSCATEGORIAPEDIDO, 
            CP.TIPOPEDIDO, 
            CR.DSCOR, 
            FR.IDFORNECEDOR, 
            FR.NORAZAOSOCIAL, 
            FR.IDFORNECEDORSAP, 
            FR.STMIGRADOSAP as STMIGRADOSAPFORNECEDOR, 
            FB.IDFABRICANTE, 
            FB.DSFABRICANTE, 
            FB.IDSAP as IDFABRICANTESAP, 
            FB.STMIGRADOSAP as STMIGRADOSAPFABRICANTE, 
            TBT.DSTIPOTECIDO, 
            LE.IDLOCALEXPOSICAO, 
            LE.DSLOCALEXPOSICAO, 
            ES.IDESTILO, 
            ES.DSESTILO, 
            tbdp.NUREF, 
            tbdp.DSPRODUTO, 
            tbdp.QTDTOTAL, 
            tbdp.NUCAIXA, 
            UN.DSSIGLA, 
            UN.IDUNIDADEMEDIDA, 
            (tbdp.VRUNITBRUTO) AS VRUNITBRUTODETALHEPEDIDO, 
            IFNULL(tbdp.DESC01, 0) AS DESC01, 
            IFNULL(tbdp.DESC02, 0) AS DESC02, 
            IFNULL(tbdp.DESC03, 0) AS DESC03, 
            (tbdp.VRUNITLIQUIDO) AS VRUNITLIQDETALHEPEDIDO, 
            (tbdp.VRVENDA) AS VRVENDADETALHEPEDIDO, 
            (tbdp.VRTOTAL) AS VRTOTALDETALHEPEDIDO, 
            tbdp.STRECEBIDO, 
            tbdp.STECOMMERCE, 
            tbdp.STREDESOCIAL, 
            tbdp.STCANCELADO, 
            tbdp.STTRANSFORMADO, 
            tbdp.STREPOSICAO, 
            IFNULL(tbdp.NUCODBARRAS, '0') AS NUCODBARRAS, 
            IFNULL(tbdp.VRCUSTOPRODATUAL, 0) AS VRCUSTOPRODATUAL, 
            IFNULL(tbdp.VRVENDAPRODATUAL, 0) AS VRVENDAPRODATUAL, 
            tbdp.OBSPRODUTO, 
            tbdp.IDCATEGORIAS AS CATEGORIAPROD, 
            CPS.DSCATEGORIAS AS DSCATEGORIAPROD, 
            CPS.TPCATEGORIAS AS TPCATEGORIAPROD, 
            CPS.TPCATEGORIAPEDIDO AS TPCATEGORIAPRODPEDIDO, 
            TO_VARCHAR(tbrp.DTPEDIDO, 'DD-MM-YYYY HH24:MI:SS') AS DTPEDIDO, 
            TBP.NUNCM, 
            TBP.IDTIPOPRODUTOFISCAL, 
            TBP.IDFONTEPRODUTOFISCAL, 
            tbdp.NUCODBARRAS, 
            tbdp.IDPRODUTO 
        FROM 
            "${databaseSchema}".DETALHEPEDIDO tbdp 
            INNER JOIN "${databaseSchema}".RESUMOPEDIDO tbrp ON tbdp.IDRESUMOPEDIDO = tbrp.IDRESUMOPEDIDO  
            INNER JOIN "${databaseSchema}".ANDAMENTOS tband ON tbrp.IDANDAMENTO = tband.IDANDAMENTO  
            INNER JOIN "${databaseSchema}".COR CR ON tbdp.IDCOR = CR.IDCOR  
            INNER JOIN "${databaseSchema}".TIPOTECIDOS TBT ON tbdp.IDTIPOTECIDO = TBT.IDTPTECIDO  
            INNER JOIN "${databaseSchema}".CATEGORIAPEDIDO CP ON tbdp.IDCATEGORIAPEDIDO = CP.IDCATEGORIAPEDIDO  
            INNER JOIN "${databaseSchema}".UNIDADEMEDIDA UN ON tbdp.UND = UN.IDUNIDADEMEDIDA  
            INNER JOIN "${databaseSchema}".ESTILOS ES ON tbdp.IDESTILO = ES.IDESTILO  
            INNER JOIN "${databaseSchema}".LOCALEXPOSICAO LE ON tbdp.IDLOCALEXPOSICAO = LE.IDLOCALEXPOSICAO  
            INNER JOIN "${databaseSchema}".SUBGRUPOESTRUTURA SE ON tbdp.IDSUBGRUPOESTRUTURA = SE.IDSUBGRUPOESTRUTURA  
            INNER JOIN "${databaseSchema}".GRUPOESTRUTURA GE ON SE.IDGRUPOESTRUTURA = GE.IDGRUPOESTRUTURA  
            INNER JOIN "${databaseSchema}".FORNECEDOR FR ON tbrp.IDFORNECEDOR = FR.IDFORNECEDOR  
            INNER JOIN "${databaseSchema}".FABRICANTE FB ON tbdp.IDFABRICANTE = FB.IDFABRICANTE  
            INNER JOIN "${databaseSchema}".CATEGORIAS CPS ON tbdp.IDCATEGORIAS = CPS.IDCATEGORIAS  
            LEFT JOIN "${databaseSchema}".PRODUTO TBP ON TBP.NUCODBARRAS = tbdp.NUCODBARRAS 
        WHERE 
            1 = ? 
            AND tbrp.STCANCELADO = 'False' 
            AND tbdp.STCANCELADO = 'False'
    `;

    const params = [1];

    if (idDetalhePedido) {
      query += ` AND tbdp.IDDETALHEPEDIDO = ? `;
      params.push(idDetalhePedido);
    }

    if (idPedido) {
      query += ` AND tbrp.IDRESUMOPEDIDO  = ? `;
      params.push(idPedido);
    }

    if (stTransformado) {
        query += ` AND tbdp.STTRANSFORMADO = ? `;
        params.push(stTransformado);
    }

    if (stReposicao) {
        query += ` AND tbdp.STREPOSICAO = ? `;
        params.push(stReposicao);
    }

    if (dataPesquisaInicio && dataPesquisaFim) {
      query += ` AND (tbrp.DTPEDIDO  BETWEEN ? AND ?) `;
      params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
    }

    query += ` ORDER BY tbdp.NUREF, tbdp.DSPRODUTO `;
    const statement = conn.prepare(query);
    const result = await statement.exec(params);


    return {
        page,
        pageSize,
        rows: result.length,
        data: result,
    };
  } catch (error) {
    console.error("erro ao consultar detalhe pedidos:", error);
    throw error;
  }
};
