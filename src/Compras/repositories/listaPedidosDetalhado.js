import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const getPedidosDetalhados = async (
    idResumoPedido,
    idDetalhePedido,
    dataPesquisaFim,
    dataPesquisaInicio,
    idMarca, 
    idFornecedor,
    idFabricante,
    page, 
    pageSize
) => {
    try {
       
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 1000;

        var query = `
        SELECT 
            tbdp.IDRESUMOPEDIDO AS IDPEDIDO,
            EMP.DSSUBGRUPOEMPRESARIAL AS NOFANTASIAGRUPO,
            FR.IDFORNECEDOR,
            FR.NORAZAOSOCIAL,
            FR.NOFANTASIA AS NOFANTASIAFORN,
            FC.NOFUNCIONARIO AS NOMECOMPRADOR,
            AD.DSANDAMENTO,
            AD.DSSETOR,
            SUM(tbdp.QTDTOTAL) AS QTDPRODTOTAL,
            SUM(tbdp.VRTOTAL) AS VRTOTALCUSTO,
            SUM(tbdp.VRVENDA * tbdp.QTDTOTAL) AS VRTOTALVENDA,
            SUM((tbdp.VRVENDA * tbdp.QTDTOTAL) - tbdp.VRTOTAL) AS VRTOTALLUCRO,
            TO_VARCHAR(tbrp.DTPEDIDO, 'DD-MM-YYYY HH24:MI:SS') AS DTPEDIDO
        FROM 
            "${databaseSchema}".DETALHEPEDIDO tbdp
            INNER JOIN "${databaseSchema}".RESUMOPEDIDO tbrp ON tbdp.IDRESUMOPEDIDO = tbrp.IDRESUMOPEDIDO
            INNER JOIN "${databaseSchema}".SUBGRUPOEMPRESARIAL EMP ON tbrp.IDSUBGRUPOEMPRESARIAL = EMP.IDSUBGRUPOEMPRESARIAL
            INNER JOIN "${databaseSchema}".FORNECEDOR FR ON tbrp.IDFORNECEDOR = FR.IDFORNECEDOR
            INNER JOIN "${databaseSchema}".FUNCIONARIO FC ON tbrp.IDCOMPRADOR = FC.IDFUNCIONARIO
            INNER JOIN "${databaseSchema}".ANDAMENTOS AD ON tbrp.IDANDAMENTO = AD.IDANDAMENTO
        WHERE 
            1 = ?
            AND tbrp.STCANCELADO = 'False' 
            AND tbdp.STCANCELADO = 'False'
    `;
       
        const params = [1];

        if(idDetalhePedido) {
            query += ' AND tbdp.IDDETALHEPEDIDO = ?';
            params.push(idDetalhePedido);
        }

        if(idResumoPedido) {
            query += ' AND tbdp.IDRESUMOPEDIDO = ?';
            params.push(idResumoPedido);
        }


        if (idMarca) {
            query += ' AND tbrp.IDSUBGRUPOEMPRESARIAL = ?';
            params.push(idMarca);
        }

        if (idFornecedor) {
            query += ' AND tbrp.IDFORNECEDOR = ?';
            params.push(idFornecedor);
        }

        if (idFabricante) {
            query += ` AND tbdp.IDFABRICANTE = ?`;
            params.push(idFabricante);
        }


        if (dataPesquisaInicio && dataPesquisaFim) {
            query += ' AND tbrp.DTPEDIDO BETWEEN ? AND ?';
            params.push(`${dataPesquisaInicio} 00:00:00`, `${dataPesquisaFim} 23:59:59`);
        }


        query += `GROUP BY tbdp.IDRESUMOPEDIDO,EMP.DSSUBGRUPOEMPRESARIAL, FR.IDFORNECEDOR, FR.NORAZAOSOCIAL, FR.NOFANTASIA, tbrp.DTPEDIDO, FC.NOFUNCIONARIO, AD.DSANDAMENTO, AD.DSSETOR `;
       
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
        console.error('Error executar a consulta lista de pedidos ', error);
        throw error;
    }
};
