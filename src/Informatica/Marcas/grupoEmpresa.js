import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getGrupoEmpresa = async () => {
  try {
    const query = `
      SELECT 
        DISTINCT (e2.IDGRUPOEMPRESARIAL) AS IDGRUPOEMPRESARIAL, 
        CASE 
          WHEN e2.IDGRUPOEMPRESARIAL = 1 THEN 'TO - TESOURA' 
          WHEN e2.IDGRUPOEMPRESARIAL = 2 THEN 'MG - MAGAZINE' 
          WHEN e2.IDGRUPOEMPRESARIAL = 3 THEN 'YO - YORUS' 
          WHEN e2.IDGRUPOEMPRESARIAL = 4 THEN 'FC - FREE CENTER' 
        END AS GRUPOEMPRESARIAL 
      FROM 
        "${databaseSchema}".EMPRESA e2 
      WHERE 
        1 = 1
    `;

    const statement = conn.prepare(query);
    const result = statement.exec();

    return {data: result};

  } catch (error) {
    console.error('Erro ao executar a consulta getGrupoEmpresa', error);
    throw error;
  }
};
