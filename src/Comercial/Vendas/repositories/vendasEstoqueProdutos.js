import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
import { toFloat } from "../../../utils/toFloat.js";
const databaseSchema = process.env.HANA_DATABASE;

export const getObterEntradaProduto = async (idProduto, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        var query = `
            select "Cod.Item", 
            ifnull(sum("Entradas"),0) as qtdEntrada, 
            ifnull(sum("Saidas"),0) as qtdSaidas
            from 
                SBO_GTO_PRD.IS_ENT_SAI_DETALHADO 
            where "Cod.Item"=? 
            AND ("Data" BETWEEN '${dataPesquisaInicio} 00:00:00' AND '${dataPesquisaFim} 23:59:59') 
            group by "Cod.Item"
        `;

        const params = [idProduto];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			    "QTDENTRADA": toFloat(det.QTDENTRADA),
                "QTDSAIDAS": toFloat(det.QTDSAIDAS),
                "TOTALCOMPRADO": toFloat(det.TOTALCOMPRADO)
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter entrada produto: ' + e.message);
    }
};

export const getObterVouchersProduto = async (idProduto, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        var query = `
            select t2.idproduto, ifnull(sum(t2.qtd),0) as qtdVoucher 
				from 
					${databaseSchema}.resumovoucher t1 
					inner join ${databaseSchema}.detalhevoucher t2 on t1.idvoucher = t2.idvoucher 
				where t2.idproduto=? 
				AND (t1.DTINVOUCHER BETWEEN '${dataPesquisaInicio} 00:00:00' AND '${dataPesquisaFim} 23:59:59') 
				group by t2.idproduto
        `;

        const params = [idProduto];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			    "QTDVOUCHER": toFloat(det.QTDVOUCHER),
               
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter voucher produto: ' + e.message);
    }
};

export const getObterVendaPeriodo = async (idProduto, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        var query = `
                select 
					ifnull(sum(t2.qtd), 0) as QTD, 
					round(t2.VUNCOM, 2) as VUNCOM 
				 from 
					${databaseSchema}.vendadetalhe t2 
					inner join ${databaseSchema}.venda t1 on t1.idvenda = t2.idvenda 
				 where 
					t2.cprod = ? 
					and t1.stcancelado = 'False' 
					and t1.dthorafechamento between '${dataPesquisaInicio} 00:00:00' and '${dataPesquisaFim} 23:59:00' 
				 group by 
					t2.VUNCOM
        `;

        const params = [idProduto];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			    "QTDVENDAS": toFloat(det.QTD),
                "VUNCOM": toFloat(det.VUNCOM)
               
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter venda período: ' + e.message);
    }
};

export const getObterPedidoProduto = async (idProduto, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        let query = `
            SELECT 
                QTDESOLICITADA, 
                QTDEENTREGUE, 
                PRECOUNIT 
            FROM 
                "SBO_GTO_PRD"."IS_PEDIDOS_DE_COMPRA" 
            WHERE 
                CODPRODUTO=? 
                AND DATADOPEDIDO <= '${dataPesquisaFim} 23:59:59' 
            ORDER BY 
                PEDIDO ASC`
        ;

        const params = [idProduto];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			    "QTDESOLICITADA": toFloat(det.QTDESOLICITADA),
                "QTDEENTREGUE": toFloat(det.QTDEENTREGUE),
                "PRECOUNIT": toFloat(det.PRECOUNIT)
               
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter pedido produto: ' + e.message);
    }
};

export const getObterEstoqueLoja1 = async (idProduto) => {
    try {
        let query = `
            SELECT 
                ESTOQUE101 
            FROM 
                SBO_GTO_PRD.IS_ESTOQUE_TOTAL 
            WHERE "CODPRODUTO"=?
        `;

        const params = [idProduto];
        const statement = await conn.prepare(query);
        const rows = await statement.exec(params);
        if(!Array.isArray(rows) || rows.length === 0) return [];
     
        const lines = rows.map((det, index) => ({
            "@nItem": index + 1,
			"ESTOQUE101": toFloat(det.ESTOQUE101),   
        }));

        return lines;

    } catch (e) {
        throw new Error('Erro ao consultar obter estoque: ' + e.message);
    }
};

