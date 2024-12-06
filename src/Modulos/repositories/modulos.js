import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getModulos = async (idPerfil) => {
    try {

        let query = `
           SELECT 
                MP.ID AS IDMODULO,
                MP.DSMODULO,
                MP.IDPERFIL,
                MP.IDMENU
            FROM 
                "${databaseSchema}".MODULOPRINCIPAL AS MP
            INNER JOIN 
                "${databaseSchema}".PERFILUSUARIOMENU AS PFUM ON MP.IDPERFIL = PFUM.IDPERFIL
            WHERE 
        `;

        const params = [];
        console.log(idPerfil);
        if (Array.isArray(idPerfil)) {
            // Para múltiplos perfis, cria placeholders e adiciona parâmetros
            const placeholders = idPerfil.map(() => '?').join(', ');
            console.log(placeholders);
            query += ` PFUM.IDPERFIL IN (${placeholders})`;
            params.push(...idPerfil);
        } else {
            // Para um único perfil, usa o operador "=" e adiciona o parâmetro
            query += ` PFUM.IDPERFIL = ?`;
            params.push(idPerfil);
        }

        query += ' ORDER BY MP.ID';

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            rows: result.length,
            data: result
        };
    } catch (error) {
        console.error('Erro ao executar a consulta de módulos:', error);
        throw error;
    } finally {
        await conn.close(); 
    }
}

export const updateModulo = async (dados) => {
    try {
        
        const query = `
            UPDATE "${databaseSchema}"."MODULO" SET 
            "IDMODULO" = ?, 
            "DSMODULO" = ?
            WHERE "IDMODULO" = ?
        `;

        const statement = await conn.prepare(query);

        for(const registro of dados) {
          
            const params = [
                registro.IDMODULO,
                registro.DSMODULO,
            ]
            await statement.exec(params);
        }
        
        conn.commit();
        return {
            status: 'success',
            message: 'Modulo atualizado com sucesso'
        }
    } catch (error) {
        console.error('Erro ao executar a atualização do Modulo:', error);
        throw error;
    }
}

export const createModulo = async (dados) => {
    try {
        const query = `
            INSERT INTO "${databaseSchema}"."MODULO" 
            (
                "IDMODULO", 
                "DSMODULO"
            )
            VALUES (?, ?)
        `;

        const statement = await conn.prepare(query);

        for (const registro of dados) {
            // Gera o próximo IDMODULO, caso necessário
            const idQuery = `SELECT IFNULL(MAX(TO_INT("IDMODULO")), 0) + 1 AS novoId FROM "${databaseSchema}"."MODULO"`;
            const idResult = await conn.exec(idQuery);
            const novoId = idResult[0].NOVOID || registro.IDMODULO;

            const params = [
                novoId,  // IDMODULO gerado ou o fornecido em `registro.IDMODULO`
                registro.DSMODULO
            ];

            await statement.exec(params);
        }

        await conn.commit();
        return {
            status: 'success',
            message: 'Módulo(s) atualizado(s) com sucesso'
        };
    } catch (error) {
        console.error('Erro ao executar a atualização do Módulo:', error);
        throw error;
    } finally {
        conn.close(); 
    }
}


