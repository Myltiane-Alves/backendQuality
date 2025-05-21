import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getImagemProduto = async (
    idImagemProduto, 
    nuRefImagemProduto, 
    idFabricante, 
    idSubGrupoEstrutura, 
    idPedido, 
    page, 
    pageSize
) => {
    try {
     
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 10;

        const offset = (page - 1) * pageSize;

        let query = `
            SELECT 
                A.IDIMAGEM, 
                A.IDRESUMOPEDIDO, 
                A.NUREF, 
                CAST(BINTOSTR(CAST(A.IMAGEM AS BINARY)) AS VARCHAR) AS IMAGEM, 
                A.DTINCLUSAO, 
                TO_VARCHAR(A.DTINCLUSAO, 'DD/MM/YYYY HH24:MI:SS') AS DTINCLUSAOFORMAT, 
                A.STATIVO 
            FROM 
                "${databaseSchema}".TBIMAGEM A 
            WHERE 
                1 = ? 
                AND A.STATIVO = 'True'
        `;

        const params = [1]; 

       
        if (idImagemProduto) {
            query += ' AND A.IDIMAGEM = ? ';
            params.push(idImagemProduto);
        }
    
        if (nuRefImagemProduto) {
            query += ' AND A.NUREF = ? ';
            params.push(nuRefImagemProduto);
        }

        if (idPedido) {
            query += ' AND A.IDRESUMOPEDIDO = ? ';
            params.push(idPedido);
        }

        if (idFabricante) {
            query += `
                AND A.IDIMAGEM IN (
                    SELECT DISTINCT IDIMAGEM
                    FROM "${databaseSchema}".TBIMAGEMPRODUTO 
                    WHERE IDFABRICANTE = ? AND STATIVO = 'True'
                )
            `;
            params.push(idFabricante);
        }

        if (idSubGrupoEstrutura) {
            query += `
                AND A.IDIMAGEM IN (
                    SELECT DISTINCT IDIMAGEM
                    FROM "${databaseSchema}".TBIMAGEMPRODUTO 
                    WHERE IDSUBGRUPOESTRUTURA = ? AND STATIVO = 'True'
                )
            `;
            params.push(idSubGrupoEstrutura);
        }


        // query += ' ORDER BY A.DTINCLUSAO, A.IDRESUMOPEDIDO, A.NUREF ';
        query += ' LIMIT ? OFFSET ? ';
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