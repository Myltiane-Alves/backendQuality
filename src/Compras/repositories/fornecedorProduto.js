import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getFornecedorProduto = async (idMarca, idFornecedor, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT A."IDFORNECEDOR", 
                A."NORAZAOSOCIAL", 
                A."NOFANTASIA", 
                A."NUCNPJ" 
            FROM "${databaseSchema}"."FORNECEDOR" A WHERE 1=?  
                GROUP BY A."NORAZAOSOCIAL",
                A."NOFANTASIA",
                A."IDFORNECEDOR",
                A."NUCNPJ"
        `;

        const params = [1];

        if (idMarca) {
            query += 'And A."IDSUBGRUPOEMPRESARIAL" = ? ';
            params.push(idMarca);
        }

        if (idFornecedor) {
            query += 'And A."IDFORNECEDOR" = ? ';
            params.push(idFornecedor);
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
        console.error('Erro ao consultar Fornecedor Transportadora:', error);
        throw error;
    }
}