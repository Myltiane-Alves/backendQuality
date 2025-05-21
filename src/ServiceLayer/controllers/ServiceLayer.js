import axios from "axios";
import { getConsultaFornecedorSap } from "../repositories/PedidoCompra/PorCodigo/consultaFornecedorSap.js";
import { createMigracaoProdutos, updateMigracaoProdutos } from "../PedidoCompra/PorCodigo/IncluirAtualizar/Produto.js";
import { updateMigracaoPedidoCompra } from "../PedidoCompra/PorCodigo/pedidoCompra.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;

class ServiceLayerControllers  {
    async getListaConsultaFornecedorSap(req, res) {
        let { byId, descFornecedor, cnpjFornecedor, cnpjFornecedorSemFormatar, page, pageSize } = req.query;
            byId = byId ? byId : '';
            descFornecedor = descFornecedor ? descFornecedor : '';
            cnpjFornecedor = cnpjFornecedor ? cnpjFornecedor : '';
            cnpjFornecedorSemFormatar = cnpjFornecedorSemFormatar ? cnpjFornecedorSemFormatar : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/service-layer/pedido-compra/por-codigo/consulta-fornecedor-sap.xsjs?descFornecedor=${descFornecedor}&cnpjfor=${cnpjFornecedor}&cnpjforsemformat=${cnpjFornecedorSemFormatar}`;
            const response = await axios.get(apiUrl)
            // const response = await getConsultaFornecedorSap(byId, descFornecedor, cnpjFornecedor, cnpjFornecedorSemFormatar, page, pageSize)
            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

     
    async putMigracaoProdutos(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateMigracaoProdutos(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller de Cadastro - putMigracaoProdutos:", error);
            return res.status(500).json({ error: error.message });
        }
    }
    
    async putMigracaoPedidoCompra(req, res) {
        let { idResumoPedido } = req.query;

        if(idResumoPedido) {

            try {
                
                const response = await updateMigracaoPedidoCompra(idResumoPedido)
                return res.json(response);
            } catch (error) {
                console.error("erro no controller de ServiceLayerController - putMigracaoPedidoCompra:", error);
                return res.status(500).json({ error: error.message });
            }
        } else {
            return res.status(400).json({ error: 'idResumoPedido não informado!' });
        }
    }

    async postMigracaoProdutos(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  createMigracaoProdutos(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller de Cadastro - postMigracaoProdutos:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async postMigracaoFornecedor(req, res) {
        let { codProdutoPedido } = req.query;

        if(codProdutoPedido) {

            try {
                const apiUrl = `${url}/api/service-layer/pedido-compra/por-codigo/incluir-atualizar/produto-pedido.xsjs?codProdPedido=${codProdutoPedido}`;
                const response = await axios.post(apiUrl)
                return res.json(response.data);
            } catch (error) {
                console.error("erro no controller de ServiceLayerController - postMigracaoFornecedor:", error);
                return res.status(500).json({ error: error.message });
            }
        } else {
            return res.status(400).json({ error: 'Código do Produto Pedido não informado!' });
        }
    }
    
}

export default new ServiceLayerControllers();