import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getDespesasEmpresa } from "../repositories/empresa.js";
import { createDespesaTodos, getDespesasTodos } from "../repositories/todos.js";
import { getDespesaLojaDashBoard } from "../../DashBoard/DespesaLoja/repositories/despesaLoja.js";
import { updateDespesasLoja } from "../../Financeiro/Despesas/repositories/despesaLoja.js";
import 'dotenv/config';
const url = process.env.API_URL;

class DespesasLojaControllers  {

    async getListaDespesasLojaEmpresa(req,res) {
        let { idEmpresa, dataPesquisaInicio, dataPesquisaFim,  pageSize, page } = req.query;
            idEmpresa = idEmpresa ? idEmpresa : ''; 
            dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
            dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
            pageSize = pageSize ? pageSize : '';
            page = page ? page : '';
      
        try {
                                // api/despesa-loja/empresa.xsjs?idEmpresa=1&dataPesquisa=2024-12-09
            const apiUrl = `${url}/api/despesa-loja/empresa.xsjs?idEmpresa=${idEmpresa}&dataPesquisaInic=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
            const response = await axios.get(apiUrl)
            // const response = await getDespesasEmpresa(idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page);
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }

    async getListaDespesasEmpresaGerencia(req,res) {
        let {idEmpresa, dataPesquisa,  } = req.query;
        idEmpresa = idEmpresa ? idEmpresa : ''; 
        dataPesquisa = dataPesquisa ? dataPesquisa : '';
        
        try {
            const apiUrl = `${url}/api/despesa-loja/empresa.xsjs?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
                throw error;
        }
        
    }

    async getListaTodasDespesasLojas(req,res) {
        let { idDespesas, pageSize, page } = req.query;

        try {
            idDespesas = idDespesas ? idDespesas : '';
            pageSize = pageSize ? pageSize : '';
            page = page ? page : '';

            const apiUrl = `${url}/api/despesa-loja/todos.xsjs?id=${idDespesas}`;
            const response = await axios.get(apiUrl)
            // const response = await getDespesasTodos(idDespesas, pageSize, page)
            return res.json(response.data);
        } catch(error) {
            console.error("Unable to connect to the database:", error);
                throw error;
        }
        
    }

    async getListaDespesasLojaDashBoard(req, res) {
        let { idDespesaLoja, idEmpresa, dataPesquisa, page, pageSize } = req.query;
    
        idDespesaLoja = Number(idDespesaLoja) ? Number(idDespesaLoja) : '';
        idEmpresa = Number(idEmpresa) ? Number(idEmpresa) : '';
        dataPesquisa = dataFormatada(dataPesquisa) ? dataFormatada(dataPesquisa) : '';
        page = Number(page) ? Number(page) : '';
        pageSize = Number(pageSize) ? Number(pageSize) : '';
    
        try {
            // http://164.152.245./api/dashboard/despesa-loja.xsjs?idEmpresa=1&dataPesquisa=2024-12-07
            const apiUrl = `${url}/api/dashboard/despesa-loja.xsjs?idDespesaLoja=${idDespesaLoja}&idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getDespesaLojaDashBoard(idDespesaLoja, idEmpresa, dataPesquisa, page, pageSize)
          
            return res.json(response.data);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    
    }

    async putDespesasLoja(req, res) {
        try {
            const despesas = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateDespesasLoja(despesas);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }
    async postCadastrarDespesasLoja(req, res) {
        try {
            const despesas = Array.isArray(req.body) ? req.body : [req.body]; 
            // const response = await  createDespesaTodos(despesas);
            const response = await  await axios.post(`${url}/api/despesa-loja/todos.xsjs`, despesas)
            return res.json(response.data);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }
    // async postCadastrarDespesasLoja(req, res) {
    //     let {
    //         IDEMPRESA,
    //         IDUSR,
    //         DTDESPESA,
    //         IDCATEGORIARECEITADESPESA,
    //         DSHISTORIO,
    //         DSPAGOA,
    //         TPNOTA,
    //         NUNOTAFISCAL,
    //         VRDESPESA,
    //         STATIVO,
    //         STCANCELADO,
            
    //     } = req.body;

    //     try {
    //         const response = await axios.post(`${url}/api/despesa-loja/todos.xsjs`, {
    //             IDEMPRESA,
    //             IDUSR,
    //             DTDESPESA,
    //             IDCATEGORIARECEITADESPESA,
    //             DSHISTORIO,
    //             DSPAGOA,
    //             TPNOTA,
    //             NUNOTAFISCAL,
    //             VRDESPESA,
    //             STATIVO,
    //             STCANCELADO   
    //         })

    //         return res.status(200).json({message: 'Despesa cadastrada com sucesso!'})
    //     } catch (error) {
    //         console.error("Erro Verifique os campos do formulário:", error);
    //         throw error;
    //     }
    // }
}

export default new DespesasLojaControllers();