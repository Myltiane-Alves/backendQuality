import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getFuncionariosLoja = async (byId, idEmpresa, cpf, noFuncionarioCPF, page, pageSize) => {
  try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
    let query = `
      SELECT 
        tbf.ID,
        tbf.IDFUNCIONARIO,
        tbf.IDGRUPOEMPRESARIAL,
        tbf.IDSUBGRUPOEMPRESARIAL,
        tbf.IDEMPRESA,
        tbe.NOFANTASIA,
        UPPER(tbf.NOFUNCIONARIO) AS NOFUNCIONARIO,
        tbf.IDPERFIL,
        tbf.NUCPF,
        tbf.NOLOGIN,
        tbf.PWSENHA,
        tbf.DSFUNCAO,
        tbf.DATAULTIMAALTERACAO,
        tbf.VALORSALARIO,
        TO_VARCHAR(tbf.DATA_DEMISSAO,'DD-MM-YYYY') AS DTDEMISSAO,
        tbf.DATA_DEMISSAO,
        tbf.PERC,
        tbf.STATIVO,
        tbf.DSTIPO,
        tbf.VALORDISPONIVEL,
        TO_VARCHAR(tbf.DTINICIODESC,'YYYY-MM-DD') AS DTINICIODESC,
        TO_VARCHAR(tbf.DTFIMDESC,'YYYY-MM-DD') AS DTFIMDESC,
        tbf.PERCDESCUSUAUTORIZADO,
        tbf.STCONVENIO,
        tbf.STDESCONTOFOLHA,
        tbf.DATA_ADMISSAO
    FROM 
        "${databaseSchema}".FUNCIONARIO tbf
        INNER JOIN "${databaseSchema}".EMPRESA tbe ON tbf.IDEMPRESA = tbe.IDEMPRESA
    WHERE 
        1 = 1
    `;

    const params = [];

    if(byId) {
      query += `AND tbf.ID = ?`;
      params.push(byId);
    }

    if(idEmpresa) {
      query += `AND tbf.IDEMPRESA = ?`;
      params.push(idEmpresa);
    }

    if (cpf) {
      query += `AND tbf.NUCPF = ?`;
      params.push(cpf);
    }

    if(noFuncionarioCPF) {
      query += `AND (tbf.NOFUNCIONARIO LIKE ? OR tbf.NUCPF LIKE ?)`;
      params.push(`%${noFuncionarioCPF}%`, `%${noFuncionarioCPF}%`);
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
    console.error('Erro ao executar a consulta Funcionarios:', error);
    throw error;
  }
};

export const updateFuncionario = async (data) => {
  try {
    const query = `UPDATE "${databaseSchema}"."FUNCIONARIO" SET 
        "NOLOGIN" = ?, 
        "PWSENHA" = ?, 
        "IDEMPRESA" = ?, 
        "IDSUBGRUPOEMPRESARIAL" = ?, 
        "DATAULTIMAALTERACAO" = NOW(), 
        "IDFUNCIONARIO" = ?, 
        "IDFUNCIONARIOULTALTERACAO" = ? 
        WHERE "ID" = ?
    `;
    const statement = conn.prepare(query);

    for (const registro of data) {
      if (parseFloat(registro.PERC) > 50) {
        return { msg: "Valor desconto maior que permitido!" };
      }

      const params = [
        registro.NOLOGIN,
        registro.PWSENHA,
        registro.IDEMPRESA,
        registro.IDSUBGRUPOEMPRESARIAL,
        registro.IDFUNCIONARIO,
        registro.IDFUNCAOALTERACAO,
        registro.ID
      ];

      await statement.exec(params);
    }

    
    conn.commit();

    return { msg: "Atualização realizada com sucesso!" };
  } catch (error) {
    console.error('Erro ao executar a atualização de funcionários:', error);
    throw error;
  }
};

export const createFuncionario = async (data) => {
  try {
   
    const query = `INSERT INTO "${databaseSchema}"."FUNCIONARIO" 
        ( 
        "ID", 
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
        "PERC", 
        "STATIVO", 
        "DSTIPO", 
        "VALORDISPONIVEL", 
        "STCONVENIO",
        "STDESCONTOFOLHA" 
        ) 
        VALUES(${databaseSchema}.SEQ_FUNCIONARIO.NEXTVAL,?,1,?,?,?,0,?,?,?,?,now(),?,?,?,?,?,?,?) 
    `;

    const statement = conn.prepare(query);

    for (const registro of data) {
      if (parseFloat(registro.PERC) > 50) {
        return { msg: "Valor desconto maior que permitido!" };
      }

      const params = [
        registro.IDFUNCIONARIO,
        registro.IDSUBGRUPOEMPRESARIAL,
        registro.IDEMPRESA,
        registro.NOFUNCIONARIO,
        registro.IDPERFIL,
        registro.NUCPF,
        registro.NOLOGIN,
        registro.PWSENHA,
        registro.DSFUNCAO,
        registro.VALORSALARIO,
        registro.PERC,
        registro.STATIVO,
        registro.DSTIPO,
        registro.VALORDISPONIVEL,
        registro.STCONVENIO,
        registro.STDESCONTOFOLHA
      ];

      await statement.exec(params);
    }


    conn.commit();

    return { msg: "Inclusão realizada com sucesso!" };
  } catch (error) {
    console.error('Erro ao executar a inclusão de funcionários:', error);
    throw error;
  }
};
