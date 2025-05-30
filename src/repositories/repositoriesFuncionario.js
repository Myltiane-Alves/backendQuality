import conn from "../config/dbConnection.js"
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const handleGetFuncionarios = async () => {
  try {
    const sql = `
      SELECT 
        tbf.ID,
        tbf.IDFUNCIONARIO,
        tbf.IDGRUPOEMPRESARIAL,
        tbf.IDSUBGRUPOEMPRESARIAL,
        IFNULL(tbf.IDEMPRESA, 1) AS IDEMPRESA,
        tbf.NOFUNCIONARIO,
        tbf.IDPERFIL,
        tbf.NUCPF,
        tbf.NOLOGIN,
        tbf.PWSENHA,
        tbf.DSFUNCAO,
        IFNULL(TO_VARCHAR(tbf.DATAULTIMAALTERACAO, 'YYYY-MM-DD HH:MM:SS'), TO_VARCHAR(NOW(), 'YYYY-MM-DD HH:MM:SS')) AS DTULTALTERACAO,
        tbf.VALORSALARIO,
        tbf.DATA_DEMISSAO,
        tbf.PERC,
        tbf.STATIVO,
        IFNULL(tbf.PERCDESCPDV, 0) AS PERCDESCPDV,
        tbf.DSTIPO,
        IFNULL(tbf.VALORDISPONIVEL, 0) AS VALORDISPONIVEL,
        IFNULL(TO_VARCHAR(tbf.DTINICIODESC, 'YYYY-MM-DD HH:MM:SS'), '') AS DTINICIODESC,
        IFNULL(TO_VARCHAR(tbf.DTFIMDESC, 'YYYY-MM-DD HH:MM:SS'), '') AS DTFIMDESC,
        IFNULL(tbf.PERCDESCUSUAUTORIZADO, 0) AS PERCDESCUSUAUTORIZADO
      FROM 
        ${databaseSchema}.FUNCIONARIO tbf
        `;

    const statement = conn.prepare(sql);
    const result = await statement.exec();


    return result;
  } catch (error) {
    console.error('Erro ao executar a consulta Funcionarios:', error);
    throw error;
  }
};

export const handleGetFuncionariosById = async (byId, page, pageSize) => {
  try {
    let empresa = req.query.empresa;
    let cpf = req.query.cpf;
    let matricula = req.query.matricula;
    let senha = req.query.senha;

    let query = `SELECT 
        tbf.ID,
        tbf.IDFUNCIONARIO,
        tbf.IDGRUPOEMPRESARIAL,
        tbf.IDSUBGRUPOEMPRESARIAL,
        IFNULL(tbf.IDEMPRESA, 1) AS IDEMPRESA,
        tbf.NOFUNCIONARIO,
        tbf.IDPERFIL,
        tbf.NUCPF,
        tbf.NOLOGIN,
        tbf.PWSENHA,
        tbf.DSFUNCAO,
        IFNULL(TO_VARCHAR(tbf.DATAULTIMAALTERACAO, 'YYYY-MM-DD HH:MM:SS'), TO_VARCHAR(NOW(), 'YYYY-MM-DD HH:MM:SS')) AS DTULTALTERACAO,
        tbf.VALORSALARIO,
        tbf.DATA_DEMISSAO,
        tbf.PERC,
        tbf.STATIVO,
        IFNULL(tbf.PERCDESCPDV, 0) AS PERCDESCPDV,
        tbf.DSTIPO,
        IFNULL(tbf.VALORDISPONIVEL, 0) AS VALORDISPONIVEL,
        IFNULL(TO_VARCHAR(tbf.DTINICIODESC, 'YYYY-MM-DD HH:MM:SS'), '') AS DTINICIODESC,
        IFNULL(TO_VARCHAR(tbf.DTFIMDESC, 'YYYY-MM-DD HH:MM:SS'), '') AS DTFIMDESC,
        IFNULL(tbf.PERCDESCUSUAUTORIZADO, 0) AS PERCDESCUSUAUTORIZADO
      FROM 
        ${databaseSchema}.FUNCIONARIO tbf
      WHERE 1 = 1`;

    if (cpf) {
      query += ` AND tbf.DATA_DEMISSAO IS NULL AND tbf.STATIVO = 'True' AND DSTIPO <> 'PN'`;
    } else {
      query += ` AND tbf.DATA_DEMISSAO IS NULL AND tbf.STATIVO = 'True'`;
    }

    if (byId) {
      query += ` AND tbf.ID = '${byId}'`;
    }

    if (empresa) {
      query += ` AND (tbf.IDEMPRESA = ${empresa} OR DSFUNCAO = 'TI') AND tbf.IDFUNCIONARIO IS NOT NULL AND tbf.NOLOGIN <> ''`;
    }

    if (cpf) {
      query += ` AND tbf.NUCPF = '${cpf}'`;
    }

    if (matricula && senha) {
      query += ` AND tbf.NOLOGIN = '${matricula}' AND tbf.PWSENHA = '${senha}'`;
    }

    query += ` ORDER BY tbf.NOFUNCIONARIO`;

    // Adicionando paginação
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;
    }

    const statement = conn.prepare(query);
    const result = await statement.exec();
  

    return result;
  } catch (error) {
    console.error('Erro ao executar a consulta Funcionarios:', error);
    throw error;
  }
};

