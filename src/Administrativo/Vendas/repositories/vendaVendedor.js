import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getLinhasDoTotalVendido = async (numeroMatricula, idEmpresa, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        let query = ` 
            SELECT 
                SUM(tbvd.VRTOTALLIQUIDO) AS TOTALVENDIDOVENDEDOR, 
                SUM(tbvd.QTD) AS QTDVENDIDOVENDEDOR 
            FROM 
                "${databaseSchema}".VENDADETALHE tbvd 
                LEFT JOIN "${databaseSchema}".VENDA tbv ON tbvd.IDVENDA = tbv.IDVENDA 
            WHERE 
                tbvd.VENDEDOR_MATRICULA = ?
                AND tbv.STCANCELADO = 'False'  
                AND tbvd.STCANCELADO = 'False'  
                AND tbv.IDEMPRESA = ? 
                AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)
        `;

        const params = [numeroMatricula, idEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        
        return result.length > 0 ? result[0] : { TOTALVENDIDOVENDEDOR: 0, QTDVENDIDOVENDEDOR: 0 };
    } catch (error) {
        console.error('Erro ao executar a consulta de vendas:', error);
        throw error;
    }
};

export const getLinhasDoTotalVoucher = async (numeroMatricula, idEmpresa, dataPesquisaInicio, dataPesquisaFim) => {
    try {
        let query = ` 
            SELECT DISTINCT 
                tbv.IDVENDA,
                tbv.VRRECVOUCHER AS TOTALVOUCHERVENDEDOR 
            FROM 
                "${databaseSchema}".VENDADETALHE tbvd 
                INNER JOIN "${databaseSchema}".VENDA tbv ON tbvd.IDVENDA = tbv.IDVENDA 
            WHERE 
                tbvd.VENDEDOR_MATRICULA = ?
                AND tbv.STCANCELADO = 'False'  
                AND tbvd.STCANCELADO = 'False'  
                AND tbv.VRRECVOUCHER > 0 
                AND tbv.IDEMPRESA = ? 
                AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)
        `;

        const params = [numeroMatricula, idEmpresa, `${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`];
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        let vrTotalVoucher = 0;
        for (const det of result) {
            vrTotalVoucher += parseFloat(det.TOTALVOUCHERVENDEDOR);
        }

   
        return vrTotalVoucher;
    } catch (error) {
        console.error('Erro ao executar a consulta de vouchers:', error);
        throw error;
    }
};

export const getVendaVendedor = async (idVenda, idGrupo, idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize) => {
    try {
    page = page && !isNaN(page) ? parseInt(page) : 1;
    pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

    let query = `
        SELECT 
            DISTINCT tbvd.VENDEDOR_MATRICULA, 
            tbf.NOLOGIN, 
            TRIM(tbvd.VENDEDOR_NOME) AS VENDEDOR_NOME, 
            TRIM(tbvd.VENDEDOR_CPF) AS VENDEDOR_CPF, 
            TBE.IDEMPRESA, 
            TBE.NOFANTASIA 
        FROM 
            "${databaseSchema}".VENDADETALHE tbvd 
            INNER JOIN "${databaseSchema}".FUNCIONARIO tbf ON tbvd.VENDEDOR_MATRICULA = tbf.IDFUNCIONARIO 
            INNER JOIN "${databaseSchema}".VENDA tbv ON tbvd.IDVENDA = tbv.IDVENDA 
            INNER JOIN "${databaseSchema}"."EMPRESA" TBE on tbv.IDEMPRESA=TBE.IDEMPRESA 
        WHERE 
            1 = 1 
            AND tbv.STCANCELADO = 'False' 
            AND tbvd.STCANCELADO = 'False'
    `;
    
    
    const params = [];

    if (idVenda) {
        query += ' AND tbv.IDVENDA = ?';
        params.push(idVenda);
    }

    if (idGrupo > 0) {
        query += ' AND TBE.IDGRUPOEMPRESARIAL = ?';
        params.push(idGrupo);
    }

    if (idEmpresa > 0) {
        query += ` AND tbv.IDEMPRESA IN (${idEmpresa})`;
    }

    if (dataPesquisaInicio && dataPesquisaFim) {
        query += ' AND (tbv.DTHORAFECHAMENTO BETWEEN ? AND ?)';
        params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
    }

    query += `
        GROUP BY 
            tbvd.VENDEDOR_MATRICULA, 
            tbf.NOLOGIN, 
            tbvd.VENDEDOR_NOME, 
            tbvd.VENDEDOR_CPF, 
            TBE.IDEMPRESA, 
            TBE.NOFANTASIA 
        ORDER BY 
            TBE.IDEMPRESA, 
            TBE.NOFANTASIA, 
            tbvd.VENDEDOR_MATRICULA
    `;

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);
    
        if(!Array.isArray(result) || result.length === 0) return [];

        const data = await Promise.all(result.map(async (registro) => {
            const totalVendido = await getLinhasDoTotalVendido(
                registro.VENDEDOR_MATRICULA, 
                registro.IDEMPRESA, 
                dataPesquisaInicio, 
                dataPesquisaFim
            );

            const totalVoucher = await getLinhasDoTotalVoucher(
                registro.VENDEDOR_MATRICULA, 
                registro.IDEMPRESA, 
                dataPesquisaInicio, 
                dataPesquisaFim
            );

            return {
                vendedor: {
                    VENDEDOR_MATRICULA: registro.NOLOGIN,
                    VENDEDOR_NOME: registro.VENDEDOR_NOME,
                    VENDEDOR_CPF: registro.VENDEDOR_CPF,
                    NOFANTASIA: registro.NOFANTASIA
                },
                totalVendido: totalVendido,
                Vouchers: totalVoucher
            };
        }));
       
        return {
            page,
            pageSize,
            rows: data.length,
            data: data
        }
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
};


export const updateVendaVendedor = async (bodyJson) => {
    const registro = bodyJson[0];
    let matFuncionario = '';
    let nomeFuncionario = '';
    let cpfFuncionario = '';

    try {
        if (registro.IDVENDEDOR === 0) {
            matFuncionario = 0;
            nomeFuncionario = 'LOJA';
            cpfFuncionario = '00000000000';
        } else {
            const queryFunc = `
                SELECT IDFUNCIONARIO, NOFUNCIONARIO, NUCPF 
                FROM "${process.env.HANA_DATABASE}".FUNCIONARIO 
                WHERE ID = ? 
                ORDER BY ID
            `;
            const statementFunc = await conn.prepare(queryFunc);
            const resultFunc = await statementFunc.exec([registro.IDVENDEDOR]);

            if (resultFunc.length > 0) {
                matFuncionario = parseInt(resultFunc[0].IDFUNCIONARIO);
                nomeFuncionario = resultFunc[0].NOFUNCIONARIO;
                cpfFuncionario = resultFunc[0].NUCPF;
            }
        }

        for (let i = 0; i < registro.IDVENDADETALHE.length; i++) {
            const query = `
                UPDATE "${process.env.HANA_DATABASE}".VENDADETALHE SET 
                "VENDEDOR_MATRICULA" = ?, 
                "VENDEDOR_NOME" = ?, 
                "VENDEDOR_CPF" = ? 
                WHERE "IDVENDADETALHE" = ?
            `;
            const statement = await conn.prepare(query);
            await statement.exec([matFuncionario, nomeFuncionario, cpfFuncionario, registro.IDVENDADETALHE[i]]);
        }

        await conn.commit();
        return { msg: "Atualização realizada com sucesso!" };
    } catch (error) {
        console.error('Erro ao atualizar venda vendedor:', error);
        throw error;
    }
};