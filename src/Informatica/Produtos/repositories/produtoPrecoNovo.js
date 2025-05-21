import conn from "../../../config/dbConnection.js";
import 'dotenv/config';

const databaseSchema = process.env.HANA_DATABASE;
const databaseSchemaSBO = process.env.HANA_DATABASE_SBO;

export const getProdutoPrecoNovo = async (idEmpresa, dsProduto, page = 1, pageSize = 1000) => {
    try {
        // Validação dos parâmetros de entrada
        if (!idEmpresa || isNaN(idEmpresa)) {
            throw new Error('ID da empresa inválido');
        }

        page = parseInt(page);
        pageSize = parseInt(pageSize);

        if (isNaN(page) || page < 1) {
            page = 1;
        }

        if (isNaN(pageSize) || pageSize < 1) {
            pageSize = 1000;
        }

        // Consulta para obter o ID_LISTA_LOJA
        const queryIdListaLoja = `SELECT ID_LISTA_LOJA FROM "${databaseSchema}"."EMPRESA" WHERE IDEMPRESA = ?`;
        const resultListaLoja = await conn.prepare(queryIdListaLoja).exec([idEmpresa]);
        const IdListaLoja = resultListaLoja.length ? resultListaLoja[0].ID_LISTA_LOJA : null;

        if (!IdListaLoja) {
            throw new Error('ID_LISTA_LOJA não encontrado para a empresa informada');
        }

        // Preparando a consulta principal
        let query = `
            SELECT 
                A.DATA_ULTIMA_ALTERACAO_PDV,
                TO_VARCHAR(A.DATA_ULTIMA_ALTERACAO_PDV, 'DD-MM-YYYY HH24:MI:SS') AS DATA_ULTIMA_ALTERACAO_PDV,
                A.CODIGO_ITEM,
                A.DESCRICAO_ITEM,
                A.CODIGO_BARRAS,
                A.PRECO_VENDA_PDV,
                A.PRECO_VENDA_SAP,
                ROUND(IFNULL(B."Price", 0), 2) AS "PRECO_CUSTO",
                A.ID_LISTA_LOJA,
                A.LISTA_PRECO_LOJA,
                A.PRECO_VENDA_BRASILIA,
                A.LISTA_PRECO_BRASILIA,
                A.IDEMPRESA,
                A.LOJA,
                C."GRUPO",
                C."SUBGRUPO"
            FROM 
                ${databaseSchemaSBO}.RS_PRECO_VENDA_PDV_X_SAP A
            INNER JOIN 
                "${databaseSchemaSBO}"."ITM1" B ON B."ItemCode" = A.CODIGO_ITEM AND B."PriceList" = 3
            INNER JOIN 
                "${databaseSchema}"."VW_PRODUTO_ESTRUTURA_MERCADOLOGICA" C ON C.IDPRODUTO = B."ItemCode"
            WHERE 
                1 = ?
                AND A.ID_LISTA_LOJA = ?
                AND A.IDEMPRESA = ?
        `;

        const params = [1, IdListaLoja, idEmpresa];

        // Adicionando filtro por descrição do produto, se fornecido
        if (dsProduto) {
            dsProduto = dsProduto.trim().replace(' ', '%');
            query += ` AND (A.CODIGO_BARRAS = ? OR UPPER(A.DESCRICAO_ITEM) LIKE UPPER(?))`;
            params.push(dsProduto, `%${dsProduto}%`);
        }

        // Ordenação e paginação
        query += ` ORDER BY A.CODIGO_ITEM`;
        query += ` LIMIT ? OFFSET ?`;
        const offset = (page - 1) * pageSize;
        params.push(pageSize, offset);

        // Executando a consulta
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            page,
            pageSize,
            rows: result.length,
            data: result
        };
    } catch (error) {
        console.error('Erro ao executar consulta Produto preco novo:', error.message);
        throw new Error('Erro ao buscar dados do produto');
    }
};