import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getMarcas = async (idMarca,) => {
    try {
   
        let query = 
        `SELECT 
            tbg.IDGRUPOEMPRESARIAL,
            tbg.DSGRUPOEMPRESARIAL,
            tbg.STATIVO
        FROM 
            "${databaseSchema}".GRUPOEMPRESARIAL tbg
        WHERE 
            1 = ?
        AND tbg.STATIVO='True'`;

    const params = [1];

    if (idMarca > 0) {
        query += ' AND tbg.IDGRUPOEMPRESARIAL = ?';
        params.push(idMarca);
    }

    const statement = conn.prepare(query);
    const result = statement.exec(params);

    return result;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};
