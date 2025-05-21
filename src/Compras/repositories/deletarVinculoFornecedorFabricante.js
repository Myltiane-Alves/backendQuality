import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const deletarVinculoFabricanteFornecedor = async (dados) => {
    try {
        const queryUpdate = `
            DELETE FROM "${databaseSchema}".VINCFABRICANTEFORN 
                WHERE VINCFABRICANTEFORN.IDFABRICANTEFORN = ?;
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.IDFABRICANTEFORN
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Vínculo Fabricante Fornecedor deletado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao deletar Vínculo Fabricante Fornecedor: ${e.message}`);
    }
};