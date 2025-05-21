import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getVinculoNFPedidos = async (idPedidoNota, idResumoPedido, idNota, idNotaVinculo, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        var query =  `
            SELECT DISTINCT
                tbrp.IDRESUMOPEDIDO AS IDPEDIDO,
                tbrp.IDGRUPOEMPRESARIAL AS IDGRUPOPEDIDO,
                tbrp.IDSUBGRUPOEMPRESARIAL AS IDSUBGRUPOPEDIDO,
                (SELECT DISTINCT DSFABRICANTE FROM "${databaseSchema}".FABRICANTE LEFT JOIN "${databaseSchema}".DETALHEPEDIDO ON FABRICANTE.IDFABRICANTE=DETALHEPEDIDO.IDFABRICANTE WHERE DETALHEPEDIDO.IDRESUMOPEDIDO=tbrp.IDRESUMOPEDIDO) AS FABRICANTE,
                EMP.DSSUBGRUPOEMPRESARIAL AS NOFANTASIA,
                FC.IDFUNCIONARIO AS IDCOMPRADOR,
                FC.NOFUNCIONARIO AS NOMECOMPRADOR,
                CDP.IDCONDICAOPAGAMENTO,
                CDP.DSCONDICAOPAG,
                FN.IDFORNECEDOR AS IDFORNECEDOR,
                FN.NOFANTASIA AS NOFANTASIAFORNECEDOR,
                FN.NORAZAOSOCIAL AS NOFORNECEDOR,
                FN.NUCNPJ AS CNPJFORN,
                FN.NUINSCESTADUAL AS INSCESTFORN,
                FN.EEMAIL AS EMAILFORN,
                FN.NUTELEFONE1 AS FONEFORN,
                FN.EENDERECO AS ENDFORN,
                FN.ENUMERO AS NUMEROFORN,
                FN.ECOMPLEMENTO AS COMPFORN,
                FN.EBAIRRO AS BAIRROFORN,
                FN.ECIDADE AS CIDADEFORN,
                FN.SGUF AS UFFORN,
                FN.NUCEP AS CEPFORN,
                TP.IDTRANSPORTADORA,
                TP.NOFANTASIA AS NOMETRANSPORTADORA,
                AD.IDANDAMENTO,
                AD.DSANDAMENTO,
                AD.DSSETOR,
                tbrp.MODPEDIDO,
                tbrp.NOVENDEDOR,
                tbrp.EEMAILVENDEDOR,
                tbrp.DTPEDIDO AS DTPEDIDONORMAL,
                tbrp.DTPREVENTREGA,
                TO_VARCHAR(tbrp.DTPREVENTREGA, 'YYYY-MM-DD') AS DTPREVENTREGAFORMATADA,
                TO_VARCHAR(tbrp.DTPREVENTREGA, 'DD-MM-YYYY HH24:MI:SS') AS DTENTREGAFORMATADA2,
                tbrp.TPFRETE,
                tbrp.OBSPEDIDO,
                tbrp.OBSPEDIDO2,
                tbrp.DTFECHAMENTOPEDIDO,
                TO_VARCHAR(tbrp.DTFECHAMENTOPEDIDO, 'YYYY-MM-DD') AS DTFECHAMENTOFORMATADA,
                tbrp.DTCADASTRO,
                tbrp.TPARQUIVO,
                tbrp.STDISTRIBUIDO,
                tbrp.STAGRUPAPRODUTO,
                TO_VARCHAR(tbrp.DTPEDIDO, 'DD-MM-YYYY HH24:MI:SS') AS DTPEDIDO,
                TO_VARCHAR(tbrp.DTPEDIDO, 'YYYY-MM-DD') AS DTPEDIDOFORMATADA,
                IFNULL(tbrp.NUTOTALITENS, 0) AS NUTOTALITENS,
                IFNULL(tbrp.QTDTOTPRODUTOS, 0) AS QTDTOTPRODUTOS,
                IFNULL(tbrp.VRTOTALBRUTO, 0) AS VRTOTALBRUTO,
                IFNULL(tbrp.VRTOTALLIQUIDO, 0) AS VRTOTALLIQUIDO,
                IFNULL(tbrp.DESCPERC01, 0) AS DESCPERC01,
                IFNULL(tbrp.DESCPERC02, 0) AS DESCPERC02,
                IFNULL(tbrp.DESCPERC03, 0) AS DESCPERC03,
                IFNULL(tbrp.PERCCOMISSAO, 0) AS PERCCOMISSAO,
                tbrp.TPFISCAL AS TPFISCAL,
                tbrp.STCANCELADO
            FROM
                "${databaseSchema}".RESUMOPEDIDO tbrp
                INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL EMP ON tbrp.IDSUBGRUPOEMPRESARIAL = EMP.IDSUBGRUPOEMPRESARIAL
                INNER JOIN "${databaseSchema}".ANDAMENTOS AD ON tbrp.IDANDAMENTO = AD.IDANDAMENTO
                LEFT JOIN "${databaseSchema}".FORNECEDOR FN ON tbrp.IDFORNECEDOR = FN.IDFORNECEDOR
                INNER JOIN "${databaseSchema}".FUNCIONARIO FC ON tbrp.IDCOMPRADOR = FC.IDFUNCIONARIO
                LEFT JOIN "${databaseSchema}".TRANSPORTADORA TP ON tbrp.IDTRANSPORTADORA = TP.IDTRANSPORTADORA
                INNER JOIN "${databaseSchema}".CONDICAOPAGAMENTO CDP ON tbrp.IDCONDICAOPAGAMENTO = CDP.IDCONDICAOPAGAMENTO
                INNER JOIN "${databaseSchema}".VINCPEDIDONOTA tbvpn ON tbvpn.IDRESUMOPEDIDO = tbrp.IDRESUMOPEDIDO
            WHERE
                1 = ?`;

        const params = [1];

        if (idPedidoNota) {
            query += 'And tbvpn.IDPEDIDONOTA = ? ';
            params.push(idPedidoNota);
        }

        if (idResumoPedido) {
            query += 'And TBVP.IDRESUMOPEDIDO = ? ';
            params.push(idResumoPedido);
        }

        if (idNota) {
            query += `And TBVPN.IDRESUMOENTRADA = ? AND TBVPN.STATIVO = 'True'`;
            params.push(idNota);
        }

        if (idNotaVinculo) {
            query += `And  tbvpn.IDRESUMOENTRADA != ? And tbvpn.STATIVO = 'True' `;
            params.push(idNotaVinculo);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' And tbrp.DTPEDIDO BETWEEN ? AND ? ';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        query += ' ORDER BY tbrp.IDRESUMOPEDIDO DESC ';

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
        console.error('Erro ao consulta Vinculo das NFE Pedidos :', error);
        throw error;
    }
}