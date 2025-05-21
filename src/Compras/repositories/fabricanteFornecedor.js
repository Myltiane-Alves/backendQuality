import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getFabricanteFornecedor = async (idFabricante, descFabricante, noFabricante,  page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT
                t2.IDFABRICANTEFORN,
                t3.IDFORNECEDOR,
                t1.IDFABRICANTE,
                t1.DSFABRICANTE,
                t1.IDSAP AS IDFABSAP,
                t1.LOGSAP AS LOGFABSAP,
                t1.STATIVO,
                t3.NOFANTASIA AS NOFANTFORN,
                t3.NORAZAOSOCIAL AS NORAZAOFORN,
                t3.NUCNPJ AS NUCNPJFORN,
                t3.ECIDADE AS CIDADEFORN,
                t3.SGUF AS UFFORN,
                t3.NUTELEFONE1 AS FONEFORN
            FROM "${databaseSchema}"."FABRICANTE" t1
                LEFT JOIN "${databaseSchema}"."VINCFABRICANTEFORN" t2 on t1.IDFABRICANTE = t2.IDFABRICANTE
                LEFT JOIN "${databaseSchema}"."FORNECEDOR" t3 on t2.IDFORNECEDOR = t3.IDFORNECEDOR
            WHERE 1 = 1
        `;
        const params = [];

        if (idFabricante) {
            query += ' And t1.IDFABRICANTE  = ?';
            params.push(idFabricante);
        }

        if (descFabricante) {
            query += ` And  CONTAINS((t1.DSFABRICANTE = ?) `;
            params.push(`%${descFabricante}%`);
            
        }
    
        if (noFabricante) {
            query += ` And  CONTAINS((t1.DSFABRICANTE = ?) `;
            params.push(`%${noFabricante}%`);
        }

        const offset = (page - 1) * pageSize;
        params.push(pageSize, offset);
        
        query += 'ORDER BY t1.DSFABRICANTE LIMIT ? OFFSET ?';
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page,
            pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao cunsulta Fabricantes Fornecedores:', error);
        throw error;
    }
}

export const updateFabricanteFornecedor = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."VINCFABRICANTEFORN" SET 
                "IDFABRICANTE" = ?, 
                "IDFORNECEDOR" = ?, 
                "STATIVO" = ? 
            WHERE "IDFABRICANTEFORN" = ? 
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.IDFABRICANTE,
                registro.IDFORNECEDOR,
                registro.STATIVO,
                registro.IDFABRICANTEFORN,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Fabricante Fornecedor Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Fabricante Fornecedor: ${e.message}`);
    }
};

export const createFabricanteFornecedor = async (dados) => {
    try {
       
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDFABRICANTEFORN")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."VINCFABRICANTEFORN" WHERE 1 = ?
        `;

        const queryInsert = `
            INSERT INTO "${databaseSchema}"."VINCFABRICANTEFORN" 
            ( 
                "IDFABRICANTEFORN", 
                "IDFABRICANTE", 
                "IDFORNECEDOR", 
                "STATIVO" 
            ) 
            VALUES(?,?,?,?) 
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.IDFABRICANTE,
                registro.IDFORNECEDOR,
                registro.STATIVO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Fabricante Fornecedor criado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Fabricante Fornecedor: ${e.message}`);
    }
};