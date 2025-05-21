import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDescontoMotivoVendas = async (
    idEmpresa, idGrupo, dataPesquisaInicio, dataPesquisaFim, dsMotivoDesc, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        let query = ` 
            SELECT
                V.IDVENDA as "NumeroVenda",
                V.IDEMPRESA,
                E.NOFANTASIA,
                E.IDSUBGRUPOEMPRESARIAL,
                V.DTHORAFECHAMENTO,
                TO_VARCHAR( V.DTHORAFECHAMENTO,'DD/MM/YYYY HH24:MI:SS') AS DTLANCAMENTO,
                (select FIRST_VALUE(T1.NOFUNCIONARIO ORDER BY T1.NOFUNCIONARIO) FROM ${databaseSchema}.FUNCIONARIO T1 WHERE T1.NUCPF = V.DEST_CPF) AS NOFUNCIONARIO, 
                IFNULL (F.NUCPF,V.DEST_CPF) AS NUCPF,
                V.NFE_INFNFE_TOTAL_ICMSTOT_VPROD AS VPROD,
                V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC AS VDESC,
                V.NFE_INFNFE_TOTAL_ICMSTOT_VNF AS VNF,
                V.VRRECDINHEIRO,
                V.VRRECCARTAO,
                V.VRRECPOS,
                V.VRRECCHEQUE,
                V.VRRECVOUCHER,
                V.VRRECCONVENIO,
                V.NFE_INFNFE_TOTAL_ICMSTOT_VPROD AS VRBRUTO,
                V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC AS VRDESCONTO,
                V.VRTOTALPAGO AS VRLIQUIDO,
                V.DEST_CPF
            FROM
                "${databaseSchema}"."VENDA" V 
        `;

 
        const params = [1];
        
        if (dsMotivoDesc == 'Convenio') {
            query = `
                SELECT DISTINCT 
                    V.IDVENDA as "NumeroVenda",
                    V.IDEMPRESA, 
                    tbe.NOFANTASIA, 
                    tbe.IDSUBGRUPOEMPRESARIAL, 
                    V.DTHORAFECHAMENTO,
                    TO_VARCHAR( V.DTHORAFECHAMENTO,'DD/MM/YYYY HH24:MI:SS') AS DTLANCAMENTO,
                    (select FIRST_VALUE(T1.NOFUNCIONARIO ORDER BY T1.NOFUNCIONARIO) FROM "${databaseSchema}".FUNCIONARIO T1 WHERE T1.NUCPF = TBDET.NRCPF) AS NOFUNCIONARIO,  
                    IFNULL (tbf.NUCPF,tbdet.NRCPF) AS NUCPF, 
                    tbdet.IDLOJA,
                    V.NFE_INFNFE_TOTAL_ICMSTOT_VPROD AS VPROD,
                    V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC AS VDESC,
                    V.NFE_INFNFE_TOTAL_ICMSTOT_VNF AS VNF,
                    V.VRRECDINHEIRO,
                    V.VRRECCARTAO,
                    V.VRRECPOS,
                    V.VRRECCHEQUE,
                    V.VRRECVOUCHER,
                    V.VRRECCONVENIO,
                    V.NFE_INFNFE_TOTAL_ICMSTOT_VPROD AS VRBRUTO,
                    Round(V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC,2) AS VRDESCONTO,
                    (select LAST_VALUE(T1.VRLIQUIDO ORDER BY T1.VRLIQUIDO) FROM  "${databaseSchema}".DETLANCCONVENIO T1 WHERE T1.IDRESUMOVENDAWEB = V.IDVENDA) AS VRLIQUIDO 
                FROM
                    (SELECT IDRESUMOVENDAWEB, NRCPF, VRLIQUIDO, IDLOJA, VRBRUTO FROM  "${databaseSchema}".DETLANCCONVENIO WHERE STCANCELADO = 'False' GROUP BY IDRESUMOVENDAWEB, NRCPF, VRLIQUIDO, IDLOJA, VRBRUTO) tbdet
                    INNER JOIN (SELECT NUCPF FROM  "${databaseSchema}".FUNCIONARIO GROUP BY NUCPF) tbf ON tbdet.NRCPF = tbf.NUCPF
                    INNER JOIN  "${databaseSchema}".VENDA V  ON tbdet.IDRESUMOVENDAWEB =  V.IDVENDA
                    INNER JOIN  "${databaseSchema}".EMPRESA tbe ON V.IDEMPRESA =  tbe.IDEMPRESA  
            `;
         
        }

        

        if (dsMotivoDesc == 'Desconto Funcionario') {
            query += ` LEFT JOIN (SELECT * FROM "${databaseSchema}".FUNCIONARIO LIMIT 1 ) F ON V.DEST_CPF IN (F.NUCPF) `;
         
        }

        query += `   
            LEFT JOIN "${databaseSchema}".FUNCIONARIO FC ON 
                V.IDOPERADOR = FC.IDFUNCIONARIO
            INNER JOIN "${databaseSchema}".EMPRESA E ON 
                E.IDEMPRESA = V.IDEMPRESA   
        `;

        query += `
            WHERE 1 = ? AND V."STCANCELADO"='False'
        `;

        if (idEmpresa > 0) {
            query += ' AND V.IDEMPRESA = ?';
            params.push(idEmpresa);
        }

        if (idGrupo > 0) {
            query += ' AND E.IDGRUPOEMPRESARIAL = ?';
            params.push(idGrupo);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND (TO_DATE(V.DTHORAFECHAMENTO) BETWEEN ? AND ?)';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }

        if (dsMotivoDesc == 'Desconto Funcionario') {
            query += ` 
                AND V."NFE_INFNFE_TOTAL_ICMSTOT_VDESC" > 0
                AND IFNULL(V.VRRECCONVENIO, 0) = 0 
                AND  TO_VARCHAR(V.TXTMOTIVODESCONTO) LIKE 'Desconto efetuado por Colaborador%'
            `;
        } else {
            query += 'AND IFNULL(V.VRRECCONVENIO, 0) > 0';
            
        }

        query += ' ORDER BY V.IDEMPRESA, V.DTHORAFECHAMENTO ';
        
        const offset = (page - 1) * pageSize;
        query += ' LIMIT ? OFFSET ?';
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
        console.error('Erro ao executar a consulta venda forma pagamento:', error);
        throw error;
    }
};



