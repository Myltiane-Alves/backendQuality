import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getGrupoProdutos = async (idGrupo, page, pageSize) =>  {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT DISTINCT
                tbps.IDGRUPO,
                tbps.GRUPOPRODUTO
            FROM 
                "${databaseSchema}".PRODUTOSAP tbps
            WHERE 
                1 = ?
        `;
        
        const params = [1];

        if (idGrupo) {
            query += ` AND tbps.IDGRUPO = ?`;
            params.push(idGrupo);
        }

        query += ` group by IDGRUPO,GRUPOPRODUTO ORDER BY GRUPOPRODUTO`;

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
        console.log('Erro ao consultar Grupos Produtos:', error);
    }
}
