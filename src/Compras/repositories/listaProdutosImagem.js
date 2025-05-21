import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getListaProdutosImagem = async (
    idImagem, 
    page, 
    pageSize
) => {
    try {
     
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 10;

        const offset = (page - 1) * pageSize;

        let query = `
            SELECT 
                T1.IDIMAGEMPRODUTO,
                T1.IDIMAGEM,
                T1.IDPRODUTO,
                T2.DSNOME,
                T2.NUCODBARRAS,
                T3.IMAGEM
            FROM 
                "${databaseSchema}".TBIMAGEMPRODUTO T1
                INNER JOIN "${databaseSchema}".TBIMAGEM T3 ON T1.IDIMAGEM = T3.IDIMAGEM
                INNER JOIN "${databaseSchema}".PRODUTO T2 ON T1.IDPRODUTO = T2.IDPRODUTO
            WHERE 
                1 = ?
                AND T1.STATIVO='True'
        `;

        const params = [1]; 

       
        if (idImagem) {
            query += ' AND T1.IDIMAGEM = ? ';
            params.push(idImagem);
        }
    

        query += ' ORDER BY T2.DSNOME, T2.NUCODBARRAS  LIMIT ? OFFSET ? ';
        params.push(pageSize, offset);

       
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);
    
        return {
            page,
            pageSize,
            rows: result.length,
            data: result,
        };
    } catch (error) {
        console.error('Erro ao consultar Imagem Produto:', error);
        throw error;
    }
};