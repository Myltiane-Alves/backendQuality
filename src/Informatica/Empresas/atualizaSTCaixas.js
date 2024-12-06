import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const updateAtualizaStatusCaixa = async (empresas) => {
    try {


        var query = `
            UPDATE "${databaseSchema}"."CAIXA" SET 
            "STATUALIZA" = ?, 
            "STLIMPA" = ? 
            WHERE "IDCAIXAWEB" = ? 
        `;

        const statement = await conn.prepare(query);

        for (const registro of empresas) {
            for (const pontoAtualizar of registro.STATUALIZA) {
                let stAtualiza = 'False';
                let stLimpar = 'False';
                let id = '';

                if (pontoAtualizar.includes('A')) {
                    stAtualiza = 'True';
                    id = pontoAtualizar.replace('A', '');
                }

                if (pontoAtualizar.includes('L')) {
                    stLimpar = 'True';
                    id = pontoAtualizar.replace('L', '');
                }

                id = parseInt(id);


                await statement.exec([stAtualiza, stLimpar, id]);
            }
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Empresa atualizadas com sucesso'
        }
    } catch (error) {
        console.error('Erro ao executar a atualização da empresa:', error);
        throw error;
    }
}