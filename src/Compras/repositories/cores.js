import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getCores = async (idGrupoCor, idCor, descricao, page, pageSize) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                A.IDCOR AS ID_COR, 
                A.IDGRUPOCOR AS ID_GRUPOCOR, 
                A.DSCOR AS DS_COR, 
                A.STATIVO, 
                B.DSGRUPOCOR AS DS_GRUPOCOR 
            FROM 
                "${databaseSchema}".COR A 
            INNER JOIN 
                "${databaseSchema}".GRUPOCOR B 
            ON 
                A.IDGRUPOCOR = B.IDGRUPOCOR 
            WHERE 
                1 = ?
        `;

        const params = [1]; 

   
        if (idGrupoCor) {
            query += ' AND A.IDGRUPOCOR = ? ';
            params.push(idGrupoCor);
        }

        if (idCor) {
            query += ' AND A.IDCOR = ? ';
            params.push(idCor);
        }

        if (descricao) {
            query += ' AND (A.DSCOR LIKE ? OR A.DSCOR LIKE ?) ';
            params.push(`%${descricao}%`, `%${descricao}%`);
        }

    
        query += ' ORDER BY A."IDGRUPOCOR", A."DSCOR" ';
        query += ' LIMIT ? OFFSET ? ';

        const offset = (page - 1) * pageSize;
        params.push(pageSize, offset);


        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao consultar Cores:', error.message);
        throw new Error(`Erro ao consultar Cores: ${error.message}`);
    }
};


export const updateCor = async (dados) => {
    try {
        const query = `
            UPDATE "${databaseSchema}"."COR" SET 
                "IDGRUPOCOR" = ?, 
                "DSCOR" = ?, 
                "STATIVO" = ? 
            WHERE "IDCOR" = ? 
        `;

        const statement = await conn.prepare(query);

        for (const dado of dados) {
            const params = [
                dado.IDGRUPOCOR,
                dado.DSCOR,
                dado.STATIVO,
                dado.IDCOR
            ];
            
            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização Cor com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Cor: ${e.message}`);
    }
};

export const createCor = async (dados) => {
    try {
        const queriId = `
            SELECT 
                IFNULL(MAX(TO_INT("IDCOR")), 0) + 1  AS NEXT_ID
            FROM 
                "${databaseSchema}"."COR" 
            WHERE 
                1 = ?
        `;
        const statementId = await conn.prepare(queriId);
        const resultId = await statementId.exec([1]);
        const idCor = resultId[0].NEXT_ID;
        const insertQuery = `
            INSERT INTO "${databaseSchema}"."COR" 
                ( 
                    "IDCOR", 
                    "IDGRUPOCOR", 
                    "DSCOR", 
                    "STATIVO" 
                ) 
            VALUES (?, ?, ?, ?)
        `;

        const statement = await conn.prepare(insertQuery);

        for (const dado of dados) {
            const params = [
                idCor,
                dado.IDGRUPOCOR,
                dado.DSCOR,
                dado.STATIVO,
            ];
            
            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Cor criada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao Criar Cor: ${e.message}`);
    }
};