import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getDetalhePromocaoAtiva = async (idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize) =>  {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;
        // Quais os parametros pra saber se a promoção é ativa ou não?
        let query = `
            SELECT 
                IDRESUMOPROMOCAOMARKETING, 
                DSPROMOCAOMARKETING, 
                DTHORAINICIO, 
                DTHORAFIM, 
                TPAPLICADOA,
                APARTIRDEQTD, 
                APARTIRDOVLR, 
                TPFATORPROMO, 
                FATORPROMOVLR, 
                FATORPROMOPERC, 
                TPAPARTIRDE, 
                VLPRECOPRODUTO, 
                STEMPRESAPROMO, 
                STDETPROMOORIGEM, 
                STDETPROMODESTINO    
            FROM ${databaseSchema}.RESUMOPROMOCAOMARKETING
            WHERE 
                1 = 1

        `;

        const params = [];

        if (idResumoPromocao) {
            query += ` AND IDRESUMOPROMOCAOMARKETING = ?`;
            params.push(idResumoPromocao);
        }

        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ` AND DTHORAINICIO BETWEEN ? AND ?`;
            params.push(dataPesquisaInicio + ' 00:00:00', dataPesquisaFim + ' 23:59:59');
        }

        query += ` ORDER BY IDRESUMOPROMOCAOMARKETING`;
      

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
        console.log('Erro ao consultar Promoções Ativas', error);
    }
}