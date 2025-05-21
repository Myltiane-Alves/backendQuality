import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getCategoriasPedidos = async (idCategoriaPedido, descricao, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                tbcp.IDCATEGORIAPEDIDO,
                tbcp.DSCATEGORIAPEDIDO,
                tbcp.TIPOPEDIDO,
                tbcp.STATIVO
            FROM 
                "${databaseSchema}".CATEGORIAPEDIDO tbcp
            WHERE 
                1 = ?
                AND tbcp.STATIVO='True'
        `;

        const params = [1];

        if (idCategoriaPedido) {
            query += ' And  tbcp.IDCATEGORIAPEDIDO = ? ';
            params.push(idCategoriaPedido);
        }
    
        if(descricao) {
            query += ' And  (tbcp.DSCATEGORIAPEDIDO LIKE ? OR tbcp.DSCATEGORIAPEDIDO LIKE ?) ';
            params.push(`%${descricao}%`, `%${descricao}%`);
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
        console.error('Erro ao consultar Categorias Pedidos:', error);
        throw error;
    }
}

export const updateCategoriasPedidos = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."CATEGORIAPEDIDO" SET 
                "DSCATEGORIAPEDIDO" = ?, 
                "TIPOPEDIDO" = ?, 
                "STATIVO" = ? 
            WHERE "IDCATEGORIAPEDIDO" = ? 
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.DSCATEGORIAPEDIDO,
                registro.TIPOPEDIDO,
                registro.STATIVO,
                registro.IDCATEGORIAPEDIDO
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização das Categorias dos Pedidos realizada com sucesso!',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Categorias dos Pedidos: ${e.message}`);
    }
};

export const createCategoriasPedidos = async (dados) => {
    try {
       
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDCATEGORIAPEDIDO")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."CATEGORIAPEDIDO" WHERE 1 = ?
        `;


        const queryInsert = `
            INSERT INTO "${databaseSchema}"."CATEGORIAPEDIDO" 
            (
                "IDCATEGORIAPEDIDO", 
                "DSCATEGORIAPEDIDO", 
                "TIPOPEDIDO", 
                "STATIVO"
            ) 
            VALUES (?, ?, ?, ?)
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.DSCATEGORIAPEDIDO,
                registro.TIPOPEDIDO,
                registro.STATIVO
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Categorias dos Pedidos criadas com sucesso!',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Categorias dos Pedidos: ${e.message}`);
    }
};
