import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getVinculoCategoriaTamanhoPedido = async (idVinculoCategoriaPedido, idCategoriaPedido, descricao, idTamanho, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT
                t1.IDCATPEDIDOTAMANHO,
                t2.IDTAMANHO,
                t2.DSTAMANHO,
                t3.IDCATEGORIAPEDIDO,
                t3.DSCATEGORIAPEDIDO,
                t3.TIPOPEDIDO
            FROM "${databaseSchema}"."VINCCATPEDIDOTAMANHO" t1
                INNER JOIN "${databaseSchema}"."TAMANHO" t2 on t1.IDTAMANHO = t2.IDTAMANHO
                INNER JOIN "${databaseSchema}"."CATEGORIAPEDIDO" t3 on t1.IDCATEGORIAPEDIDO = t3.IDCATEGORIAPEDIDO
            WHERE
                1=?
                AND t1.STATIVO = 'True'
        `;

        const params = [1];

        if (idVinculoCategoriaPedido) {
            query += ' AND t1.IDCATPEDIDOTAMANHO = ? ';
            params.push(idVinculoCategoriaPedido);
        }

        if (idCategoriaPedido) {
            query += ' AND t1.IDCATEGORIAPEDIDO = ? ';
            params.push(idCategoriaPedido);
        }
        if (descricao) {
            query += ' And (t3.DSCATEGORIAPEDIDO ? ) ';
            params.push(`%${descricao}%`);
        }
    
        if (idTamanho) {
            query += ' AND t1.IDTAMANHO = ? ';
            params.push(idTamanho);
        }

        const offset = (page - 1) * pageSize;
        params.push(pageSize, offset);
        
        query += `ORDER BY TO_ALPHANUM(t2.DSABREVIACAO) ASC LIMIT ? OFFSET ?`;
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consultar vinculo categoria tamanho pedido:', error);
        throw error;
    }
} 

export const updateVinculoCategoriaTamanhoPedido = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."VINCCATPEDIDOTAMANHO" SET 
                "IDCATEGORIAPEDIDO" = ?, 
                "IDTAMANHO" = ?, 
                "STATIVO" = ? 
            WHERE "IDCATPEDIDOTAMANHO" = ? 
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.IDCATEGORIAPEDIDO,
                registro.IDTAMANHO,
                registro.STATIVO,
                registro.IDCATPEDIDOTAMANHO
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Vinculo Categoria Tamanho Pedido Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Vinculo Categoria Tamanho Pedido: ${e.message}`);s
    }
};


export const createVinculoCategoriaTamanhoPedido = async (dados) => {
    try {

        const queryId = ` 
            SELECT IFNULL(MAX(TO_INT("IDCATPEDIDOTAMANHO")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."VINCCATPEDIDOTAMANHO" WHERE 1 = ? 
        `;

        const queryInsert = `
            INSERT INTO "${databaseSchema}"."VINCCATPEDIDOTAMANHO" 
            ( 
                "IDCATPEDIDOTAMANHO", 
                "IDCATEGORIAPEDIDO", 
                "IDTAMANHO", 
                "STATIVO" 
            ) 
            VALUES(?,?,?,?)
        `;
        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.IDCATEGORIAPEDIDO,
                registro.IDTAMANHO,
                registro.STATIVO
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Criação do Vinculo Categoria Tamanho Pedido Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Vinculo Categoria Tamanho Pedido: ${e.message}`);
    }
};

export const deleteVinculoCategoriaTamanhoPedido = async (idCategoriaPedidoTamanho) => {
    try {
        const query = `
            DELETE FROM "${databaseSchema}".VINCCATPEDIDOTAMANHO WHERE VINCCATPEDIDOTAMANHO.IDCATPEDIDOTAMANHO = ?
        `;

        const statement = await conn.prepare(query);
        await statement.exec([idCategoriaPedidoTamanho]);

        conn.commit();
        return {
            status: 'success',
            message: 'Vinculo Categoria Tamanho Pedido deletado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao deletar Vinculo Categoria Tamanho Pedido: ${e.message}`);
    }
}