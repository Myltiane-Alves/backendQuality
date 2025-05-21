import conn from '../../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const updateFatura = async (detalhes) => {
    try {
        

        const query = `
            UPDATE "${databaseSchema}"."DETALHEFATURA" SET 
            "NUCODAUTORIZACAO" = ?, 
            "VRRECEBIDO" = ?, 
            "STCANCELADO" = ?, 
            "STPIX" = ?, 
            "NUAUTORIZACAO" = ? 
            WHERE "IDDETALHEFATURA" = ? 
        `;

        const statement = await conn.prepare(query);

        for (const registro of detalhes) {
            
            await statement.exec([
                registro.NUCODAUTORIZACAO,
                registro.VRRECEBIDO,
                registro.STCANCELADO,
                registro.STPIX,
                registro.NUAUTORIZACAO,
                registro.IDDETALHEFATURA
            ]);

        }

        conn.commit();
    
        return {
            status: 'success',
            msg: 'Atualização Fatura realizada com sucesso!',
            data: detalhes
        }
      
    } catch (error) {
        console.error("um erro ao atualizar fatura :", error);
        res.status(500).json({ error: error.message });
    }
};