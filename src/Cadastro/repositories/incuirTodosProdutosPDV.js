import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const updateDetalheProdutoPedido = async (dados) => {
    try {
        const query = `
            UPDATE "${databaseSchema}"."DETALHEPRODUTOPEDIDO" SET 
                DETALHEPRODUTOPEDIDO.STCADASTRADO = 'True' 
            FROM "${databaseSchema}"."DETALHEPRODUTOPEDIDO" 
            WHERE DETALHEPRODUTOPEDIDO.IDDETALHEPRODUTOPEDIDO = ?'
        `;

        const statement = await conn.prepare(query);

        for (const dado of dados) {
            const params = [
                dado.IDDETALHEPRODUTOPEDIDO
            ];

            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Produtos Incluídos com sucesso no PDV!',
        };
    } catch (error) {
        throw new Error(`Erro ao atualizar Produto no PDV: ${error.message}`);
    }
};