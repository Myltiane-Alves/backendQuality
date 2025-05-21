import conn from "../../config/dbConnection.js";
const databaseSchema = process.env.HANA_DATABASE;

export const getBuscarProduto = async (
    idProduto,
    idEmpresa, 
    idGrupoEmpresarial,
    codBarras,
    descProduto, 
    dataPesquisa,  
    page, 
    pageSize
) => {
    try {
        
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT 
                TO_VARCHAR(TBP.DTULTALTERACAO,'DD/MM/YYYY HH24:MI:SS') AS DTULTALTERACAO,
                TBP.IDPRODUTO, 
                TBP.DSNOME, 
                TBP.NUCODBARRAS, 
                TBP.PRECOVENDA,
                VW_PROD."GRUPO", 
                VW_PROD."SUBGRUPO",
                (SELECT (IFNULL(TBN.IMPESTADUAL, 0) * 10) AS IMPESTADUAL FROM "${databaseSchema}".NCM TBN WHERE TBN.NUNCM = TBP.NUNCM AND SGUF = 'DF') AS PERC_ICMS_DF,
                (SELECT (IFNULL(TBN.IMPESTADUAL, 0) * 10) AS IMPESTADUAL FROM "${databaseSchema}".NCM TBN WHERE TBN.NUNCM = TBP.NUNCM AND SGUF = 'GO') AS PERC_ICMS_GO
            FROM "${databaseSchema}".PRODUTO TBP 
            INNER JOIN "${databaseSchema}"."VW_PRODUTO_ESTRUTURA_MERCADOLOGICA" VW_PROD ON 
                VW_PROD.IDPRODUTO = TBP."IDPRODUTO"  
            WHERE 
                TBP.STATIVO = 'True'
                AND 1 = 1
        `;

        
        const params = [];

        if(idProduto) {
            query += 'AND TBP.IDPRODUTO = ?';
            params.push(idProduto);
        }

        if(dataPesquisa) {
            query += 'AND TBP.DTULTALTERACAO >= ?';
            params.push(`${dataPesquisa} 00:00:00`);
        }
        
        if(codBarras) {
            query += 'AND TBP.NUCODBARRAS = ?';
            params.push(codBarras);
        }

        if(descProduto) {
            descProduto = descProduto.split(' ').join('%');
        
            query += ` AND  CONTAINS((TBP.DSNOME, TBP.NUCODBARRAS), ?) `;
            params.push(`%${descProduto}%`);
        }


        query += 'ORDER BY TBP.IDGRUPOEMPRESARIAL, TBP.IDPRODUTO';
        

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
        };
    } catch (error) {
        console.error('Erro ao executar a consulta Produtos:', error);
        throw error;
    }
};
