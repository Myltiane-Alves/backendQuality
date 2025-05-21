import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getAlteracaoPrecoProduto = async (idProduto, idEmpresa, idGrupoEmpresarial, codBarras, descricaoProduto, dataUltimaAtualizacao, horaUltimaAtualizacao, page, pageSize) =>  {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        if(!idEmpresa) {
            query = `
                SELECT DISTINCT
                    TBP.IDPRODUTO,
                    (CASE 
                        WHEN TBP.IDGRUPOEMPRESARIAL IS NULL THEN 0 
                        ELSE TBP.IDGRUPOEMPRESARIAL 
                    END) AS IDGRUPOEMPRESARIAL,
                    (CASE 
                        WHEN TBGE.DSGRUPOEMPRESARIAL IS NULL THEN 'TODOS'
                        ELSE  TBGE.DSGRUPOEMPRESARIAL
                    END) AS GRUPOEMPRESARIAL,
                    TBP.DSNOME,
                    TBP.STGRADE,
                    TBP.UND,
                    TBP.NUCODBARRAS,
                    TBP.NUNCM,
                    TBP.PRECOCUSTO,
                    IFNULL(TBHP.PRECOVENDA, TBP.PRECOVENDA) AS PRECOVENDA,
                    TBP.NUREFERENCIA,
                    TBP.DTULTALTERACAO,
                    TBP.GRP_MATERIAIS,
                    TBP.STATIVO,
                    TBP.IDSUBGRUPO,
                    TBPEM.SUBGRUPO,
                    TBES.DSESTILO,
                    TBLE.DSLOCALEXPOSICAO,
                    TBPEM.MARCA
                FROM
                    "${databaseSchema}".HISTORICOPRODUTOLISTAPRECO TBHP
                RIGHT JOIN"${databaseSchema}".PRODUTO TBP ON
                    TBP.IDPRODUTO = TBHP.IDPRODUTO  AND TBHP.IDRESUMOLISTAPRECO = ${idGrupoEmpresarial} AND TBHP.STATIVO =  'True'
                LEFT JOIN "${databaseSchema}".VW_PRODUTO_ESTRUTURA_MERCADOLOGICA TBPEM ON
                    TBPEM.IDPRODUTO = TBP.IDPRODUTO
                LEFT JOIN "${databaseSchema}".GRUPOEMPRESARIAL TBGE ON
                    TBGE.IDGRUPOEMPRESARIAL = TBP.IDGRUPOEMPRESARIAL
                LEFT JOIN "${databaseSchema}".LOCALEXPOSICAO TBLE ON
                    TBLE.IDLOCALEXPOSICAO = TBP.IDLOCALEXPOSICAO
                LEFT JOIN "${databaseSchema}".ESTILOS TBES ON
                    TBES.IDESTILO = TBP.IDESTILO
                WHERE 
                    1 = ?`;
        } else {
            query = `
                SELECT DISTINCT
                    TBP.IDPRODUTO,
                    (CASE 
                        WHEN TBP.IDGRUPOEMPRESARIAL IS NULL THEN 0 
                        ELSE TBP.IDGRUPOEMPRESARIAL 
                    END) AS IDGRUPOEMPRESARIAL,
                    (CASE 
                        WHEN TBGE.DSGRUPOEMPRESARIAL IS NULL THEN 'TODOS'
                        ELSE  TBGE.DSGRUPOEMPRESARIAL
                    END) AS GRUPOEMPRESARIAL,
                    TBPP.IDEMPRESA,
                    TBEMP.NOFANTASIA,
                    TBP.DSNOME,
                    TBP.STGRADE,
                    TBP.UND,
                    TBP.NUCODBARRAS,
                    TBP.NUNCM,
                    TBP.PRECOCUSTO,
                    IFNULL(tbpp.PRECO_VENDA, tbp.PRECOVENDA ) AS PRECOVENDA,
                    TBP.NUREFERENCIA,
                    TBP.DTULTALTERACAO,
                    TBP.GRP_MATERIAIS,
                    TBP.STATIVO,
                    TBP.IDSUBGRUPO,
                    TBPEM.SUBGRUPO,
                    TBES.DSESTILO,
                    TBLE.DSLOCALEXPOSICAO,
                    TBPEM.MARCA
                FROM
                    "${databaseSchema}".PRODUTO_PRECO TBPP
                INNER JOIN "${databaseSchema}".PRODUTO TBP ON
                    TBPP.IDPRODUTO = TBP.IDPRODUTO
                LEFT JOIN "${databaseSchema}".VW_PRODUTO_ESTRUTURA_MERCADOLOGICA TBPEM ON
                    TBPEM.IDPRODUTO = TBP.IDPRODUTO
                LEFT JOIN "${databaseSchema}".GRUPOEMPRESARIAL TBGE ON
                    TBGE.IDGRUPOEMPRESARIAL = TBP.IDGRUPOEMPRESARIAL
                INNER JOIN "${databaseSchema}".EMPRESA TBEMP ON
                    TBPP.IDEMPRESA = TBEMP.IDEMPRESA
                LEFT JOIN "${databaseSchema}".LOCALEXPOSICAO TBLE ON
                    TBLE.IDLOCALEXPOSICAO = TBP.IDLOCALEXPOSICAO
                LEFT JOIN "${databaseSchema}".ESTILOS TBES ON
                    TBES.IDESTILO = TBP.IDESTILO
                WHERE 
                    TBPP.IDEMPRESA = ${idEmpresa}
                    AND 1 = ?
            `;
        }

        const params = [1];

        if (idProduto) {
            query += ` AND TBP.IDPRODUTO = ?`;
            params.push(idProduto);
        }

        if (dataUltimaAtualizacao && horaUltimaAtualizacao) {
            query += ` And  tbp.DTULTALTERACAO >=  ${dataUltimaAtualizacao}  ${horaUltimaAtualizacao || '00:00:00'} `;
        }

        if(idGrupoEmpresarial || (idEmpresa ==='31' || idEmpresa ==='109' || idEmpresa ==='56' || idEmpresa ==='90' || idEmpresa ==='68' || idEmpresa ==='70' || idEmpresa ==='5' || idEmpresa ==='51' || idEmpresa ==='86')){
            idGrupoEmpresarial = idGrupoEmpresarial || null
            
            if(idEmpresa ==='31' || idEmpresa ==='109'){
                query += `AND (TBP.IDGRUPOEMPRESARIAL = ${idGrupoEmpresarial} OR TBP.IDGRUPOEMPRESARIAL = 0 OR TBP.IDGRUPOEMPRESARIAL IS NULL OR TBP.IDGRUPOEMPRESARIAL = 1 OR TBP.IDGRUPOEMPRESARIAL = 2)`;
                
            }else if(idEmpresa ==='90' || idEmpresa ==='56' || idEmpresa ==='68' || idEmpresa ==='70' || idEmpresa ==='5' || idEmpresa ==='86'){
                query += `AND (TBP.IDGRUPOEMPRESARIAL = ${idGrupoEmpresarial} OR TBP.IDGRUPOEMPRESARIAL = 0 OR TBP.IDGRUPOEMPRESARIAL IS NULL OR TBP.IDGRUPOEMPRESARIAL = 1 OR TBP.IDGRUPOEMPRESARIAL = 4)`;
            }else if(idEmpresa ==='51'){
                query += `AND (TBP.IDGRUPOEMPRESARIAL = ${idGrupoEmpresarial} OR TBP.IDGRUPOEMPRESARIAL = 0 OR TBP.IDGRUPOEMPRESARIAL IS NULL OR TBP.IDGRUPOEMPRESARIAL = 1 OR TBP.IDGRUPOEMPRESARIAL = 2 OR TBP.IDGRUPOEMPRESARIAL = 4)`;
            }else{
                query += `AND (TBP.IDGRUPOEMPRESARIAL = ${idGrupoEmpresarial} OR TBP.IDGRUPOEMPRESARIAL = 0 OR TBP.IDGRUPOEMPRESARIAL IS NULL)`; 
            }
        }
    
        
        if (codBarras) {
            query += ` AND TBP.NUCODBARRAS = ?`;
            params.push(codBarras);
        }

        if (descricaoProduto) {
            const searchTerm = descricaoProduto.split(' ').join('%');
            query += ` AND  CONTAINS((tbp.DSNOME, tbp.NUCODBARRAS), '%${searchTerm}%')`;
        }

        query += ` ORDER BY ${idGrupoEmpresarial === 'TODAS_FILIAIS' ? 'TBEMP.IDEMPRESA, TBP.IDPRODUTO' : idGrupoEmpresarial ? 'TBP.IDGRUPOEMPRESARIAL' : 'TBP.IDPRODUTO'}`;

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
        console.log('Erro ao consultar alteração Preço Produtos: ', error);
    }
}
