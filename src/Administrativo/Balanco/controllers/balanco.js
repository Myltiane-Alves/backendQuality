import axios from "axios";

import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getBalancoLoja } from "../repositories/balancoLoja.js";
import { getColetorBalanco } from "../repositories/coletorBalanco.js";
import { getPrepararPrimeiroBalancoLoja, updatePrepararPrimeiroBalancoLoja } from "../repositories/prepararPrimeiroBalancoLoja.js";
import { getDetalheBalanco, putDetalheBalanco } from "../repositories/detalheBalanco.js";
import { getConsolidarBalanco, updateConsolidarBalanco } from "../repositories/consolidarBalanco.js";
import { getPrestacaoContasBalanco } from "../repositories/prestacaoContaBalanco.js";
import { getNovoPreviaBalanco } from "../repositories/novoPreviaBalanco.js";
import { createDetalheBalancoAvulso, getDetalheBalancoAvulso, putDetalheBalancoAvulso } from "../repositories/detalheBalancoAvulso.js";
import 'dotenv/config';
const url = process.env.API_URL;



class AdmBalancoControllers {
    async getListaBalancoLoja(req, res) {
        let { idEmpresa, dsDescricao, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? Number(idEmpresa) : '';
        dsDescricao = dsDescricao ? dsDescricao : ''; 
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : ''
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : ''
        page = page ? Number(page) : '';
        pageSize = pageSize ? Number(pageSize) : '';
        
        try {
            // http://164.152.245.77:/api/administrativo/balanco-loja.xsjs?page=1&idEmpresa=1&dataInicial=2024-12-07&dataFinal=2024-12-07&DSdesc=
            const apiUrl = `${url}/api/administrativo/balanco-loja.xsjs?idEmpresa=${idEmpresa}&dsDescricao=${dsDescricao}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getBalancoLoja(idEmpresa, dsDescricao, dataPesquisaInicio, dataPesquisaFim, page, pageSize);
        
            return res.json(response.data);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    // async getListaColetorBalanco(req, res) {
    //     let { idEmpresa, idResumo, descricaoProduto, } = req.query;
        
    //     idEmpresa = idEmpresa ? idEmpresa : '';
    //     idResumo = idResumo ? idResumo : '';
    //     descricaoProduto = descricaoProduto ? descricaoProduto : '';
        
    //     try {
    //         const apiUrl = `${url}/api/administrativo/coletor-balanco.xsjs?idresumo=${idResumo}&idempresa=${idEmpresa}`
    //         const response = await axios.get(apiUrl)

    //         return res.json(response.data); 
    //     } catch (error) {
    //         console.error("Unable to connect to the database:", error);
    //         throw error;
    //     }
        
    // }
    
    async getListaColetorBalanco(req, res) {
        let { idEmpresa, idResumo, descricaoProduto, page, pageSize } = req.query;
        
        idEmpresa = idEmpresa ? idEmpresa : '';
        idResumo = idResumo ? idResumo : '';
        descricaoProduto = descricaoProduto ? descricaoProduto : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            
            // const response = await getColetorBalanco(idEmpresa, idResumo, descricaoProduto, page, pageSize)
            const apiUrl = `${url}/api/administrativo/coletor-balanco.xsjs?idresumo=${idResumo}&idempresa=${idEmpresa}`
            const response = await axios.get(apiUrl)
            return res.json(response.data); 
        } catch (error) {
            console.error("Erro no ADM Balanco Controllers getListaColetorBalanco:", error);
            throw error;
        }
        
    }

    async getListaPrepararPrimeiroBalancoLoja(req, res) {
        let { idEmpresa, page, pageSize } = req.query;
        
        idEmpresa = idEmpresa ? idEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/administrativo/preparar-primeiro-balanco-loja.xsjs?idEmpresa=${idEmpresa}&page=${page}&pageSize=${pageSize}`
            const response = await axios.get(apiUrl)
            // const response = await getPrepararPrimeiroBalancoLoja(idEmpresa, page, pageSize)
            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }
    async getListaDetalheBalancoLoja(req, res) {
        let { idResumo, numeroColetor, page, pageSize } = req.query;
        
        idResumo = idResumo ? idResumo : '';
        numeroColetor = numeroColetor ? numeroColetor : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            
            // const response = await getDetalheBalanco(idResumo, numeroColetor, page, pageSize)
            const apiUrl = `${url}/api/administrativo/detalhe-balanco.xsjs?idresumo=${idResumo}&coletor=${numeroColetor}&page=${page}&pageSize=${pageSize}`
            const response = await axios.get(apiUrl)
            return res.json(response.data); 
        } catch (error) {
            console.error("Erro no ADM Balanco Controllers getListaDetalheBalancoLoja:", error);
            throw error;
        }
        
    }

    async getListaConsolidarBalanco(req, res) {
        let { idResumo,  page, pageSize } = req.query;
        
        idResumo = idResumo ? idResumo : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            
            const response = await getConsolidarBalanco(idResumo, page, pageSize)
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }

    async getListaPrestacaoContasBalanco(req, res) {
        let { idResumoBalanco,  page, pageSize } = req.query;
        
        idResumoBalanco = idResumoBalanco ? idResumoBalanco : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/administrativo/prestacao-contas-balanco.xsjs?id=${idResumoBalanco}`
            const response = await axios.get(apiUrl)
            // const response = await getPrestacaoContasBalanco(idResumoBalanco, page, pageSize)
            return res.json(response.data); 
        } catch (error) {
            console.error("Erro no ADMBalancoControllers getListaPrestacaoContasBalanco:", error);
            throw error;
        }
        
    }

    async getListaNovoPreviaBalanco(req, res) {
        let { idResumoBalanco,  page, pageSize } = req.query;
        
        idResumoBalanco = idResumoBalanco ? idResumoBalanco : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            
            const response = await getNovoPreviaBalanco(idResumoBalanco, page, pageSize)
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }

    async getListaDetalheBalancoAvulso(req, res) {
        let { idFilial, coletor, page, pageSize } = req.query;
        
        idFilial = idFilial ? idFilial : '';
        coletor = coletor ? coletor : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/administrativo/detalhe-balanco-avulso.xsjs?idfilial=${idFilial}&coletor=${coletor}`;
            const response = await axios.get(apiUrl)
            // const response = await getDetalheBalancoAvulso(idFilial, coletor, page, pageSize)
            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }

  
    async putConsolidarBalanco(req, res) {
        try {
            const balancos = Array.isArray(req.body) ? req.body : [req.body];            
            const response = await updateConsolidarBalanco(balancos)

            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async putListaPrepararPrimeiroBalancoLoja(req, res) {
        try {
            const balancos = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await updatePrepararPrimeiroBalancoLoja(balancos)

            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async putListaDetalheBalanco(req, res) {
        try {
            const detalhes = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await putDetalheBalanco(detalhes)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    async putListaDetalheBalancoAvulso(req, res) {
        try {
            const detalhes = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await putDetalheBalancoAvulso(detalhes)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async postDetalheBalancoAvulso(req, res) {
        try {
            const detalhes = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await createDetalheBalancoAvulso(detalhes)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
 
}

export default new AdmBalancoControllers();