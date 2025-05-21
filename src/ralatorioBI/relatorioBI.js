import conn from '../config/dbConnection.js';
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getRelatorioBI = async (idEmpresa, idRelatorio,  page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 100;

        let query = `
            SELECT 
                lrbi.IDRELATORIOBI, 
                rbi.DSRELATORIOBI AS DSNOME, 
                lrbi.IDEMPRESA, 
                TO_VARCHAR(lrbi.LINK) AS LINK, 
                lrbi.STATIVO 
            FROM "${databaseSchema}".LINKRELATORIOBI lrbi 
            JOIN "${databaseSchema}".RELATORIOBI rbi ON rbi.IDRELATORIOBI = lrbi.IDRELATORIOBI 
            JOIN "${databaseSchema}".EMPRESA e ON e.IDEMPRESA = lrbi.IDEMPRESA 
            WHERE 1 = ? 
            AND lrbi.STATIVO = 'True' 
            AND lrbi.IDEMPRESA = '${idEmpresa}' 
            AND lrbi.IDRELATORIOBI = '${idRelatorio}' 
        `;

        const params = [1];
        
        // if(idRelatorio) {
        //     query += ' AND IDRELATORIOBI = ?';
        //     params.push(idRelatorio);
        // }

        query += ` LIMIT ? OFFSET ?`;
        params.push(pageSize, (page - 1) * pageSize);

        const statement = await conn.prepare(query);
        const result = await statement.execute(params);
      
        return {
            page: page,
            pageSize: pageSize,
            rows: result.length,
            data: result
        };
    } catch (e) {
        console.error('Erro ao executar a consulta de relatório do BI:', e);
        throw new Error('Erro ao executar a consulta de relatório do BI');
    }
};

export const updateRelatarioBI = async (dados) => {
    try {
            
        var query = `
            UPDATE "${databaseSchema}"."RELATORIOBI" 
                SET "DSRELATORIOBI" = ?, 
                "STATIVO" = ? 
            WHERE "IDRELATORIOBI" = ?
        `;

        const statement = await conn.prepare(query);

        for(const registro of dados) {
          
            const params = [
                registro.DSRELATORIOBI,
                registro.STATIVO,
                registro.IDRELATORIOBI
            ]
            await statement.exec(params);
        }
        
        conn.commit();
        return {
            status: 'success',
            message: 'Atualização do Relatório do BI com sucesso'
        }
    } catch (error) {
        console.error('Erro ao executar a atualização do Relatório BI:', error);
        throw error;
    }
}
export const createRelatarioBI = async (dados) => {
    try {
            
        var query = `
            INSERT INTO "${databaseSchema}"."RELATORIOBI" 
            (
                "IDRELATORIOBI", 
                "DSRELATORIOBI", 
                "STATIVO"
            ) 
            VALUES (${databaseSchema}.SEQ_RELATORIOBI.NEXTVAL, ?, ?)
        `;

        const statement = await conn.prepare(query);

        for(const registro of dados) {
          
            const params = [
                registro.DSRELATORIOBI,
                registro.STATIVO,
            ]
            console.log(params, 'params')
            await statement.exec(params);
        }
        
        conn.commit();
        return {
            status: 'success',
            message: 'cadastro do Relatório do BI com sucesso'
        }
    } catch (error) {
        console.error('Erro ao executar a cadastro do Relatório BI:', error);
        throw error;
    }
}