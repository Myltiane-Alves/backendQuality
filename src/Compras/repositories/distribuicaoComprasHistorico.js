import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDistribuicaoHistorico = async (idPedidoCompra, idFornecedor, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT DISTINCT 
                dch.IDPEDIDOCOMPRA, 
                dch.IDEMPRESA,
                (SELECT IFNULL(NOFANTASIA, '') FROM "${databaseSchema}".EMPRESA WHERE IDEMPRESA = dch.IDEMPRESA) AS EMPRESA
            FROM "${databaseSchema}".DISTRIBUICAOCOMPRASHISTORICO dch
            WHERE 1 = ?
        `;

        const params = [1];

        if (idPedidoCompra) {
            query += 'AND dch.IDPEDIDOCOMPRA = ? ';
            params.push(idPedidoCompra);
        }
    
        if(idFornecedor) {
            query += 'AND dch.IDFORNECEDOR = ? ';
            params.push(idFornecedor);
        }

        if(dataPesquisaInicio) {
            query += 'AND dch.DATACRIACAO >= ? ';
            params.push(`${dataPesquisaInicio} 00:00:00`);
        }

        if(dataPesquisaFim) {
            query += 'AND dch.DATACRIACAO <= ? ';
            params.push(`${dataPesquisaFim} 23:59:59`);
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
        console.error('Erro ao consultar  Distribuicao Historico:', error);
        throw error;
    }
}


export const updateDistribuicaoHistorico = async (dados) => {
    try {
        const queryUpdateDistribuicao = `
            UPDATE "${databaseSchema}"."DISTRIBUICAOCOMPRAS"
            SET "DATACRIACAO" = NOW(), "IDUSUARIO" = ?, "STCONCLUIDO" = ?
            WHERE "IDPEDIDOCOMPRA" = ?
        `;

        const queryUpdateHistorico = `
            UPDATE "${databaseSchema}"."DISTRIBUICAOCOMPRASHISTORICO"
            SET "QTDSUGESTAOALTERACAOHISTORICO" = ?, "DATAALTERACAO" = NOW(), "IDUSUARIOALTERACAO" = ?
            WHERE "IDDISTRIBUICAOCOMPRASHISTORICO" = ?
        `;

        const queryInsertHistorico = `
            INSERT INTO "${databaseSchema}"."DISTRIBUICAOCOMPRASHISTORICO" (
                "IDDISTRIBUICAOCOMPRASHISTORICO", "IDPEDIDOCOMPRA", "IDEMPRESA", "IDFILIAL", "IDFORNECEDOR", "IDFABRICANTE",
                "IDSUBGRUPOESTRUTURA", "IDCATEGORIAS", "IDTIPOTECIDO", "IDCOR", "IDESTILO", "IDTAMANHO",
                "CODBARRAS", "DSPRODUTO", "PRECOVENDA", "GRADE", "QTDGRADE", "QTDGRADEHISTORICO",
                "QTDVENDALOJA", "QTDVENDATOTAL", "QTDSUGESTAO", "QTDSUGESTAOALTERACAO", "QTDSUGESTAOALTERACAOHISTORICO",
                "DATACRIACAO", "IDUSUARIO", "DATAALTERACAO", "IDUSUARIOALTERACAO", "STCONCLUIDO", "STCANCELADO"
            ) VALUES (
                SEQ_DISTRIBUICAOCOMPRAS.NEXTVAL, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                NOW(), ?, NOW(), ?, 'False', 'False'
            )
        `;

        for (const registro of dados) {
            const { IDPEDIDOCOMPRA, IDUSUARIO, FINALIZAR, IDDISTRIBUICAOCOMPRASHISTORICO, IDEMPRESA, IDFILIAL, CODBARRAS, QTDSUGESTAOALTERACAOHISTORICO, IDUSUARIOALTERACAO } = registro;

            if (FINALIZAR === 1) {
                // Finalizar pedido
                const statement = await conn.prepare(queryUpdateDistribuicao);
                await statement.exec([IDUSUARIO, 'True', IDPEDIDOCOMPRA]);

                // Chamar procedure
                const querySP = `CALL "${databaseSchema}"."SP_DISTRIBUICAOCOMPRASHISTORICO"(?)`;
                const spStatement = await conn.prepare(querySP);
                await spStatement.exec([IDPEDIDOCOMPRA]);

            } else if (FINALIZAR === 2) {
                // Finalizar histórico
                const statement = await conn.prepare(queryUpdateDistribuicao);
                await statement.exec([IDUSUARIO, 'True', IDPEDIDOCOMPRA]);

            } else {
                if (IDDISTRIBUICAOCOMPRASHISTORICO > 0) {
                    // Atualizar histórico
                    const statement = await conn.prepare(queryUpdateHistorico);
                    await statement.exec([QTDSUGESTAOALTERACAOHISTORICO, IDUSUARIOALTERACAO, IDDISTRIBUICAOCOMPRASHISTORICO]);
                } else {
                    // Inserir novo histórico
                    const querySelect = `
                        SELECT "IDFORNECEDOR", "IDFABRICANTE", "IDSUBGRUPOESTRUTURA", "IDCATEGORIAS", "IDTIPOTECIDO",
                               "IDCOR", "IDESTILO", "IDTAMANHO", "DSPRODUTO", "PRECOVENDA", "GRADE", "QTDGRADE",
                               "QTDGRADEHISTORICO", "QTDVENDALOJA", "QTDVENDATOTAL", "QTDSUGESTAO", "QTDSUGESTAOALTERACAO"
                        FROM "${databaseSchema}"."DISTRIBUICAOCOMPRASHISTORICO"
                        WHERE "STCANCELADO" = 'False' AND "CODBARRAS" = ?
                    `;
                    const [listar] = await conn.exec(querySelect, [CODBARRAS]);

                    if (listar) {
                        const statement = await conn.prepare(queryInsertHistorico);
                        await statement.exec([
                            IDPEDIDOCOMPRA, IDEMPRESA, IDFILIAL, listar.IDFORNECEDOR, listar.IDFABRICANTE,
                            listar.IDSUBGRUPOESTRUTURA, listar.IDCATEGORIAS, listar.IDTIPOTECIDO, listar.IDCOR,
                            listar.IDESTILO, listar.IDTAMANHO, CODBARRAS, listar.DSPRODUTO, listar.PRECOVENDA,
                            listar.GRADE, listar.QTDGRADE, listar.QTDGRADEHISTORICO, listar.QTDVENDALOJA,
                            listar.QTDVENDATOTAL, listar.QTDSUGESTAO, listar.QTDSUGESTAOALTERACAO,
                            QTDSUGESTAOALTERACAOHISTORICO, IDUSUARIOALTERACAO
                        ]);
                    }
                }
            }
        }

        await conn.commit();

        return {
            status: 'success',
            message: 'Operação realizada com sucesso!',
        };
    } catch (error) {
        conn.rollback();
        throw new Error(`Erro ao processar a operação: ${error.message}`);
    }
};


