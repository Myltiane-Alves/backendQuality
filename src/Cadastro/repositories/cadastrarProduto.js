import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const updateDetalheProdutoPedido = async (dados) => {
    try {
        const query = `
            UPDATE "${databaseSchema}"."RESUMOPEDIDO" 
            SET 
                IDANDAMENTO = 5
            WHERE 
                IDRESUMOPEDIDO =  ?
        `;

        const statement = await conn.prepare(query);

        for (const dado of dados) {
            const params = [
                dado.IDRESUMOPEDIDO
            ];

            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização Detalhe do Pedido realizada com sucesso!',
        };
    } catch (error) {
        throw new Error(`Erro ao atualização Detalhe do Pedido: ${error.message}`);
    }
};


export const updateProdutoPedido = async (dados) => {
    try {
        const queryInsertProduto = `
            INSERT INTO "${databaseSchema}"."PRODUTO" 
            (
                "IDPRODUTO", 
                "IDGRUPOEMPRESARIAL", 
                "NUNCM", 
                "NUCEST", 
                "NUCST_ICMS", 
                "NUCFOP", 
                "PERC_OUT", 
                "NUCODBARRAS", 
                "DSNOME", 
                "STGRADE", 
                "UND", 
                "PRECOCUSTO", 
                "PRECOVENDA", 
                "QTDENTRADA", 
                "QTDCOMERCIALIZADA", 
                "QTDPERDA", 
                "QTDDISPONIVEL", 
                "PERCICMS", 
                "PERCISS", 
                "PERCPIS", 
                "PERCCOFINS", 
                "COD_CSOSN", 
                "PERCCSOSC", 
                "NUCST_IPI", 
                "NUCST_PIS", 
                "NUCST_COFINS", 
                "PERCIPI", 
                "STPESAVEL", 
                "GRP_MATERIAIS", 
                "IDSUBGRUPO", 
                "IDFABRICANTE", 
                "IDFORNECEDOR", 
                "NUREFERENCIA", 
                "STATIVO", 
                "IDCOR", 
                "IDTAMANHO", 
                "IDCATEGORIAPEDIDO", 
                "IDTIPOTECIDO", 
                "IDESTILO", 
                "IDLOCALEXPOSICAO", 
                "IDCATEGORIAS", 
                "IDDETALHEPRODUTOPEDIDO", 
                "IDTIPOPRODUTOFISCAL", 
                "IDFONTEPRODUTOFISCAL",
                "DTULTALTERACAO" 
            )
            SELECT
                "${databaseSchema}".SEQ_PRODUTOPEDIDO.NEXTVAL AS IDPRODUTO,
                tbrp.IDGRUPOEMPRESARIAL As IDGRUPOEMPRESARIAL,
                detprodped.NUNCM As NUNCM,
                '' As NUCEST,
                '' As NUCST_ICMS,
                '' As NUCFOP,
                '' As PERC_OUT,
                detprodped.CODBARRAS As NUCODBARRAS,
                detprodped.DSPRODUTO As DSNOME,
                1 As STGRADE,
                detprodped.UND As UND,
                detprodped.VRCUSTO As PRECOCUSTO,
                detprodped.VRVENDA As PRECOVENDA,
                0 As QTDENTRADA,
                0 As QTDCOMERCIALIZADA,	
                0 As QTDPERDA,
                0 As QTDDISPONIVEL,
                0.0 As PERCICMS,
                0.0 As PERCISS,
                0.0 As PERCPIS,
                0.0 As PERCCOFINS,
                '' As COD_CSOSN,
                0.0 As PERCCSOSC,
                '' As NUCST_IPI,
                '' As NUCST_PIS,
                '' As NUCST_COFINS,
                0.0 As PERCIPI,
                0 As STPESAVEL,
                1 As GRP_MATERIAIS,
                detprodped.IDSUBGRUPOESTRUTURA As IDSUBGRUPO,
                detprodped.IDFABRICANTE As IDFABRICANTE,
                tbrp.IDFORNECEDOR As IDFORNECEDOR,
                detprodped.NUREF As NUREFERENCIA,
                'True' As STATIVO,
                detprodped.IDCOR As IDCOR,
                detprodped.IDTAMANHO As IDTAMANHO,
                detprodped.IDCATEGORIAPEDIDO As IDCATEGORIAPEDIDO,
                detprodped.IDTIPOTECIDO As IDTIPOTECIDO,
                detprodped.IDESTILO As IDESTILO,
                detprodped.IDLOCALEXPOSICAO As IDLOCALEXPOSICAO,
                detprodped.IDCATEGORIAS As IDCATEGORIAS,
                detprodped.IDDETALHEPRODUTOPEDIDO As IDDETALHEPRODUTOPEDIDO,
                detprodped.IDTIPOPRODUTOFISCAL As IDTIPOPRODUTOFISCAL,
                detprodped.IDFONTEPRODUTOFISAL As IDFONTEPRODUTOFISCAL,
                CURRENT_TIMESTAMP  As DTULTALTERACAO
            FROM 
                "${databaseSchema}".DETALHEPRODUTOPEDIDO AS detprodped 
            INNER JOIN "${databaseSchema}".DETALHEPEDIDO AS tbdp ON 
                detprodped.IDDETALHEPEDIDO = tbdp.IDDETALHEPEDIDO 
            INNER JOIN "${databaseSchema}".RESUMOPEDIDO AS tbrp ON 
                tbdp.IDRESUMOPEDIDO = tbrp.IDRESUMOPEDIDO
            WHERE
                detprodped.STCANCELADO ='False' 
                AND detprodped.STCADASTRADO <> 'True' 
                AND detprodped.STREPOSICAO <> 'True'
                AND tbdp.IDRESUMOPEDIDO = ?
        `;

        const statementInsertProduto = await conn.prepare(queryInsertProduto);
       
       for (const dado of dados) {
            const params = [dado.IDRESUMOPEDIDO];
            await statementInsertProduto.exec(params);

        }
        
        conn.commit();
        await updateDetalheProdutoPedido(IDRESUMOPEDIDO);
        return {
            status: 'success',
            message: 'Atualização Detalhe do Pedido realizada com sucesso!',
        }
    } catch (error) {
        throw new Error(`Erro ao Atualizar detalhe do pedido: ${error.message}`);
    }
};