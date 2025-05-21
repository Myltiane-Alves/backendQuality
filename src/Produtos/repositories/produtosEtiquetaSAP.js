import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
const databaseSchemaSBO = process.env.HANA_DATABASE_SBO;

export const getProdutosEtiquetaSap = async (byId, idLista, descProd, codeBars, page, pageSize) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        
        let query = `
            SELECT
                XA."ItemCode" AS IDPRODUTO,
                XA."CodeBars" AS NUCODBARRAS,
                XA."ItemName" AS DSNOME,
                XA."Price" as PRECOVENDA,
                XA."Tamanho" AS TAMANHO,
                XA."Grupo" AS GRUPO,
                XA."Estilo" AS DSESTILO,
                XA."local" AS DSLOCALEXPOSICAO,
                XA."ListName" AS DSLISTAPRECO,
                XA."FirmName" AS MARCA
            FROM
            (
                SELECT
                A."ItemCode",
                A."U_IS_EAN_GTO" AS "CodeBars",
                A."ItemName",
                CAST(B."Price" AS decimal) AS "Price",
                K."ListName",
                CASE
                	WHEN IFNULL(H."DSTAMANHO", '') <> '' THEN H."DSTAMANHO"
                	WHEN IFNULL(H."DSTAMANHO", '') = '' AND IFNULL(A."U_TAM", '') <> '' THEN A."U_TAM"
                	ELSE (
                		SELECT
                			"Name"
                		FROM
                			${databaseSchemaSBO}."@OTB_ESCALA_TAMANHO" XA
                		WHERE
                			TO_CHAR(XA."Code") = TO_CHAR(A."U_CodigoDoTamanho")
                	)
                END AS "Tamanho",
                1 AS "Quantity",
                CASE
                	WHEN A."U_GRP_EMP" = 1 THEN 'Tesoura'
                	WHEN A."U_GRP_EMP" = 2 THEN 'Magazine'
                	WHEN A."U_GRP_EMP" = 3 THEN 'Yorus'
                	WHEN A."U_GRP_EMP" = 4 THEN 'Free Center'
                END AS "Grupo",
                CASE
                    WHEN IFNULL(F.DSESTILO, '') <> '' AND IFNULL(C."Estilo", '') = '' THEN D."U_Desc" || '-' || F.DSESTILO
                    WHEN IFNULL(C."Estilo" , '') <> '' AND IFNULL(F.DSESTILO, '') = '' THEN C."Estilo"
                    WHEN TBG.IDGRUPOESTRUTURA = 9 THEN 'Intimo' || '-' || D."U_Desc" || '-' || F.DSESTILO
                    WHEN IFNULL(F. DSESTILO, '') <> '' AND IFNULL(UPPER(F.DSESTILO), '') <> 'NENHUM' AND IFNULL(C."Estilo" , '') <> '' THEN D."U_Desc"  || '-' || F.DSESTILO
                    ELSE D."U_Desc"
                END "Estilo",
                IFNULL(A."U_LOCAL", G."DSLOCALEXPOSICAO") AS "local",
                L."FirmName"
                FROM
                    ${databaseSchemaSBO}.OITM A
                LEFT JOIN ${databaseSchemaSBO}.ITM1 B ON
                    B."ItemCode" = A."ItemCode"
                LEFT JOIN ${databaseSchemaSBO}."VW_ESTILO_ETIQUETA" C ON
                    C."ItemCode" = A."ItemCode"
                LEFT JOIN ${databaseSchemaSBO}.OITB D ON
                    A."ItmsGrpCod" = D."ItmsGrpCod"
                LEFT JOIN "${databaseSchema}"."PRODUTO" E ON
                    A."ItemCode" = E."IDPRODUTO"
                LEFT JOIN "${databaseSchema}"."ESTILOS" F ON
                    E."IDESTILO" = F."IDESTILO"
                LEFT JOIN "${databaseSchema}"."LOCALEXPOSICAO" G ON
                    E."IDLOCALEXPOSICAO" = G."IDLOCALEXPOSICAO"
                LEFT JOIN "${databaseSchema}"."TAMANHO" H ON
                    E."IDTAMANHO" = H."IDTAMANHO"
                LEFT JOIN "${databaseSchema}".SUBGRUPOESTRUTURA I ON
                    E.IDSUBGRUPO = I.IDSUBGRUPOESTRUTURA
                LEFT JOIN "${databaseSchema}".GRUPOESTRUTURA TBG ON
                    I.IDGRUPOESTRUTURA = TBG.IDGRUPOESTRUTURA
                LEFT JOIN ${databaseSchemaSBO}.OITB J ON
                    I.IDSAP = J."ItmsGrpCod"
                INNER JOIN ${databaseSchemaSBO}.OPLN K ON 
                    B."PriceList" = K."ListNum"
                INNER JOIN ${databaseSchemaSBO}.OMRC L ON
                    A."FirmCode" = L."FirmCode"
                WHERE
                    A."U_IS_EAN_GTO" IS NOT NULL
                    AND A."ItmsGrpCod" NOT IN (100, 134)
                    AND A."FirmCode" NOT IN (1583)
                    AND 1 = ? 
        `;

        const params = [1];

        if (byId) {
            query += `AND A."ItemCode" =  ?`;
            params.push(byId);
        }

        if (idLista) {
            query += `AND B."PriceList" =  ?`;
            params.push(idLista);
        }

        if(descProd) {
            descProd = descProd.trim().toUpperCase();
            descProd = descProd.split(' ').join('%');
            query += `AND UPPER(A."ItemName") LIKE '%${descProd}%'`
        }

        if(codeBars) {
            codeBars = codeBars.trim();
            query += ` AND A."CodeBars" = '${codeBars}' `;
        }

        query += ` ORDER BY "ItemName" ASC ) XA `;
       
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
        console.error('Error executar a consulta Lista de Produtos Etiqueta Sap', error);
        throw error;
    }
};