export const handlePutFuncionario = async (data) => {
  try {
    const query = `
      UPDATE "VAR_DB_NAME"."FUNCIONARIO" 
      SET 
        "IDFUNCIONARIO" = ?, 
        "IDGRUPOEMPRESARIAL" = ?, 
        "IDSUBGRUPOEMPRESARIAL" = ?, 
        "IDEMPRESA" = ?, 
        "NOFUNCIONARIO" = ?, 
        "IDPERFIL" = ?, 
        "NUCPF" = ?, 
        "NOLOGIN" = ?, 
        "PWSENHA" = ?, 
        "DSFUNCAO" = ?, 
        "DATAULTIMAALTERACAO" = ?, 
        "VALORSALARIO" = ?, 
        "DATA_DEMISSAO" = ?, 
        "PERC" = ?
      WHERE 
        "ID" = ?`;

    const statement = conn.prepare(query);

    for (const registro of data) {
      if (parseFloat(registro.PERC) > 50) {
        return { msg: "Valor desconto maior que permitido!" };
      }

      const params = [
        registro.IDFUNCIONARIO,
        registro.IDGRUPOEMPRESARIAL,
        registro.IDSUBGRUPOEMPRESARIAL,
        registro.IDEMPRESA,
        registro.NOFUNCIONARIO,
        registro.IDPERFIL,
        registro.NUCPF,
        registro.NOLOGIN,
        registro.PWSENHA,
        registro.DSFUNCAO,
        registro.DATAULTIMAALTERACAO,
        registro.VALORSALARIO,
        registro.DATA_DEMISSAO,
        registro.PERC,
        registro.ID
      ];

      await statement.exec(params);
    }

    statement.close();
    conn.commit();

    return { msg: "Atualização realizada com sucesso!" };
  } catch (error) {
    console.error('Erro ao executar a atualização de funcionários:', error);
    throw error;
  }
};

export const handlePostFuncionario = async (data) => {
  try {
    const query = `
      INSERT INTO "VAR_DB_NAME"."FUNCIONARIO" 
      (
        "IDFUNCIONARIO",
        "IDGRUPOEMPRESARIAL",
        "IDSUBGRUPOEMPRESARIAL",
        "IDEMPRESA",
        "NOFUNCIONARIO",
        "IDPERFIL",
        "NUCPF",
        "NOLOGIN",
        "PWSENHA",
        "DSFUNCAO",
        "DATAULTIMAALTERACAO",
        "VALORSALARIO",
        "DATA_DEMISSAO",
        "PERC"
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const statement = conn.prepare(query);

    for (const registro of data) {
      if (parseFloat(registro.PERC) > 50) {
        return { msg: "Valor desconto maior que permitido!" };
      }

      const params = [
        registro.IDFUNCIONARIO,
        registro.IDGRUPOEMPRESARIAL,
        registro.IDSUBGRUPOEMPRESARIAL,
        registro.IDEMPRESA,
        registro.NOFUNCIONARIO,
        registro.IDPERFIL,
        registro.NUCPF,
        registro.NOLOGIN,
        registro.PWSENHA,
        registro.DSFUNCAO,
        registro.DATAULTIMAALTERACAO,
        registro.VALORSALARIO,
        registro.DATA_DEMISSAO,
        registro.PERC
      ];

      await statement.exec(params);
    }

    statement.close();
    conn.commit();

    return { msg: "Inclusão realizada com sucesso!" };
  } catch (error) {
    console.error('Erro ao executar a inclusão de funcionários:', error);
    throw error;
  }
};
