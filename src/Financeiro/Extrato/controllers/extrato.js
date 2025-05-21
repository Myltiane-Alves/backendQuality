
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import {  getPrimeiraVendaSaldoAtual } from "../repositories/extratoLojaPeriodo.js";
import { createAjusteExtrato, getAjusteExtrato, updateAjusteExtrato } from "../repositories/ajusteExtrato.js";

let url = `http://164.152.245.77:8000/quality/concentrador`;


class ExtratosControllers {
  async getListaExtratoDaLojaPeriodoFinanceiro(req, res) {
    let { idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    
      idEmpresa = idEmpresa ? idEmpresa : '';
      dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
      dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
      page = page ? page : '';
      pageSize = pageSize ? pageSize : '';
      
      try {
        const apiUrl = `${url}/api/financeiro/extrato-loja-periodo.xsjs?pageSize=500&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
        // const response = await getListaTotal(idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
        const response = await axios.get(apiUrl)
        return res.json(response.data);
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
    
  }

  async getPrimeiraVenda(req, res) {
    let { idAjusteExtrato,  pageSize, page  } = req.query;
      
    try {
  
      const response = await getAjusteExtrato(idAjusteExtrato,  pageSize, page)
      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    
  }

  async getListaExtrato(req, res) {
    let { idEmpresa, dataPesquisa, dataPesquisaFim } = req.query;
      
    try {
  
      // const response = await getListaTotal(idEmpresa, dataPesquisa, dataPesquisaFim)
      const response = await axios.get(`${url}/api/financeiro/extrato-loja-periodo.xsjs?pageSize=500&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisa}&dataPesquisaFim=${dataPesquisaFim}`)
      
      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    
  }

  async putListaAjusteExtrato(req, res) {
    try {
      const extratos = Array.isArray(req.body) ? req.body : [req.body]; 
      const response = await  updateAjusteExtrato(extratos);
      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async postAjusteExtrato(req, res) {
    try {
      const extratos = Array.isArray(req.body) ? req.body : [req.body]; 
      const response = await  createAjusteExtrato(extratos);
      return res.json(response);
    } catch (error) {
      console.error("Erro no ExtratosControllers. postAjusteExtrato:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new ExtratosControllers();