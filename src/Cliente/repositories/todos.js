
import conn from '../../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getTodosClientes = async (idCliente, numeroCpfCnpj, pageSize, page) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
        let query = `
            SELECT 
                tbc.IDCLIENTE,
                tbc.IDEMPRESA,
                tbc.DSNOMERAZAOSOCIAL,
                tbc.DSAPELIDONOMEFANTASIA,
                tbc.TPCLIENTE,
                tbc.NUCPFCNPJ,
                tbc.NURGINSCESTADUAL,
                tbc.NUINSCMUNICIPAL,
                tbc.NUINSCRICAOSUFRAMA,
                tbc.TPINDICADORINSCESTADUAL,
                tbc.STOPTANTESIMPLES,
                tbc.NUCEP,
                tbc.NUIBGE,
                tbc.EENDERECO,
                tbc.NUENDERECO,
                tbc.ECOMPLEMENTO,
                tbc.EBAIRRO,
                tbc.ECIDADE,
                tbc.SGUF,
                tbc.EEMAIL,
                tbc.NUTELCOMERCIAL,
                tbc.NUTELCELULAR,
                tbc.DTNASCFUNDACAO,
                tbc.DSOBSERVACAO,
                tbc.NOCONTATOCLIENTE01,
                tbc.EEMAILCONTATOCLIENTE01,
                tbc.FONECONTATOCLIENTE01,
                tbc.DSCARGOCONTATOCLIENTE01,
                tbc.NOCONTATOCLIENTE02,
                tbc.EEMAILCONTATOCLIENTE02,
                tbc.FONECONTATOCLIENTE02,
                tbc.DSCARGOCONTATOCLIENTE02,
                tbc.STATIVO,
                TO_VARCHAR(tbc.DTULTALTERACAO, 'YYYY-MM-DD HH24:MI:SS') AS DTULTALTERACAO
            FROM 
                "${databaseSchema}".CLIENTE tbc
            WHERE 
            1 = ?
        `;

        const params = [1];

        if (idCliente) {
            query += 'AND tbc.IDCLIENTE = ?';
            params.push(idCliente);
        }
        
        if (numeroCpfCnpj) {
            query += 'AND tbc.NUCPFCNPJ = ?';
            params.push(numeroCpfCnpj);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (error) {
        console.error('Erro ao executar consulta de todos os clientes', error);
        throw error;
    }
};

export const updateCliente = async (data) => {
    try {
        const query = `
            UPDATE "${databaseSchema}"."CLIENTE" SET 
                "IDEMPRESA" = ?, 
                "DSNOMERAZAOSOCIAL" = ?, 
                "DSAPELIDONOMEFANTASIA" = ?, 
                "TPCLIENTE" = ?, 
                "NUCPFCNPJ" = ?, 
                "NURGINSCESTADUAL" = ?, 
                "NUINSCMUNICIPAL" = ?, 
                "NUINSCRICAOSUFRAMA" = ?, 
                "TPINDICADORINSCESTADUAL" = ?, 
                "STOPTANTESIMPLES" = ?, 
                "NUCEP" = ?, 
                "NUIBGE" = ?, 
                "EENDERECO" = ?, 
                "NUENDERECO" = ?, 
                "ECOMPLEMENTO" = ?, 
                "EBAIRRO" = ?, 
                "ECIDADE" = ?, 
                "SGUF" = ?, 
                "EEMAIL" = ?, 
                "NUTELCOMERCIAL" = ?, 
                "NUTELCELULAR" = ?, 
                "DTNASCFUNDACAO" = ?, 
                "DSOBSERVACAO" = ?, 
                "NOCONTATOCLIENTE01" = ?, 
                "EEMAILCONTATOCLIENTE01" = ?, 
                "FONECONTATOCLIENTE01" = ?, 
                "DSCARGOCONTATOCLIENTE01" = ?, 
                "NOCONTATOCLIENTE02" = ?, 
                "EEMAILCONTATOCLIENTE02" = ?, 
                "FONECONTATOCLIENTE02" = ?, 
                "DSCARGOCONTATOCLIENTE02" = ?, 
                "STATIVO" = ?, 
                "DTULTALTERACAO" = ? 
            WHERE "IDCLIENTE" = ?
        `;
      const statement = conn.prepare(query);
  
      for (const registro of data) {

  
        const params = [
            registro.IDEMPRESA,
            registro.DSNOMERAZAOSOCIAL,
            registro.DSAPELIDONOMEFANTASIA,
            registro.TPCLIENTE,
            registro.NUCPFCNPJ,
            registro.NURGINSCESTADUAL,
            registro.NUINSCMUNICIPAL,
            registro.NUINSCRICAOSUFRAMA,
            registro.TPINDICADORINSCESTADUAL,
            registro.STOPTANTESIMPLES,
            registro.NUCEP,
            registro.NUIBGE,
            registro.EENDERECO,
            registro.NUENDERECO,
            registro.ECOMPLEMENTO,
            registro.EBAIRRO,
            registro.ECIDADE,
            registro.SGUF,
            registro.EEMAIL, 
            registro.NUTELCOMERCIAL,
            registro.NUTELCELULAR,
            registro.DTNASCFUNDACAO,
            registro.DSOBSERVACAO,
            registro.NOCONTATOCLIENTE01,
            registro.EEMAILCONTATOCLIENTE01,
            registro.FONECONTATOCLIENTE01,
            registro.DSCARGOCONTATOCLIENTE01,
            registro.NOCONTATOCLIENTE02,
            registro.EEMAILCONTATOCLIENTE02,
            registro.FONECONTATOCLIENTE02,
            registro.DSCARGOCONTATOCLIENTE02,
            registro.STATIVO,
            registro.DTULTALTERACAO,
            registro.IDCLIENTE
            
        ];
  
        await statement.exec(params);
      }
  
      
      conn.commit();
  
      return { msg: "Atualização realizada com sucesso!" };
    } catch (error) {
      console.error('Erro ao executar a atualização do cliente:', error);
      throw error;
    }
};

