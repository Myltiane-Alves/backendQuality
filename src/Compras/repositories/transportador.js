import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getTransportador = async (idTransportador, descTransportador, cnpjTransportador, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                tbt.IDTRANSPORTADORA,
                tbt.IDGRUPOEMPRESARIAL,
                tbt.IDSUBGRUPOEMPRESARIAL,
                tbt.NORAZAOSOCIAL,
                tbt.NOFANTASIA,
                tbt.NUCNPJ,
                tbt.NUINSCESTADUAL,
                tbt.NUINSCMUNICIPAL,
                tbt.NUIBGE,
                tbt.EENDERECO,
                tbt.ENUMERO,
                tbt.ECOMPLEMENTO,
                tbt.EBAIRRO,
                tbt.ECIDADE,
                tbt.SGUF,
                tbt.NUCEP,
                tbt.EEMAIL,
                tbt.NUTELEFONE1,
                tbt.NUTELEFONE2,
                tbt.NUTELEFONE3,
                tbt.NOREPRESENTANTE,
                tbt.DTCADASTRO,
                tbt.DTULTATUALIZACAO,
                tbt.STATIVO,
                TO_VARCHAR(tbt.DTCADASTRO,'YYYY-MM-DD HH24:MI:SS') AS DTCADASTROFORMAT 
            FROM 
                "${databaseSchema}".TRANSPORTADORA tbt
            WHERE 
                1 = 1
        `;

        const params = [];

        if (idTransportador) {
            query += ' And tbt.IDTRANSPORTADORA = ? ';
            params.push(idTransportador);
        }
    
        if (descTransportador) {
            query += ' And tbt.NORAZAOSOCIAL LIKE ? OR tbt.NOFANTASIA LIKE ? ';
            params.push(`%${descTransportador}% `, `%${descTransportador}%`);
        }

        if (cnpjTransportador) {
            query += ' And tbt.NUCNPJ = ? ';
            params.push(cnpjTransportador);
        }

        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
        params.push(pageSize, offset);
        

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao consultar Transportadoras:', error);
        throw error;
    }
}

export const updateTransportador = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."TRANSPORTADORA" SET 
                "IDGRUPOEMPRESARIAL" = ?, 
                "IDSUBGRUPOEMPRESARIAL" = ?, 
                "NORAZAOSOCIAL" = ?, 
                "NOFANTASIA" = ?, 
                "NUCNPJ" = ?, 
                "NUINSCESTADUAL" = ?, 
                "NUINSCMUNICIPAL" = ?, 
                "NUIBGE" = ?, 
                "EENDERECO" = ?, 
                "ENUMERO" = ?, 
                "ECOMPLEMENTO" = ?, 
                "EBAIRRO" = ?, 
                "ECIDADE" = ?, 
                "SGUF" = ?, 
                "NUCEP" = ?, 
                "EEMAIL" = ?, 
                "NUTELEFONE1" = ?, 
                "NUTELEFONE2" = ?, 
                "NUTELEFONE3" = ?, 
                "NOREPRESENTANTE" = ?, 
                "DTCADASTRO" = ?, 
                "DTULTATUALIZACAO" = ?, 
                "STATIVO" = ? 
            WHERE "IDTRANSPORTADORA" = ? 
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.IDGRUPOEMPRESARIAL,
                registro.IDSUBGRUPOEMPRESARIAL,
                registro.NORAZAOSOCIAL,
                registro.NOFANTASIA,
                registro.NUCNPJ,
                registro.NUINSCESTADUAL,
                registro.NUINSCMUNICIPAL,
                registro.NUIBGE,
                registro.EENDERECO,
                registro.ENUMERO,
                registro.ECOMPLEMENTO,
                registro.EBAIRRO,
                registro.ECIDADE,
                registro.SGUF,
                registro.NUCEP,
                registro.EEMAIL,
                registro.NUTELEFONE1,
                registro.NUTELEFONE2,
                registro.NUTELEFONE3,
                registro.NOREPRESENTANTE,
                registro.DTCADASTRO,
                registro.DTULTATUALIZACAO,
                registro.STATIVO,
                registro.IDTRANSPORTADORA,

            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Transportador Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Transportador: ${e.message}`);
    }
};

export const createTransportador = async (dados) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDTRANSPORTADORA")),0) + 1 AS NEXT_ID 
            FROM "${databaseSchema}"."TRANSPORTADORA" WHERE 1 = ?
        `;


        const queryInsert = `
            INSERT INTO "${databaseSchema}"."TRANSPORTADORA" (
                "IDTRANSPORTADORA",
                "IDGRUPOEMPRESARIAL",
                "IDSUBGRUPOEMPRESARIAL",
                "NORAZAOSOCIAL",
                "NOFANTASIA",
                "NUCNPJ",
                "NUINSCESTADUAL",
                "NUINSCMUNICIPAL",
                "NUIBGE",
                "EENDERECO",
                "ENUMERO",
                "ECOMPLEMENTO",
                "EBAIRRO",
                "ECIDADE",
                "SGUF",
                "NUCEP",
                "EEMAIL",
                "NUTELEFONE1",
                "NUTELEFONE2",
                "NUTELEFONE3",
                "NOREPRESENTANTE",
                "DTCADASTRO",
                "DTULTATUALIZACAO",
                "STATIVO"
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.IDGRUPOEMPRESARIAL,
                registro.IDSUBGRUPOEMPRESARIAL,
                registro.NORAZAOSOCIAL,
                registro.NOFANTASIA,
                registro.NUCNPJ,
                registro.NUINSCESTADUAL,
                registro.NUINSCMUNICIPAL,
                registro.NUIBGE,
                registro.EENDERECO,
                registro.ENUMERO,
                registro.ECOMPLEMENTO,
                registro.EBAIRRO,
                registro.ECIDADE,
                registro.SGUF,
                registro.NUCEP,
                registro.EEMAIL,
                registro.NUTELEFONE1,
                registro.NUTELEFONE2,
                registro.NUTELEFONE3,
                registro.NOREPRESENTANTE,
                registro.DTCADASTRO,
                registro.DTULTATUALIZACAO,
                registro.STATIVO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Transportador criado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Transportador: ${e.message}`);
    }
};