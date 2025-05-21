    import conn from "../../../config/dbConnection.js";
    import 'dotenv/config';
    const databaseSchema = process.env.HANA_DATABASE;
    const databaseSchemaSBO = process.env.HANA_DATABASE_SBO;

    export const getPedidoCompra = async (idResumoPedido, page, pageSize) => {
        try {
            
            page = page && !isNaN(page) ? parseInt(page) : 1;
            pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

            let query = `
                SELECT T1."IDRESUMOPEDIDO",
                T1."IDGRUPOEMPRESARIAL",
                T1."IDSUBGRUPOEMPRESARIAL",
                T1."IDEMPRESA",
                T1."IDCOMPRADOR",
                T1."IDCONDICAOPAGAMENTO",
                T1."IDFORNECEDOR",
                T1."IDTRANSPORTADORA",
                T1."IDANDAMENTO",
                T1."TPCATEGORIAPEDIDO",
                CASE T1."MODPEDIDO" WHEN 'VESTUARIO' THEN 1 WHEN 'CALCADOS' THEN 2 WHEN 'ARTIGOS' THEN 3 END AS MODPEDIDO,
                T1."TPFORNECEDOR",
                T1."NOVENDEDOR",
                T1."EEMAILVENDEDOR",
                TO_VARCHAR(T1.DTPEDIDO,'YYYY-mm-DD') AS DTPEDIDO,
                TO_VARCHAR(T1.DTPREVENTREGA,'YYYY-mm-DD') AS DTPREVENTREGA,
                CASE T1."TPFRETE" WHEN 'PAGO' THEN 0 WHEN 'APAGAR' THEN 1 END AS TPFRETE,
                T1."NUTOTALITENS",
                T1."QTDTOTPRODUTOS",
                T1."VRTOTALBRUTO",
                T1."DESCPERC01",
                T1."DESCPERC02",
                T1."DESCPERC03",
                T1."PERCCOMISSAO",
                T1."VRTOTALLIQUIDO",
                T1."OBSPEDIDO",
                T1."OBSPEDIDO2",
                T1."DTFECHAMENTOPEDIDO",
                TO_VARCHAR(T1.DTCADASTRO,'YYYY-mm-DD') AS DTCADASTRO,
                T1."IDRESPCANCELAMENTO",
                T1."DSMOTIVOCANCELAMENTO",
                TO_VARCHAR(T1.DTCANCELAMENTO,'YYYY-mm-DD') AS DTCANCELAMENTO,
                T1."TPARQUIVO",
                TO_VARCHAR(T1.DTRECEBIMENTOPEDIDO,'YYYY-mm-DD') AS DTRECEBIMENTOPEDIDO,
                T1."STDISTRIBUIDO",
                T1."STAGRUPAPRODUTO",
                T1."STCANCELADO",
                T1."TPFISCAL",
                T1."VRCOMISSAO",
                T2."IDFORNECEDORSAP",
                T3."IDSAP",
                T4."IDSAP" AS IDSAPTPDOCUMENTO
                FROM "${databaseSchema}"."RESUMOPEDIDO" T1
                INNER JOIN "${databaseSchema}"."FORNECEDOR" T2 ON T2.IDFORNECEDOR = T1.IDFORNECEDOR
                INNER JOIN "${databaseSchema}"."CONDICAOPAGAMENTO" T3 ON T3.IDCONDICAOPAGAMENTO = T1.IDCONDICAOPAGAMENTO
                INNER JOIN "${databaseSchema}"."TIPODOCUMENTO" T4 ON T4.IDTPDOCUMENTO = T3.IDTPDOCUMENTO
                WHERE 1 = ? AND 
                (T1.STMIGRADOSAP IS NULL OR T1.STMIGRADOSAP = 'False') AND T1.IDANDAMENTO = 5
                AND T1."IDRESUMOPEDIDO" = ${parseInt(idResumoPedido)}
            `;

            const params = [1];      


            query += 'ORDER BY a."Code" DESC';

            const offset = (page - 1) * pageSize;
            query += ' LIMIT ? OFFSET ?';
            params.push(pageSize, offset);

            const statement = await conn.prepare(query);
            const rows = await statement.exec(params);
            
            
            return {
                page,
                pageSize,
                rows: rows.length,
                data: rows,
            };
        } catch (error) {
            console.error('Erro ao executar a consulta fornecedor sap:', error);
            throw error;
        }
    };

    export const updateMigracaoPedidoCompra = async (dados) => {
        try {
            const query = `
                UPDATE "${databaseSchema}"."RESUMOPEDIDO" SET
                    STMIGRADOSAP = 'True',
                WHERE IDRESUMOPEDIDO = ?
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
                message: 'Atualização Migração Peido Compras SAP realizada com sucesso!',
            };
        } catch (error) {
            throw new Error(`Erro ao atualização Migração Pedido Compras SAP: ${error.message}`);
        }
    };
