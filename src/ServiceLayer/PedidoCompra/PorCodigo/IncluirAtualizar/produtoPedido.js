import conn from "../../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
import axios from 'axios';

// Função para fazer uma requisição POST no Service Layer
async function postSl(url, data, sessionId) {
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Cookie': `B1SESSION=${sessionId}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Erro na requisição POST: ${error.message}`);
    }
}

// Função para fazer uma requisição PATCH no Service Layer
async function patchSl(url, data, sessionId) {
    try {
        const response = await axios.patch(url, data, {
            headers: {
                'Cookie': `B1SESSION=${sessionId}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Erro na requisição PATCH: ${error.message}`);
    }
}

export const updateMigracaoFornecedor = async (dados) => {
    try {
        const query = `
            UPDATE "${databaseSchema}"."DETALHEPRODUTOPEDIDO" SET
                STMIGRADOSAP = 'True',
                STVINCPRODPEDSAP = 'True'
            WHERE IDPRODCADASTRO = ?
        `;

        const statement = await conn.prepare(query);

        for (const dado of dados) {
            const params = [
                dado.IDPRODCADASTRO
            ];

            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização Migração Fornecedor realizada com sucesso!',
        };
    } catch (error) {
        throw new Error(`Erro ao atualização Migração Fornecedor: ${error.message}`);
    }
};

export const createMigracaoFornecedor = async (codPedido) => {
    try {
        var query = `
            SELECT "IDDETALHEPRODUTOPEDIDO",
                T1."IDDETALHEPEDIDO",
                T1."IDGRUPOESTRUTURA",
                T1."IDSUBGRUPOESTRUTURA",
                T1."IDCOR",
                T1."IDTAMANHO",
                CASE T1."DSTAMANHO" WHEN 'Diversos' THEN 'tNO' ELSE 'tYES' END AS DSTAMANHO,
                T1."IDCATEGORIAPEDIDO",
                T1."IDTIPOTECIDO",
                T1."IDESTILO",
                T1."IDFABRICANTE",
                T1."IDLOCALEXPOSICAO",
                T1."IDCATEGORIAS",
                T1."IDNCM",
                T1."NUNCM",
                T1."IDCEST",
                T1."NUCEST",
                T1."IDTIPOPRODUTOFISCAL",
                T1."IDFONTEPRODUTOFISAL",
                T1."IDPRODCADASTRO",
                T1."NUREF",
                T1."CODBARRAS",
                T1."DSPRODUTO",
                T1."QTDPRODUTO",
                T1."UND",
                T1."VRCUSTO",
                T1."VRVENDA",
                T1."VRTOTALCUSTO",
                T1."VRTOTALVENDA",
                T1."DTCADASTRO",
                T1."DTULTATUALIZACAO",
                T1."STCADASTRADO",
                T1."STRECEBIDO",
                T1."OBSREF",
                T1."IDDETALHEENTRADA",
                T1."NUNF",
                T1."QTDENTRADANF",
                T1."DTENTRADANF",
                T1."STECOMMERCE",
                T1."STREDESOCIAL",
                T1."STATIVO",
                T1."STCANCELADO",
                T1."QTDESTOQUEIDEAL",
                T1."IDRESUMOPEDIDO",
                T3."IDFORNECEDOR",
                T4."IDFORNECEDORSAP",
                T5."IDSAP",
                T6."CODTIPOFISCALPRODUTO",
                CASE T2."TIPOPEDIDO" WHEN 'VESTUARIO' THEN 1 ELSE 8 END AS TIPOPEDIDO
            FROM "${databaseSchema}"."DETALHEPRODUTOPEDIDO" T1
            INNER JOIN "${databaseSchema}"."CATEGORIAPEDIDO" T2 ON T2.IDCATEGORIAPEDIDO = T1.IDCATEGORIAPEDIDO
            INNER JOIN "${databaseSchema}"."RESUMOPEDIDO" T3 ON T3.IDRESUMOPEDIDO = T1.IDRESUMOPEDIDO
            INNER JOIN "${databaseSchema}"."FORNECEDOR" T4 ON T4.IDFORNECEDOR = T3.IDFORNECEDOR
            INNER JOIN "${databaseSchema}"."FABRICANTE" T5 ON T5.IDFABRICANTE = T1.IDFABRICANTE
            INNER JOIN "${databaseSchema}"."TIPOFISCALPRODUTO" T6 ON T6.IDTIPOFISCALPRODUTO = T1.IDFONTEPRODUTOFISAL
            WHERE 1=? AND
                (T1.STMIGRADOSAP != 'True') AND (T1.STREPOSICAO != 'True') AND T1."IDDETALHEPRODUTOPEDIDO" = ${parseInt(codProdPedido)}
        `;

        const params = [1];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);

        let sessionId = '';

        for (let i = 0; i < rows.length; i++) {
            const det = rows[i];

            const retNcm = await conn.exec(`SELECT TOP 1 "AbsEntry" AS NCM FROM "SBO_GTO_PRD".ONCM WHERE REPLACE("NcmCode", '.', '') = '${det.NUNCM}' ORDER BY "AbsEntry" DESC`);

            const Str_Json = {
                "ItemCode": det.IDPRODCADASTRO,
                "ItemName": det.DSPRODUTO,
                "VatLiable": "tYES",
                "PurchaseItem": "tYES",
                "SalesItem": "tYES",
                "InventoryItem": det.DSTAMANHO,
                "Valid": "tYES",
                "SalesUnit": det.UND,
                "PurchaseUnit": det.UND,
                "InventoryUOM": det.UND,
                "ItemType": "itItems",
                "ItemClass": "itcMaterial",
                "NCMCode": retNcm[0].NCM,
                "MaterialType": "mt_GoodsForReseller",
                "MaterialGroup": det.TIPOPEDIDO,
                "ProductSource": det.CODTIPOFISCALPRODUTO,
                "Manufacturer": det.IDSAP,
                "ItemsGroupCode": det.IDSUBGRUPOESTRUTURA,
                "Mainsupplier": det.IDFORNECEDORSAP,
                "U_IS_EAN_GTO": det.CODBARRAS,
                "BarCode": det.CODBARRAS,
                "Series": 3,
                "ItemPrices": [
                    {
                        "PriceList": 1,
                        "Price": det.VRVENDA,
                        "Currency": "R$",
                        "BasePriceList": 1,
                        "Factor": 1.0
                    },
                    {
                        "PriceList": 3,
                        "Price": det.VRCUSTO,
                        "Currency": "R$",
                        "BasePriceList": 3,
                        "Factor": 1.0
                    },
                    {
                        "PriceList": 125,
                        "Price": det.VRVENDA,
                        "Currency": "R$",
                        "BasePriceList": 125,
                        "Factor": 1.0
                    },
                    {
                        "PriceList": 121,
                        "Price": det.VRVENDA,
                        "Currency": "R$",
                        "BasePriceList": 121,
                        "Factor": 1.0
                    },
                    {
                        "PriceList": 122,
                        "Price": det.VRVENDA,
                        "Currency": "R$",
                        "BasePriceList": 122,
                        "Factor": 1.0
                    }
                ]
            };

            if (i === 0) {
                sessionId = await loginServiceLayer(true);
            }
        }

        return 'Migração Produtos realizada com sucesso!';
    } catch (error) {
        throw new Error(`Erro ao realizar migração de produtos: ${error.message}`);
    }
};



