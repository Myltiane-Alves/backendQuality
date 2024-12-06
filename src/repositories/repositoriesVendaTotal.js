// import { connParams, conn } from '../config/dbConnection.js';

// export const getVendas = async (
//     VRRECDINHEIRO,
//     VRRECCARTAO,
//     VRRECCONVENIO,
//     VRRECPOS,
//     VRRECVOUCHER,
//     VRRECBIDO,
//     VRDESPESA,
//     VRVALORDESCONTO,
//     dataPesquisa,
//     page,
//     pageSize
// ) => {
//     try {
//         const dbQuality = connParams.dbname;
//         const sql = `
//             SELECT
//                 IFNULL(SUM(tbv.VRRECDINHEIRO), 0) AS VALORTOTALDINHEIRO,
//                 IFNULL(SUM(tbv.VRRECCARTAO), 0) AS VALORTOTALCARTAO,
//                 IFNULL(SUM(tbv.VRRECCONVENIO), 0) AS VALORTOTALCONVENIO,
//                 IFNULL(SUM(tbv.VRRECPOS), 0) AS VALORTOTALPOS,
//                 IFNULL(SUM(tbv.VRRECVOUCHER), 0) AS VALORTOTALVOUCHER,
//                 (SELECT IFNULL(SUM(tbdf.VRRECEBIDO), 0) FROM QUALITY_CONC_HML.DETALHEFATURA tbdf WHERE tbdf.DTPROCESSAMENTO = ? AND tbdf.STCANCELADO = 'FALSE') AS VALORTOTALFATURA,
//                 (SELECT IFNULL(SUM(tbd.VRDESPESA), 0) FROM QUALITY_CONC_HML.DESPESALOJA tbd WHERE tbd.DTDESPESA = ? AND tbd.STCANCELADO = 'FALSE') AS VALORTOTALDESPESA,
//                 (SELECT IFNULL(SUM(tbas.VRVALORDESCONTO), 0) FROM QUALITY_CONC_HML.ADIANTAMENTOSALARIAL tbas WHERE tbas.DTLANCAMENTO = ? AND tbas.STATIVO = 'TRUE') AS VALORTOTALADIANTAMENTOSALARIAL
//             FROM
//                 ${dbQuality}.VENDA tbv
//             WHERE
//                 1 = 1 AND tbv.STCANCELADO = 'False'
//                 ${dataPesquisa ? ` AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)` : ''}
//             LIMIT ? OFFSET ?
//         `;

//         const params = [
//             dataPesquisa, dataPesquisa, dataPesquisa,
//             ...(dataPesquisa ? [`${dataPesquisa} 00:00:00`, `${dataPesquisa} 23:59:59`] : []),
//             pageSize,
//             (page - 1) * pageSize
//         ];

//         const statement = conn.prepare(sql);
//         const result = await statement.exec(params);

//         return result;
//     } catch (error) {
//         console.error('Erro ao executar a consulta Vendas Total:', error);
//         throw error;
//     }
// };
