import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalheDistribuicao = async (idResumoPedido, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
           SELECT 
                rp.IDRESUMOPEDIDO, rp.IDGRUPOEMPRESARIAL, rp.IDSUBGRUPOEMPRESARIAL, rp.IDEMPRESA, rp.IDCOMPRADOR, rp.IDCONDICAOPAGAMENTO, rp.IDFORNECEDOR,
                rp.IDTRANSPORTADORA, rp.IDANDAMENTO, rp.TPCATEGORIAPEDIDO, rp.MODPEDIDO, rp.TPFORNECEDOR, rp.NOVENDEDOR, rp.EEMAILVENDEDOR,
                rp.DTPEDIDO, rp.DTPREVENTREGA, rp.TPFRETE, rp.NUTOTALITENS, rp.QTDTOTPRODUTOS, rp.VRTOTALBRUTO, rp.DESCPERC01,
                rp.DESCPERC02, rp.DESCPERC03, rp.PERCCOMISSAO, rp.VRTOTALLIQUIDO, rp.OBSPEDIDO, rp.OBSPEDIDO2, rp.DTFECHAMENTOPEDIDO,
                rp.DTCADASTRO, rp.IDRESPCANCELAMENTO, rp.DSMOTIVOCANCELAMENTO, rp.DTCANCELAMENTO, rp.TPARQUIVO, rp.DTRECEBIMENTOPEDIDO, rp.STDISTRIBUIDO,
                rp.STAGRUPAPRODUTO, rp.STCANCELADO, rp.TPFISCAL, rp.VRCOMISSAO,
                dpp.IDDETALHEPRODUTOPEDIDO, dpp.IDDETALHEPEDIDO, dpp.IDGRUPOESTRUTURA, dpp.IDSUBGRUPOESTRUTURA, dpp.IDCOR, dpp.IDTAMANHO, dpp.DSTAMANHO,
                dpp.IDCATEGORIAPEDIDO, dpp.IDTIPOTECIDO, dpp.IDESTILO, dpp.IDFABRICANTE, dpp.IDLOCALEXPOSICAO, dpp.IDCATEGORIAS, dpp.IDNCM,
                dpp.NUNCM, dpp.IDCEST, dpp.NUCEST, dpp.IDTIPOPRODUTOFISCAL, dpp.IDFONTEPRODUTOFISAL, dpp.IDPRODCADASTRO, dpp.NUREF,
                dpp.CODBARRAS, dpp.DSPRODUTO, dpp.QTDPRODUTO, dpp.UND, dpp.VRCUSTO, dpp.VRVENDA, dpp.VRTOTALCUSTO,
                dpp.VRTOTALVENDA, dpp.DTCADASTRO, dpp.DTULTATUALIZACAO, dpp.STCADASTRADO, dpp.STRECEBIDO, dpp.OBSREF, dpp.IDDETALHEENTRADA,
                dpp.NUNF, dpp.QTDENTRADANF, dpp.DTENTRADANF, dpp.STECOMMERCE, dpp.STREDESOCIAL, dpp.STATIVO, dpp.STCANCELADO,
                dpp.QTDESTOQUEIDEAL, dpp.IDRESUMOPEDIDO,
                c.DSCOR, ca.DSCATEGORIAS, tt.DSTIPOTECIDO, e.DSESTILO, f.DSFABRICANTE, sge.DSSUBGRUPOESTRUTURA
            FROM "${databaseSchema}".RESUMOPEDIDO rp
            INNER JOIN "${databaseSchema}".DETALHEPEDIDO dp ON dp.IDRESUMOPEDIDO = rp.IDRESUMOPEDIDO AND dp.STCANCELADO = 'False'
            INNER JOIN "${databaseSchema}".DETALHEPRODUTOPEDIDO dpp ON dpp.IDDETALHEPEDIDO = dp.IDDETALHEPEDIDO AND dpp.STCANCELADO = 'False'
            INNER JOIN "${databaseSchema}".DETALHEPEDIDOGRADE dpg ON dpg.IDDETALHEPEDIDO = dpp.IDDETALHEPEDIDO AND dpg.IDTAMANHO = dpp.IDTAMANHO AND dpg.STATIVO = 'True'
            INNER JOIN "${databaseSchema}".COR c ON c.IDCOR = dpp.IDCOR AND c.STATIVO = 'True'
            INNER JOIN "${databaseSchema}".CATEGORIAS ca ON ca.IDCATEGORIAS = dpp.IDCATEGORIAS AND ca.STATIVO = 'True'
            INNER JOIN "${databaseSchema}".TIPOTECIDOS tt ON tt.IDTPTECIDO = dpp.IDTIPOTECIDO AND tt.STATIVO = 'True'
            INNER JOIN "${databaseSchema}".ESTILOS e ON e.IDESTILO = dpp.IDESTILO AND e.STATIVO = 'True'
            INNER JOIN "${databaseSchema}".FABRICANTE f ON f.IDFABRICANTE = dpp.IDFABRICANTE AND f.STATIVO = 'True'
            INNER JOIN "${databaseSchema}".SUBGRUPOESTRUTURA sge ON sge.IDSUBGRUPOESTRUTURA = dpp.IDSUBGRUPOESTRUTURA AND sge.STATIVO = 'True'
            WHERE 1 = ?
            AND rp.STCANCELADO = 'False'
        
        `;

        const params = [1];

        if (idResumoPedido) {
            query += 'AND rp.IDRESUMOPEDIDO = ? ';
            params.push(idResumoPedido);
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
        console.error('Erro ao consultar Detalhe Distribuicao:', error);
        throw error;
    }
}

