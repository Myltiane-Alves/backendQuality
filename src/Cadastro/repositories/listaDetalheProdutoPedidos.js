import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalheProdutoPedidos = async (idDetalhePedidio, idPedido, dataPesquisaInicio, dataPesquisaFim, stTransformado, stMigradoSap, stCadastro, stReposicao, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                tbrp.IDGRUPOEMPRESARIAL, 
                tbrp.IDSUBGRUPOEMPRESARIAL, 
                tbdp.IDRESUMOPEDIDO, 
                tbdpp.IDPRODCADASTRO, 
                tbdpp.DSPRODUTO, 
                tbdpp.CODBARRAS, 
                tbdpp.NUREF, 
                tbdpp.STMIGRADOSAP, 
                tbdpp.STCADASTRADO, 
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
                FB.IDFABRICANTE, 
                FB.DSFABRICANTE, 
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
                IFNULL(tbdp.VRCUSTOPRODATUAL, 0) AS VRCUSTOPRODATUAL, 
                IFNULL(tbdp.VRVENDAPRODATUAL, 0) AS VRVENDAPRODATUAL, 
                tbdp.OBSPRODUTO, 
                tbdp.IDCATEGORIAS AS CATEGORIAPROD, 
                CPS.DSCATEGORIAS AS DSCATEGORIAPROD, 
                CPS.TPCATEGORIAS AS TPCATEGORIAPROD, 
                CPS.TPCATEGORIAPEDIDO AS TPCATEGORIAPRODPEDIDO, 
                TO_VARCHAR(tbrp.DTPEDIDO, 'DD-MM-YYYY HH24:MI:SS') AS DTPEDIDO 
            FROM 
                "${databaseSchema}".DETALHEPEDIDO tbdp 
                INNER JOIN "${databaseSchema}".RESUMOPEDIDO tbrp ON tbdp.IDRESUMOPEDIDO = tbrp.IDRESUMOPEDIDO  
                INNER JOIN "${databaseSchema}".DETALHEPRODUTOPEDIDO tbdpp ON tbdp.IDDETALHEPEDIDO = tbdpp.IDDETALHEPEDIDO  
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
            WHERE 
                1 = ? 
                AND tbrp.STCANCELADO = 'False' 
                AND tbdp.STCANCELADO = 'False'  
                AND tbdpp.STCANCELADO = 'False'
        `;

        const params = [1];

        if(idDetalhePedidio) {
            query += ' And tbdp.IDDETALHEPEDIDO = ? ';
            params.push(idDetalhePedidio);
        }

        if (idPedido) {
            query += ' And tbdp.IDRESUMOPEDIDO = ? ';
            params.push(idPedido);
        }

        if(stTransformado) {
            query += ' And tbdp.STTRANSFORMADO = ? ';
            params.push(stTransformado);
        }

        if(stMigradoSap) {
            query += ' And tbdpp.STMIGRADOSAP = ? ';
            params.push(stMigradoSap);
        }

        if(stCadastro) {
            query += ' And tbdpp.STCADASTRADO = ? ';
            params.push(stCadastro);
        }

        if(stReposicao) {
            query += ' And tbdp.STREPOSICAO = ? OR tbdpp.IDPRODCADASTRO IS NULL ';
            params.push(stReposicao);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' And (tbrp.DTPEDIDO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consulta Detalhe Produto Pedido :', error);
        throw error;
    }
}