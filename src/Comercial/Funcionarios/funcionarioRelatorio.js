import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getFuncionarioRelatorio = async (idEmpresa, dataPesquisa, page, pageSize) => {
  try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

    let query = `
            SELECT 
            tbf.IDFUNCIONARIO,
            tbf.IDEMPRESA,
            tbf.NOFUNCIONARIO,
            tbf.NOLOGIN,
            tbf.NUCPF,
            tbf.STATIVO,
            tbe.NOFANTASIA
        FROM 
            "${databaseSchema}".FUNCIONARIO tbf
            INNER JOIN "${databaseSchema}".EMPRESA tbe ON tbf.IDEMPRESA = tbe.IDEMPRESA
        WHERE 
            1 = ?
            AND tbf.STATIVO = 'True'
    `;

    const params = [1];

    if(idEmpresa) {
      query += `AND tbf.IDEMPRESA = ?`;
      params.push(idEmpresa);
    }

    const statement = conn.prepare(query);
    const result = await statement.exec(params);
 
    return {
      page,
      pageSize,
      rows: result.length,
      data: result,
    };
  } catch (error) {
    console.error('Erro ao executar a consulta Funcionarios Relatórios:', error);
    throw error;
  }
};
