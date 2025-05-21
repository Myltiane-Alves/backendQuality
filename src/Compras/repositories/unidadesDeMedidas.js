import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getUnidadesDeMedidas = async (idUnidadeMedida, descricao, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                tbcp.IDUNIDADEMEDIDA,
                tbcp.DSUNIDADE,
                tbcp.DSSIGLA,
                tbcp.DTCADASTRO,
                tbcp.DTULTATUALIZACAO,
                tbcp.STATIVO
            FROM 
                "${databaseSchema}".UNIDADEMEDIDA tbcp
            WHERE 
                1 = ? 
                AND tbcp.STATIVO='True'
        `;

        const params = [1];

        if (idUnidadeMedida) {
            query += ' And tbcp.IDUNIDADEMEDIDA = ? ';
            params.push(idUnidadeMedida);
        }

        if (descricao) {
            query += ' And (tbf.DSUNIDADE LIKE ? OR tbf.DSSIGLA LIKE ? ) ';
            params.push(`%${descricao}%`, `%${descricao}%`);
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
        console.error('Erro ao consultar unidades de medidas:', error);
        throw error;
    }
}

export const updateUnidadesDeMedidas = async (dados) => {
    try {
        const queryUpdate = `
            UPDATE "${databaseSchema}"."UNIDADEMEDIDA" SET 
                "DSUNIDADE" = ?, 
                "DSSIGLA" = ?, 
                "DTULTATUALIZACAO" = ?, 
                "STATIVO" = ? 
            WHERE 
                "IDUNIDADEMEDIDA" = ?
        `;

        const statement = await conn.prepare(queryUpdate);

        for (const registro of dados) {
            await statement.exec([
                registro.DSUNIDADE,
                registro.DSSIGLA,
                registro.DTULTATUALIZACAO,
                registro.STATIVO,
                registro.IDUNIDADEMEDIDA,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Atualização da Unidades de Medidas Realizada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao atualizar Unidades de Medidas: ${e.message}`);
    }
};

export const createUnidadesDeMedidas = async (dados) => {
    try {
        const queryId = ` 
            SELECT IFNULL(MAX(TO_INT("IDUNIDADEMEDIDA")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."UNIDADEMEDIDA" WHERE 1 = ? 
        `;

        const queryInsert = `
            INSERT INTO "${databaseSchema}"."UNIDADEMEDIDA" 
            ( 
                "IDUNIDADEMEDIDA", 
                "DSUNIDADE", 
                "DSSIGLA", 
                "DTCADASTRO", 
                "DTULTATUALIZACAO", 
                "STATIVO" 
            ) 
            VALUES(?,?,?,?,?,?)
        `;
        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;
            
            await statementEstilo.exec([
                id,
                registro.DSUNIDADE,
                registro.DSSIGLA,
                registro.DTCADASTRO,
                registro.DTULTATUALIZACAO,
                registro.STATIVO,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Unidade de Medida criado com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Unidade de Medida: ${e.message}`);
    }
};
