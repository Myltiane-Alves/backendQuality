import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { createDetalheProdutoPedido, updateDetalheProdutoPedido } from "../repositories/cadastrarProdutoAvulso.js";
import { getProduto } from "../repositories/consultaProduto.js";
import { getNFPedido } from "../repositories/nfPedido.js";
import { getProdutosPedidos } from "../repositories/cadastrarProdutoPedido.js";
import { getCategorias } from "../repositories/categorias.js";
import { getItemPedido } from "../repositories/editarItemPedido.js";

import { updateProdutoPedido } from "../repositories/cadastrarProduto.js";
import { getDetalheProdutoPedidos } from "../repositories/listaDetalheProdutoPedidos.js";
import { getVinculoNFPedidos } from "../repositories/vinculo-NFPedidos.js";
import { getVinculaNFPedido, deleteDadosVinculados, updateVinculoNFEPedido } from "../repositories/vinculaNFPedido.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;

class CadastroControllers  {

    
    async getListaProdutoCriadoPedidoCompra(req, res) {
        let { idDetalhePedidoProduto, idResumoPedido, idDetalhePedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, page, pageSize } = req.query;
            idDetalhePedidoProduto = idDetalhePedidoProduto ? idDetalhePedidoProduto : '';
            idResumoPedido = idResumoPedido ? idResumoPedido : '';
            idDetalhePedido = idDetalhePedido ? idDetalhePedido : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : ''; 
            dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
            idMarca = idMarca ? idMarca : '';
            idFornecedor = idFornecedor ? idFornecedor : '';
            idFabricante = idFabricante ? idFabricante : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {
            const apiUrl = `${url}/api/cadastro/cadastrar-produto-pedido.xsjs?iResPedido=${idResumoPedido}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
            // const response = await axios.get(apiUrl)
            const response = await getProdutosPedidos(idDetalhePedidoProduto, idResumoPedido, idDetalhePedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, page, pageSize)
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    
    async getListaCategoriasProduto(req, res) {
        let { idCategorias, descricao, tipoPedido, page, pageSize } = req.query;
            idCategorias = idCategorias ? idCategorias : '';
            descricao = descricao ? descricao : '';
            tipoPedido = tipoPedido ? tipoPedido : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        
        
        try {
            // const apiUrl = `${url}/api/cadastro/categorias.xsjs?idtipopedido=${idTipoPedido}`;
            // const response = await axios.get(apiUrl)
            const response = await getCategorias(idCategorias, descricao, tipoPedido, page, pageSize)
            return res.json(response); 
        } catch(error) {
            console.error("Erro no controller de Cadastro - getListaCategoriasProduto:", error);
            throw error;
        } 
    }
    
    async getListaProdutosAvulso(req, res) {
        let { 
            idDetalhePedidoProduto,
            descricao,
            codBarras,
            dataPesquisaFim,
            dataPesquisaInicio,
            page, 
            pageSize
        } = req.query;
        
        idDetalhePedidoProduto = idDetalhePedidoProduto ? idDetalhePedidoProduto : '';
        codBarras = codBarras ? codBarras : '';
        descricao = descricao ? descricao : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : ''; 
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            const apiUrl = `${url}/api/cadastro/cadastrar-produto-avulso.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&DescProdAv=${descricao}&BarrasProdAv=${codBarras}&idDetalhePedidoProduto=${idDetalhePedidoProduto}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    async getListaTipoProdutos(req, res) {
        let { } = req.query;

        try {
            const apiUrl = `${url}/api/cadastro/tipoproduto.xsjs?`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    async getListaTipoFiscalProdutos(req, res) {
        let { } = req.query;

        try {
            const apiUrl = `${url}/api/cadastro/tipofiscalproduto.xsjs?`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    
    async getConsultaProdutos(req, res) {
        let { descricaoProduto, page, pageSize } = req.query;
        descricaoProduto = descricaoProduto ? descricaoProduto : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/cadastro/consulta_produtos.xsjs?`;
            // const response = await axios.get(apiUrl)
            const response = await getProduto(descricaoProduto, page, pageSize);
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async getListaNFPedido(req, res) {
        let { idPedido, idResumoEntrada, idFonecedor, numSerie, numNFE, dataPesquisaInicio, dataPesquisaFim, stTransformado, page, pageSize } = req.query;
        idPedido = idPedido ? idPedido : '';
        idResumoEntrada = idResumoEntrada ? idResumoEntrada : '';
        idFonecedor = idFonecedor ? idFonecedor : '';
        numSerie = numSerie ? numSerie : '';
        numNFE = numNFE ? numNFE : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        stTransformado = stTransformado ? stTransformado : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/cadastro/cadastro_nfpedido.xsjs?idPedido=${idPedido}&idResumoEntrada=${idResumoEntrada}&idFonecedor=${idFonecedor}&numSerie=${numSerie}&numNFE=${numNFE}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&stTransformado=${stTransformado}&page=${page}&pageSize=${pageSize}`;
            const apiUrl = `${url}/api/cadastro/cadastrar-nota-fiscal-entrada.xsjs?id=${idPedido}&idResumoEntrada=${idResumoEntrada}&idFonecedor=${idFonecedor}&numSerie=${numSerie}&numNFE=${numNFE}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&stTransformado=${stTransformado}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getNFPedido(idPedido, idResumoEntrada, dataPesquisaInicio, dataPesquisaFim, stTransformado, page, pageSize);
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    async getListaItemPedido(req, res) {
        let { idPedido, idDetalhePedido, dataPesquisaInicio, dataPesquisaFim, stTransformado, page, pageSize } = req.query;
        idPedido = idPedido ? idPedido : '';
        idDetalhePedido = idDetalhePedido ? idDetalhePedido : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        stTransformado = stTransformado ? stTransformado : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
           
            const apiUrl = `${url}/api/cadastro/editar-item-pedido.xsjs?iddetPedido=${idDetalhePedido}`;
            // const response = await axios.get(apiUrl)
            const response = await getItemPedido(idPedido, idDetalhePedido, dataPesquisaInicio, dataPesquisaFim, stTransformado, page, pageSize)
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async getListaVinculoNFPedidos(req, res) {
        let { idPedidoNota, idResumoPedido, idNota, idNotaVinculo, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
            idPedidoNota = idPedidoNota ? idPedidoNota : '';
            idResumoPedido = idResumoPedido ? idResumoPedido : '';
            idNota = idNota ? idNota : '';
            idNotaVinculo = idNotaVinculo ? idNotaVinculo : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : '';
            dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
           
            const apiUrl = `${url}/api/cadastro/vinculo_nfpedidos.xsjs?idnota=${idNota}`;
            const response = await axios.get(apiUrl)
                                    
            // const response = await getVinculoNFPedidos(idPedidoNota, idResumoPedido, idNota, idNotaVinculo, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async getListaVinculaNFPedido(req, res) {
        let { idPedidoNota, idPedido, idNota, page, pageSize } = req.query;
            idPedidoNota = idPedidoNota ? idPedidoNota : '';
            idPedido = idPedido ? idPedido : '';
            idNota = idNota ? idNota : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
           
            // const apiUrl = `${url}/api/cadastro/vinculo_nfpedidos.xsjs?idnota=${idNota}`;
            // const response = await axios.get(apiUrl)
                                    
            const response = await getVinculaNFPedido(idPedidoNota, idPedido, idNota, page, pageSize)
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async getListaDetalheProdutoPedidos(req, res) {
        let { idDetalhePedidio, idPedido, dataPesquisaInicio, dataPesquisaFim, stTransformado, stMigradoSap, stCadastro, stReposicao, page, pageSize } = req.query;
            idDetalhePedidio = idDetalhePedidio ? idDetalhePedidio : ''; 
            idPedido = idPedido ? idPedido : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : '';
            dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
            stTransformado = stTransformado ? stTransformado : '';
            stMigradoSap = stMigradoSap ? stMigradoSap : ''; 
            stCadastro = stCadastro ? stCadastro : '';
            stReposicao = stReposicao ? stReposicao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        if(idDetalhePedidio || idPedido || dataPesquisaInicio || dataPesquisaFim) {
            try {
                
                // const apiUrl = `${url}/api/cadastro/vinculo_nfpedidos.xsjs?idnota=${idNota}`;
                // const response = await axios.get(apiUrl)
                const response = await getDetalheProdutoPedidos(idDetalhePedidio, idPedido, dataPesquisaInicio, dataPesquisaFim, stTransformado, stMigradoSap, stCadastro, stReposicao, page, pageSize)
                return res.json(response); 
            } catch(error) {
                console.error("Erro no controller de Cadastro - getListaDetalheProdutoPedidos:", error);
                throw error;
            } 
        } else {
            console.error("Erro no controller de Cadastro - getListaDetalheProdutoPedidos: Parametros não informados");
        }
    }

    
    async putDetalheProdutoPedido(req, res) {
        try {
            const depositos = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateDetalheProdutoPedido(depositos);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async putVinculoNFEPedido(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateVinculoNFEPedido(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller de Cadastro - putVinculoNFEPedido:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async putDadosVinculados(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  deleteDadosVinculados(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller de Cadastro - putDadosVinculados:", error);
            return res.status(500).json({ error: error.message });
        }
    }
    
    async putDetalheProdutoPedido(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateDetalheProdutoPedido(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller de Cadastro - putDetalheProdutoPedido:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async putProdutoPedido(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateProdutoPedido(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller de Cadastro - putProdutoPedido:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async postDetalheProdutoPedido(req, res) {
        try {
            const depositos = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  createDetalheProdutoPedido(depositos);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }
}

export default new CadastroControllers();