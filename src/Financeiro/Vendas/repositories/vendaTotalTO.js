import conn from '../../../config/dbConnection.js';
import 'dotenv/config';

const databaseSchema = process.env.HANA_DATABASE;

export const getVendaTotalTO = async (dataPesquisa, idGrupo, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page, 10) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize, 10) : 1000;

        const offset = (page - 1) * pageSize;

        let query = `
            SELECT 
                tbe.IDGRUPOEMPRESARIAL,
                tbe.IDEMPRESA, 
                tbe.NOFANTASIA, 
                IFNULL(SUM(tbv.VRRECDINHEIRO + tbv.VRRECCARTAO + tbv.VRRECPOS + tbv.VRRECCONVENIO), 0) AS VALORTOTALVENDA 
            FROM 
                "${databaseSchema}".VENDA tbv 
            INNER JOIN 
                "${databaseSchema}".EMPRESA tbe 
            ON 
                tbe.IDEMPRESA = tbv.IDEMPRESA 
            WHERE 
                1 = ?
            AND 
                tbv.STCANCELADO = 'False'
        `;

        const params = [1];

        if (dataPesquisa) {
            query += `
                AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)
            `;
            params.push(`${dataPesquisa} 00:00:00`, `${dataPesquisa} 23:59:59`);
        }

        if (idGrupo) {
            query += `
                AND tbe.IDGRUPOEMPRESARIAL = ?
            `;
            params.push(idGrupo);
        }

        query += `
            GROUP BY 
                tbe.IDGRUPOEMPRESARIAL, 
                tbe.IDEMPRESA, 
                tbe.NOFANTASIA
            ORDER BY 
                VALORTOTALVENDA DESC
            LIMIT ? OFFSET ?
        `;

        params.push(pageSize, offset);

        const statement = await conn.prepare(query);
        const result = await statement.execute(params);


        return {
            page,
            pageSize,
            rows: result.length,
            data: result,
        };
    } catch (e) {
        console.error('Erro ao consultar vendas totais: ', e);
        throw new Error('Erro ao consultar vendas totais: ' + e.message);
    }
};