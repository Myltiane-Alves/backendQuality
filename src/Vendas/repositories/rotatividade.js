import conn from "../../config/dbConnection.js";
const databaseSchema = process.env.HANA_DATABASE;

export const getRotatividade = async (idMovimentacao, idMarca,idEmpresa, uf, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
        
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        var query = `
            SELECT distinct
                tbe.NOFANTASIA,
                tbps.PN,
                tbms.IDPRODUTO,
                tbps.GRUPOPRODUTO,
                tbps.NOMEGRUPO,
                tbps.NUCODBARRAS,
                tbps.DSNOME,
                tbms.DTMOVIMENTACAO,
                tbms.QTDINICIAL,
                tbms.QTDENTRADATRANSAFERENCIA,
                tbms.QTDENTRADADEVOLUCAO,
                tbms.QTDSAIDAVENDA,
                tbms.QTDSAIDATRANSFERENCIA,
                tbms.QTDSALDO
            FROM
                "${databaseSchema}"."MOVIMENTACAOSALDO" tbms
                INNER JOIN "${databaseSchema}"."EMPRESA" tbe on tbms.IDEMPRESA = tbe.IDEMPRESA
                INNER JOIN "${databaseSchema}"."PRODUTOSAP" tbps on tbms.IDPRODUTO = tbps.IDPRODUTO
            WHERE
                1 = ?
        `;
        
        const params = [1];

        if(idMovimentacao) {
            query += ' AND tbms.IDMOVIMENTACAO = ?';
            params.push(idMovimentacao);
        }
        
        if(idMarca > 0) {
            query += 'AND tbe.IDSUBGRUPOEMPRESARIAL = ?';
            params.push(idMarca);
        }

        if(uf) {
            query += 'AND tbe.SGUF = ?';
            params.push(uf);
        }
        
        if (idEmpresa) {
            query += 'AND tbms.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if(idFornecedor) {
            query += 'AND tbps.IDPN = ?';
            params.push(idFornecedor);
        }

        if(idGrupoGrade) {
            query += 'AND tbps.IDGRUPO = ?';
            params.push(idGrupoGrade);
        }

        if(idGrade) {
            query += 'AND tbps.NOMEGRUPO = ?';
            params.push(idGrade);
        }

        if (descProduto) {
            query += ' And  (tbps.DSNOME LIKE \'%'+descProduto+'%\' OR tbps.NUCODBARRAS=\''+descProduto+'\' ) ';
        }

        if(dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND tbms.DTMOVIMENTACAO >= ? AND tbms.DTMOVIMENTACAO <= ?';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        query += 'GROUP BY tbms.DTMOVIMENTACAO, tbms.IDPRODUTO, tbe.NOFANTASIA, tbps.PN, tbps.GRUPOPRODUTO, tbps.NOMEGRUPO, tbps.NUCODBARRAS, tbps.DSNOME, tbms.QTDINICIAL, tbms.QTDENTRADATRANSAFERENCIA, tbms.QTDENTRADADEVOLUCAO, tbms.QTDSAIDAVENDA, tbms.QTDSAIDATRANSFERENCIA, tbms.QTDSALDO';

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
        console.error('Erro ao executar a consulta Rotatividade:', error);
        throw error;
    }
};
