import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getVinculaNFPedido = async (idPedidoNota, idPedido, idNota, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        var query =  `
            SELECT
                TBVP."IDPEDIDONOTA",
                TBVP."IDRESUMOPEDIDO",
                TBVP."IDRESUMOENTRADA",
                TBRE."DTCADASTRO",
                TBRE."DEMI",
                TBRE."EMIT_XNOME",
                TBRE."SERIE",
                TBRE."NNF",
                TBVP."STATIVO"
            FROM
                "${databaseSchema}"."VINCPEDIDONOTA" TBVP
            INNER JOIN "${databaseSchema}"."RESUMOENTRADANFEPEDIDO" TBRE ON
                TBVP."IDRESUMOENTRADA" = TBRE."IDRESUMOENTRADA"
            WHERE
                TBVP."STATIVO" = 'True'
            AND
                1 = ?
        `;

        const params = [1];

        if (idPedidoNota) {
            query += 'And TBVP.IDPEDIDONOTA = ? ';
            params.push(idPedidoNota);
        }

        if (idPedido) {
            query += 'And TBVP.IDRESUMOPEDIDO = ? ';
            params.push(idPedido);
        }


        if (idNota) {
            query += `And  TBVP.IDRESUMOENTRADA = ? `;
            params.push(idNota);
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
        console.error('Erro ao consulta Vinculo das NFE Pedidos :', error);
        throw error;
    }
}

export const deleteDadosVinculados = async (idResumoEntrada) => {
    try {
        const query = `
            UPDATE "${databaseSchema}"."DETALHEENTRADANFEPEDIDO" SET  
                "STDIVERGENCIA" = '',
                "DSOBSERVACAODIVERGENCIA" = '',
                "QTDDIVERGENCIA" = null
            WHERE "IDRESUMOENTRADA" = ?
        `;

        const statement = await conn.prepare(query);
        await statement.exec([idResumoEntrada]);
        conn.commit();

        return {
            status: 'success',
            message: 'Dados vinculados excluídos com sucesso!',
        };
    } catch (error) {
        throw new Error(`Erro ao excluir dados vinculados: ${error.message}`);
    }
};


export const updateVinculoNFEPedido = async (dados) => {
    try {
        const query = `
            UPDATE "${databaseSchema}"."VINCPEDIDONOTA" SET 
                "STATIVO" = ? 
            WHERE "IDRESUMOPEDIDO" = ? AND "IDRESUMOENTRADA" = ?
        `;

        const statement = await conn.prepare(query);

        for (const dado of dados) {
            const params = [
                dado.STATIVO,
                dado.IDRESUMOPEDIDO,
                dado.IDRESUMOENTRADA,
            ];

            await statement.exec(params);

            if (dado.STATIVO === 'False') {
                await deleteDadosVinculados(dado.IDRESUMOENTRADA);
            }
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Produto conciliado com sucesso!',
        };
    } catch (error) {
        throw new Error(`Erro ao atualizar vínculo NFE Pedido: ${error.message}`);
    }
};