export const getVendasEstoqueProduto = async (idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, dataPesquisaInicioB, dataPesquisaFimB, dataPesquisaInicioC, dataPesquisaFimC, uf, idFornecedor, descricaoProduto, idGrupoGrade, idGrade, idMarcaProduto, page, pageSize) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = `
            SELECT DISTINCT 
                v2.GRUPO,
                v2.SUBGRUPO,
                v2.MARCA,
                v3.NUCODBARRAS,
                V2.CPROD,
                v3.DSNOME,
                SUM(v2.QTD) AS QTD,
                SUM(v2.VRTOTALLIQUIDO) AS VRTOTALLIQUIDO,
                SUM((v2.QTD*v2.PRECO_COMPRA)) AS TOTALCUSTO,
                ROUND(SUM((v2.QTD*v2.VUNCOM)),2) AS TOTALBRUTO,
                SUM((v2.VDESC)) AS TOTALDESCONTO
            FROM 
                "${databaseSchema}".VW_VENDAS_PRODUTO_GRUPO_SUBGRUPO v2
                INNER JOIN "${databaseSchema}".PRODUTO v3 ON V2.CPROD = V3.IDPRODUTO
            WHERE 
                1 = ? 
        `;

            
        const params = [1];

        if(dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (v2.DTHORAFECHAMENTO BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if(descricaoProduto) {
            query =+ ` And  (v3.DSNOME LIKE %${descricaoProduto}% OR v3.NUCODBARRAS = ? )`;
            params.push(`%${descricaoProduto}%`, `${descricaoProduto}`);
        }

        if(idFornecedor)  {
            query += 'AND v2.IDRAZAO_SOCIAL_FORNECEDOR  = ?';
            params.push(idFornecedor);
        }

        if (idGrupo) {
            const listarIdGrupo = idGrupo.split(',');
            let descGrupo = '';
            let listarDescGrupo = '';

            for (let i = 0; i < listarIdGrupo.length; i++) {
                switch (listarIdGrupo[i]) {
                    case '1':
                        descGrupo = 'Verão';
                        break;
                    case '2':
                        descGrupo = 'Calçados/Acessórios';
                        break;
                    case '3':
                        descGrupo = 'Cama/Mesa/Banho';
                        break;
                    case '4':
                        descGrupo = 'Utilidades Do Lar';
                        break;
                    case '5':
                        descGrupo = 'Diversos';
                        break;
                    case '6':
                        descGrupo = 'Artigos Esportivos';
                        break;
                    case '7':
                        descGrupo = 'Cosméticos';
                        break;
                    case '8':
                        descGrupo = 'Acessórios';
                        break;
                    case '9':
                        descGrupo = 'Peças Íntimas';
                        break;
                    case '10':
                        descGrupo = 'Inverno';
                        break;
                }

                
            }
            query += `AND v2.GRUPO IN (${descGrupo}) `;
        }

        if(idGrade) {
            query += ' AND v2.IDSUBGRUPO = ?';
            params.push(idGrade);
        }

        if(idMarcaProduto) {
            query += ' AND v2.IDMARCA = ?';
            params.push(idMarcaProduto);
        }

        query += `GROUP BY v2.GRUPO, v2.SUBGRUPO, v2.MARCA, v3.NUCODBARRAS, v3.DSNOME, V2.CPROD `;
        query += `ORDER BY v2.CPROD`;


        const result = await conn.exec(query, params); 
        const rows = Array.isArray(result) ? result : [];
       
        const data = await Promise.all(rows.map(async (registro) => ({
            vendaMarca: {
                GRUPO: registro.GRUPO,
                SUBGRUPO: registro.SUBGRUPO,
                MARCA: registro.MARCA,
                NUCODBARRAS: registro.NUCODBARRAS,
                DSNOME: registro.DSNOME,
                QTD: registro.QTD,
                VRTOTALLIQUIDO: registro.VRTOTALLIQUIDO,
                TOTALCUSTO: registro.TOTALCUSTO,
                TOTALBRUTO: registro.TOTALBRUTO,
                TOTALDESCONTO: registro.TOTALDESCONTO,
                TOTALCOMPRADO: registro.TOTALCOMPRADO,
            },
            qtdVoucher: await getObterVouchersProduto(registro.CPROD, '2021-01-01', dataPesquisaFim),
            qtdEntradaSaida: await getObterEntradaProduto(registro.CPROD, '2021-01-01', dataPesquisaFim),
            qtdVendaB: await getObterVendaPeriodo(registro.CPROD, dataPesquisaInicioB, dataPesquisaFimB),
            qtdVendaC: await getObterVendaPeriodo(registro.CPROD, dataPesquisaInicioC, dataPesquisaFimC),
            pedido: await getObterPedidoProduto(registro.CPROD, dataPesquisaInicio, dataPesquisaFimC),
            estoque101: await getObterEstoqueLoja1(registro.CPROD)
        })));
        
        return {
            page: page,  
            pageSize: pageSize, 
            rows: data.length,
            data: data
        };
    } catch (error) {
        throw new Error(`Error executar consulta Vendas Estoque Produto: ${error.message}`);
    }
};