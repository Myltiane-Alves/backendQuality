import { Console } from "node:console";
import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getObterFilial = async (idEmpresa) => {
    try {
        const queryFilial = `
            SELECT 
                "IDEMPRESA", 
                "NOFANTASIA" 
            FROM "${databaseSchema}"."EMPRESA"
                WHERE 1 = ? 
                AND "IDGRUPOEMPRESARIAL" = ?
                ORDER BY "IDEMPRESA"
        `;
        
        const params = [1, idEmpresa];
        
        const statement = await conn.prepare(queryFilial);
        const result = await statement.exec(params);

        if (!Array.isArray(result) || result.length === 0) return null;
        
        const jsonResult = result.map(row => ({
            IdFilial: row.IDEMPRESA,
            DescFilial: row.NOFANTASIA,
        }));
        
        return jsonResult;
    } catch (error) {
        console.error('Erro ao consultar as filiais:', error);
        throw error;
    }
};


export const getObterLinhasSugestao = async (codBarras, idPedidoCompra) => {
    try {

        const queryQtdSugestao = `
            SELECT 
                "IDDISTRIBUICAOCOMPRASHISTORICO", 
                "IDFILIAL", 
                "QTDSUGESTAOALTERACAO", 
                "QTDSUGESTAOALTERACAOHISTORICO" 
            FROM "${databaseSchema}".DISTRIBUICAOCOMPRASHISTORICO 
            WHERE 1 = ? 
              AND "CODBARRAS" = ? 
              AND "IDPEDIDOCOMPRA" = ?
        `;


        const params = [1, codBarras, idPedidoCompra];

        
        const statement = await conn.prepare(queryQtdSugestao);
        const result = await statement.exec(params);

       
        const jsonResult = result.map(row => ({
            IdDistribuicaoCompras: row.IDDISTRIBUICAOCOMPRASHISTORICO,
            IdFilial: row.IDFILIAL,
            QtdSugestao: row.QTDSUGESTAOALTERACAO,
            QtdSugestaoAlteracao: row.QTDSUGESTAOALTERACAOHISTORICO,
        }));

        return jsonResult;
    } catch (error) {
        console.error('Erro ao consultar linhas de sugestão:', error);
        throw error;
    }
};


export const getDistribuicaoSugestoesHistorico = async (idPedidoCompra, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT DISTINCT 
                "IDPEDIDOCOMPRA", 
                "CODBARRAS", 
                "DSPRODUTO", 
                "PRECOVENDA", 
                "GRADE", 
                "QTDGRADEHISTORICO", 
                "STCONCLUIDO", 
                "IDEMPRESA" 
            FROM "${databaseSchema}".DISTRIBUICAOCOMPRASHISTORICO WHERE 1 = ?
        `;

        const params = [1];

        if(idPedidoCompra) {
            query += `AND IDPEDIDOCOMPRA = ?`
            params.push(idPedidoCompra)
        }
     
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        const rows = result.rows || result; 

        if (!Array.isArray(rows) || rows.length === 0) return [];

        const data = await Promise.all(rows.map(async (registro) => {
            const filial = await getObterFilial(registro.IDEMPRESA);
            const Sugestao = await getObterLinhasSugestao(registro.CODBARRAS, idPedidoCompra);
           
            return {
                "venda": {
                    "IdPedidoCompra": registro.IDPEDIDOCOMPRA,
                    "IdEmpresa": registro.IDEMPRESA,
                    "CodBarras": registro.CODBARRAS,
                    "DescProduto": registro.DSPRODUTO,
                    "PrecoVenda": registro.PRECOVENDA,
                    "Grade": registro.GRADE,
                    "QtdGrade": registro.QTDGRADEHISTORICO,
                    "StConcluido": registro.STCONCLUIDO
                },
                filial,
                Sugestao
            }
        }));
 
        return data;
    } catch (error) {
        console.error('Erro ao executar a consulta distribuições sugestões historico:', error);
        throw error;
    }
}