import conn from "../../../config/dbConnection.js";
const databaseSchema = process.env.HANA_DATABASE;

export const getVendasEstoqueProduto = async (idMarca, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
        
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT
                tbps.NOMEGRUPO,
                tbps.DSNOME,
                tbps.NUCODBARRAS,
                SUM(tbms."QTDSAIDAVENDA") as QTDSAIDAVENDA,
                SUM(tbms."QTDSALDO") as QTDSALDO,
                tbp.PRECOCUSTO,
                tbpp.PRECO_VENDA
            FROM "${databaseSchema}"."MOVIMENTACAOSALDO" tbms
                INNER JOIN "${databaseSchema}"."PRODUTOSAP" tbps on tbms.IDPRODUTO = tbps.IDPRODUTO
                INNER JOIN "${databaseSchema}"."PRODUTO_PRECO" tbpp on tbms.IDPRODUTO = tbpp.IDPRODUTO
                INNER JOIN "${databaseSchema}"."PRODUTO" tbp on tbms.IDPRODUTO = tbp.IDPRODUTO
                INNER JOIN "${databaseSchema}"."EMPRESA" tbe on tbms.IDEMPRESA = tbe.IDEMPRESA
            WHERE 1=1
        `;

        
        const params = [];

        if(dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (tbms.DTMOVIMENTACAO  BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if(idMarca > 0) {
            query += 'AND tbe.IDGRUPOEMPRESARIAL = ?';
            params.push(idMarca);
        }

        if(idFornecedor) {
            query += 'AND tbps.IDPN = ?';
            params.push(idFornecedor);
        }

        if (descProduto) {
            query += ' And  (tbps.DSNOME LIKE \'%'+descProduto+'%\' OR tbps.NUCODBARRAS=\''+descProduto+'\' ) ';
        }
        
        if(idGrupoGrade) {
            query += 'AND tbps.IDGRUPO = ?';
            params.push(idGrupoGrade);
        }

        if(idGrade) {
            query += 'AND tbps.NOMEGRUPO = ?';
            params.push(idGrade);
        }

        query += ' GROUP BY tbps.IDPRODUTO, tbps.DSNOME, tbps.NUCODBARRAS, tbp.PRECOCUSTO, tbpp.PRECO_VENDA, tbps.NOMEGRUPO';
        query += ' ORDER BY tbps.NOMEGRUPO,tbps.IDPRODUTO';

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
        console.error('Erro ao executar a consulta Vendas Estoque Produtos:', error);
        throw error;
    }
};
