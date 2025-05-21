import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getFornecedorFabricante = async (idFornecedor, idFabricante, descFornecedor, cnpjFornecedor,  page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT
                t2.IDFABRICANTEFORN,
                t1.IDFORNECEDOR,
                t1.IDFORNECEDORSAP,
                t1.STMIGRADOSAP,
                t3.IDFABRICANTE,
                t3.DSFABRICANTE,
                t1.STATIVO,
                t1.NOFANTASIA AS NOFANTFORN,
                t1.NORAZAOSOCIAL AS NORAZAOFORN,
                t1.NUCNPJ AS NUCNPJFORN,
                t1.ECIDADE AS CIDADEFORN,
                t1.SGUF AS UFFORN,
                t1.LOGSAP AS LOGFORNECEDORSAP,
                t1.NUTELEFONE1 AS FONEFORN
            FROM "${databaseSchema}"."FORNECEDOR" t1
                LEFT JOIN "${databaseSchema}"."VINCFABRICANTEFORN" t2 on t1.IDFORNECEDOR = t2.IDFORNECEDOR
                LEFT JOIN "${databaseSchema}"."FABRICANTE" t3 on t2.IDFABRICANTE = t3.IDFABRICANTE
            WHERE 1 = ?
        `;
        const params = [1];

        if (idFornecedor) {
            query += ' And t1.IDFORNECEDOR = ?';
            params.push(idFornecedor);
        }

        if (idFabricante) {
            query += ' And t2.IDFABRICANTEFORN = ?';
            params.push(idFabricante);
        }

        if (descFornecedor) {
            query += ` And  CONTAINS((t1.NORAZAOSOCIAL, t1.NOFANTASIA), '%${descFornecedor}%') `;
            // params.push(`%${descFornecedor}%`);
            
        }
    
        if (cnpjFornecedor) {
            query += ` And  t1.NUCNPJ = ? `;
            params.push(cnpjFornecedor);
        }

        const offset = (page - 1) * pageSize;
        params.push(pageSize, offset);
        
        query += 'ORDER BY t1."NORAZAOSOCIAL" LIMIT ? OFFSET ?';
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);


        return {
            page,
            pageSize,
            rows: result.length,
            data: result,
        }

    } catch (error) {
        console.error('Erro ao cunsulta Fornecedores Fabricantes:', error);
        throw error;
    }
}

export const updateFornecedorFabricante = async (dados) => {
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
            message: 'Atualização do Fornecedor Fabricante Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Fornecedor Fabricante: ${e.message}`);
    }
};

export const createFornecedorFabricante = async (dados) => {
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
            VALUES (?, ?, ?, ?)
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