import conn from '../../../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const putDetalheFaturaLoja = async (detalhes) => {
    try {
        const query = `UPDATE "${databaseSchema}"."DETALHEFATURA" SET 
            "STCANCELADO" = ?, 
            "IDUSRCACELAMENTO" = ?, 
            "TXTMOTIVOCANCELAMENTO" = ? 
            WHERE "IDDETALHEFATURA" = ?
        `;

        const statement = await conn.prepare(query);

        for (const registro of detalhes) {

            await statement.exec([
                registro.STCANCELADO,
                registro.IDUSRCACELAMENTO,
                registro.TXTMOTIVOCANCELAMENTO,
                registro.IDDETALHEFATURA
            ]);
        }

        conn.commit();

        return {
            status: 'success',
            msg: 'Atualização realizada com sucesso!'
        
        }
      
    } catch (error) {
        console.error("Erro ao Atualizar o detalhe da fatura:", error);
    }
};