// export const getDescontoMotivoVendas = async (
//     idEmpresa, idGrupo, dataPesquisaInicio, dataPesquisaFim, dsMotivoDesc, page, pageSize
// ) => {
//     try {
//         page = page && !isNaN(page) ? parseInt(page) : 1;
//         pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
//         const offset = (page - 1) * pageSize;

//         let query = `
//             SELECT
//                 V.IDVENDA as "NumeroVenda",
//                 V.IDEMPRESA,
//                 E.NOFANTASIA,
//                 E.IDSUBGRUPOEMPRESARIAL,
//                 V.DTHORAFECHAMENTO,
//                 TO_VARCHAR(V.DTHORAFECHAMENTO, 'DD/MM/YYYY HH24:MI:SS') AS DTLANCAMENTO,
//                 (SELECT FIRST_VALUE(T1.NOFUNCIONARIO ORDER BY T1.NOFUNCIONARIO) 
//                  FROM ${databaseSchema}.FUNCIONARIO T1 
//                  WHERE T1.NUCPF = V.DEST_CPF) AS NOFUNCIONARIO, 
//                 IFNULL(F.NUCPF, V.DEST_CPF) AS NUCPF,
//                 V.NFE_INFNFE_TOTAL_ICMSTOT_VPROD AS VPROD,
//                 V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC AS VDESC,
//                 V.NFE_INFNFE_TOTAL_ICMSTOT_VNF AS VNF,
//                 V.VRRECDINHEIRO,
//                 V.VRRECCARTAO,
//                 V.VRRECPOS,
//                 V.VRRECCHEQUE,
//                 V.VRRECVOUCHER,
//                 V.VRRECCONVENIO,
//                 V.NFE_INFNFE_TOTAL_ICMSTOT_VPROD AS VRBRUTO,
//                 V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC AS VRDESCONTO,
//                 V.VRTOTALPAGO AS VRLIQUIDO,
//                 V.DEST_CPF
//             FROM "${databaseSchema}"."VENDA" V
//             LEFT JOIN "${databaseSchema}"."FUNCIONARIO" F ON V.DEST_CPF = F.NUCPF
//             LEFT JOIN "${databaseSchema}"."EMPRESA" E ON E.IDEMPRESA = V.IDEMPRESA
//             WHERE V.STCANCELADO = 'False'
//         `;

//         const params = [];

//         // Filtro por empresa
//         if (idEmpresa > 0) {
//             query += ` AND V.IDEMPRESA = ? `;
//             params.push(idEmpresa);
//         }

//         // Filtro por grupo
//         if (idGrupo > 0) {
//             query += ` AND E.IDGRUPOEMPRESARIAL = ? `;
//             params.push(idGrupo);
//         }

//         // Filtro por data
//         if (dataPesquisaInicio && dataPesquisaFim) {
//             query += ` AND TO_DATE(V.DTHORAFECHAMENTO) BETWEEN ? AND ? `;
//             params.push(dataPesquisaInicio, dataPesquisaFim);
//         }

//         // Filtro por motivo do desconto
//         if (dsMotivoDesc === 'Desconto Funcionario') {
//             query += `
//                 AND V.NFE_INFNFE_TOTAL_ICMSTOT_VDESC > 0
//                 AND IFNULL(V.VRRECCONVENIO, 0) = 0
//                 AND TO_VARCHAR(V.TXTMOTIVODESCONTO) LIKE 'Desconto efetuado por Colaborador%'
//             `;
//         } else {
//             query += ` AND IFNULL(V.VRRECCONVENIO, 0) > 0 `;
//         }

//         query += ` ORDER BY V.IDEMPRESA, V.DTHORAFECHAMENTO `;
//         query += ` LIMIT ? OFFSET ? `;
//         params.push(pageSize, offset);

//         const [rows] = await conn.execute(query, params);
//         return rows;
        
//     } catch (error) {
//         console.error("Erro ao buscar vendas:", error);
//         throw new Error("Erro ao buscar vendas.");
//     }
// };
