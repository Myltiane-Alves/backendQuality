import conn from "../../../config/dbConnection.js";
const databaseSchema = process.env.HANA_DATABASE;

export const getVendasProdutoConsolidado = async (idMarca,idEmpresa, uf, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
        
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                TO_VARCHAR(TBV.DTHORAFECHAMENTO, 'DD-MM-YYYY') AS DataEmissao,
                ROUND(SUM("QCOM")) as QTD,
                ROUND(("VUNCOM"), 2) as ValorUnitProd,
                ROUND(SUM("VDESC"), 2) as ValorDesconto,
                ROUND(SUM("VPROD"), 2) as ValorProd,
                ROUND(SUM("ICMS_VBC"), 2) AS ValorNF,
                "CPROD" as CodProduto,
                "XPROD" as Descricao,
                "NCM" as NCM
            FROM "${databaseSchema}"."VENDADETALHE" TBVD
            INNER JOIN "${databaseSchema}"."VENDA" TBV on TBVD.IDVENDA = TBV.IDVENDA
            LEFT JOIN "${databaseSchema}"."PRODUTOSAP" tbps on TBVD.CPROD = tbps.IDPRODUTO
            INNER JOIN "${databaseSchema}"."EMPRESA" TBE on TBV.IDEMPRESA = TBE.IDEMPRESA
            WHERE 1 = ? AND TBV.STCANCELADO = 'False' AND TBV.STCONTINGENCIA = 'False'
        `;

        
        const params = [1];

        if(dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND TBV.DTHORAFECHAMENTO BETWEEN ? AND ?';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if(idMarca) {
            query += 'AND TBE.IDGRUPOEMPRESARIAL = ?';
            params.push(idMarca);
        }

        if (idEmpresa) {
            query += 'AND TBE.IDEMPRESA  = ?';
            params.push(idEmpresa);
        }

        if(uf) {
            query += 'AND TBE.SGUF = ?';
            params.push(uf);
        }

        if(idFornecedor) {
            query += 'AND tbps.IDPN = ?';
            params.push(idFornecedor);
        }

        if (descProduto) {
            query += ' And  (TBVD.XPROD LIKE \'%'+descProduto+'%\' OR tbps.NUCODBARRAS=\''+descProduto+'\' ) ';
        }
        
        if(idGrupoGrade) {
            query += 'AND tbps.IDGRUPO = ?';
            params.push(idGrupoGrade);
        }

        if(idGrade) {
            query += 'AND tbps.NOMEGRUPO = ?';
            params.push(idGrade);
        }

        query += ' GROUP BY CPROD, XPROD,NCM,VUNCOM,TO_VARCHAR(TBV.DTHORAFECHAMENTO,\'DD-MM-YYYY\')';
        query += ' order by  XPROD';

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
        };
    } catch (error) {
        console.error('Erro ao executar a consulta Vendas Produtos Consolidado:', error);
        throw error;
    }
};
