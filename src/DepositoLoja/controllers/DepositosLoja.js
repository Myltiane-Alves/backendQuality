import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { createDepositoLoja, updateDepositoLoja } from "../repositories/depositoLoja.js";
import { getDepositosEmpresa } from "../repositories/empresa.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class DepositosLojaControllers  {

    async getListaDepositosLojaEmpresa(req,res) {
        let {idEmpresa, dataPesquisaInicio, dataPesquisaFim    } = req.query;
        idEmpresa = idEmpresa ? idEmpresa : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        try {
            // ajaxGet('api/compras/lista_pedidos.xsjs?pageSize=1000&page=' + numPage + '&dataPesquisaInicio=' + dataPesqInic + '&dataPesquisaFim=' + dataPesqFim + '&idFornPesquisa=' + idFornPesq + '&idMarcaPesquisa=' + idMarcaPesq + '&idpedido=' + NuPedidoPesq + '&idFabPesquisa=' + idFabPesq + '&idCompradorPesquisa=' + idCompradorPesq + '&stSituacaoSAP=' + STSituacoPedidoPesq)
            const apiUrl = `${url}/api/deposito-loja/empresa.xsjs?idEmpresa=${idEmpresa}&dataPesquisaInic=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
                throw error;
        }
    }
    // async getListaDepositosLojaEmpresa(req,res) {
    //     let {idEmpresa, dataPesquisaInicio, dataPesquisaFim,  pageSize, page   } = req.query;
    //         idEmpresa = idEmpresa ? idEmpresa : '';
    //         dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    //         dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    //     try {
    //         const response = await getDepositosEmpresa(idEmpresa, dataPesquisaInicio, dataPesquisaFim,  pageSize, page)
    //         return res.json(response); 
    //     } catch(error) {
    //         console.error("Unable to connect to the database:", error);
    //             throw error;
    //     }
    // }

    async getListaProdutosLojaSap(req, res) {
        let { descricaoProduto, idEmpresa, idListaEmpresa, pageNumber } = req.query;
    
    
        descricaoProduto = descricaoProduto ? descricaoProduto : ''; 
        idEmpresa = idEmpresa ? idEmpresa : ''; 
        idListaEmpresa = idListaEmpresa ? idListaEmpresa : '';         
        pageNumber = pageNumber ? pageNumber : 1; 

    
        const pageSize = 100;
        const offset = (pageNumber - 1) * pageSize;
    
        try {   
            // api/produto-sap/produto-sap.xsjs?page=' + numPage + '&codeBarsOuNome=' + DSdesc + '&IdEmpresaLoja=' + IDEmpresaLogin + '&IdListaLoja=' + IDListaEmp
            const apiUrl = `${url}/api/produto-sap/produto-sap.xsjs?codeBarsOuNome=${descricaoProduto}&IdEmpresaLoja=${idEmpresa}&IDEmpresaLogin=${idEmpresa}&IdListaLoja=${idListaEmpresa}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    
    async putListaDepositosLoja(req, res) {
        try {
            const depositos = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateDepositoLoja(depositos);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }
    
    async postListaDepositosLoja(req, res) {
        try {
            const depositos = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  createDepositoLoja(depositos);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }

    async cadastroDepositoLoja(req, res) {
        let {
            IDEMPRESA,
            IDUSR,
            IDCONTABANCO,
            DTDEPOSITO,
            DTMOVIMENTOCAIXA,
            DSHISTORIO,
            NUDOCDEPOSITO,
            VRDEPOSITO,
            STATIVO,
            STCANCELADO,
            
        } = req.body;

        try {
            const response = await axios.post(`${url}/api/deposito-loja/todos.xsjs`, {
                IDEMPRESA,
                IDUSR,
                IDCONTABANCO,
                DTDEPOSITO,
                DTMOVIMENTOCAIXA,
                DSHISTORIO,
                NUDOCDEPOSITO,
                VRDEPOSITO,
                STATIVO,
                STCANCELADO,
            })

            return res.status(200).json({message: 'Depósito cadastrado com sucesso!'})
        } catch (error) {
            console.error("Erro Verifique os campos do formulário:", error);
            throw error;
        }
    }
 
}

export default new DepositosLojaControllers();