export const createCliente = async (data) => {
    try {
        const query = `
           INSERT INTO "${databaseSchema}"."CLIENTE" 
        (
            "IDCLIENTE",
            "IDEMPRESA",
            "DSNOMERAZAOSOCIAL",
            "DSAPELIDONOMEFANTASIA",
            "TPCLIENTE",
            "NUCPFCNPJ",
            "NURGINSCESTADUAL",
            "NUINSCMUNICIPAL",
            "NUINSCRICAOSUFRAMA",
            "TPINDICADORINSCESTADUAL",
            "STOPTANTESIMPLES",
            "NUCEP",
            "NUIBGE",
            "EENDERECO",
            "NUENDERECO",
            "ECOMPLEMENTO",
            "EBAIRRO",
            "ECIDADE",
            "SGUF",
            "EEMAIL",
            "NUTELCOMERCIAL",
            "NUTELCELULAR",
            "DTNASCFUNDACAO",
            "DSOBSERVACAO",
            "NOCONTATOCLIENTE01",
            "EEMAILCONTATOCLIENTE01",
            "FONECONTATOCLIENTE01",
            "DSCARGOCONTATOCLIENTE01",
            "NOCONTATOCLIENTE02",
            "EEMAILCONTATOCLIENTE02",
            "FONECONTATOCLIENTE02",
            "DSCARGOCONTATOCLIENTE02",
            "STATIVO",
            "DTULTALTERACAO"
        )
        VALUES (${databaseSchema}.SEQ_CLIENTE.NEXTVAL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;
      const statement = conn.prepare(query);
  
      for (const registro of data) {

  
        const params = [
            registro.IDEMPRESA,
            registro.DSNOMERAZAOSOCIAL,
            registro.DSAPELIDONOMEFANTASIA,
            registro.TPCLIENTE,
            registro.NUCPFCNPJ,
            registro.NURGINSCESTADUAL,
            registro.NUINSCMUNICIPAL,
            registro.NUINSCRICAOSUFRAMA,
            registro.TPINDICADORINSCESTADUAL,
            registro.STOPTANTESIMPLES,
            registro.NUCEP,
            registro.NUIBGE,
            registro.EENDERECO,
            registro.NUENDERECO,
            registro.ECOMPLEMENTO,
            registro.EBAIRRO,
            registro.ECIDADE,
            registro.SGUF,    
            registro.EEMAIL,
            registro.NUTELCOMERCIAL,
            registro.NUTELCELULAR,
            registro.DTNASCFUNDACAO,
            registro.DSOBSERVACAO,
            registro.NOCONTATOCLIENTE01,
            registro.EEMAILCONTATOCLIENTE01,
            registro.FONECONTATOCLIENTE01,
            registro.DSCARGOCONTATOCLIENTE01,
            registro.NOCONTATOCLIENTE02,
            registro.EEMAILCONTATOCLIENTE02,
            registro.FONECONTATOCLIENTE02,
            registro.DSCARGOCONTATOCLIENTE02,
            registro.STATIVO,
            registro.DTULTALTERACAO
            
        ];
  
        await statement.exec(params);
      }
  
      
      conn.commit();
  
      return { msg: "Cliente Cadastrado com sucesso!" };
    } catch (error) {
      console.error('Erro ao Criar cliente:', error);
      throw error;
    }
};