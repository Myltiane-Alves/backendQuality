
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getFaturaPixPeriodo } from "../repositories/faturaPixPeriodo.js";
import { getVendaFaturaPixPeriodo, getVendaFaturaPixPeriodoCompensada, putVendaPixStatusConferido } from "../repositories/vendaTotalFaturaPixPeriodoEmpresa.js";
import { getDetalheFatura } from "../repositories/detalheFatura.js";
import { putAtualizarFatura, putAtualizarRecompra } from "../repositories/FaturaLoja/faturaLoja.js";
import { getFaturaPixPeriodoConsolidado } from "../repositories/faturaPixPeriodoConsolidado.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;


class FaturasControllers {
  async getListaFaturasPixPeriodo(req, res) {
    let { idMarca, dataPesquisaInicio, dataPesquisaFim, idLojaPesquisa, empresaLista, page, pageSize } = req.query;

    idMarca = idMarca ? idMarca : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    idLojaPesquisa = idLojaPesquisa ? idLojaPesquisa : '';
    empresaLista = empresaLista ? empresaLista : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/financeiro/fatura-pix-periodo.xsjs?idMarca=${idMarca}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLojaPesquisa=${idLojaPesquisa}&empresaLista=${empresaLista}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl);
      // const response = await getFaturaPixPeriodo(idMarca, dataPesquisaInicio, dataPesquisaFim, idLojaPesquisa, empresaLista, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaFaturasPixConsolidado2(req, res) {
    let { idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    idMarca = idMarca ? idMarca : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';

    try {

      const apiUrl = `${url}/api/financeiro/fatura-pix-consolidado.xsjs?idMarca=${idMarca}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl);
      // const response = await getFaturaPixPeriodoConsolidado(idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }

  }

  async getDetalheFaturaFinanceiro(req, res) {
    let { idEmpresa, idDetalheFatura, dataPesquisaInicio, dataPesquisaFim, codigoFatura,  page, pageSize} = req.query;
    
    idEmpresa = idEmpresa ? idEmpresa : '';
    idDetalheFatura = idDetalheFatura ? idDetalheFatura : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    codigoFatura = codigoFatura ? codigoFatura : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';

    
    try {

      
      const response = await getDetalheFatura(idEmpresa, dataPesquisaInicio, dataPesquisaFim, codigoFatura, idDetalheFatura, page, pageSize);

      return res.json(response); 
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    
  }

  async getListaVendaFaturaPixPeriodo(req, res) {
    let { idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, dataCompInicio, dataCompFim, page, pageSize} = req.query;
    
    idMarca = idMarca ? idMarca : '';
    idEmpresa = idEmpresa ? idEmpresa : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    dataCompInicio = dataCompInicio ? dataCompInicio : '';
    dataCompFim = dataCompFim ? dataCompFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    
    try {
                         // api/financeiro/venda-total-fatura-pix-empresa.xsjs?pageSize=1000&page=1&idMarca=1&idEmpresa=0&dataPesquisaInicio=2024-11-04&dataPesquisaFim=2024-11-04
      const apiUrl = `${url}/api/financeiro/venda-total-fatura-pix-empresa.xsjs?idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataCompInicio=${dataCompInicio}&dataCompFim=${dataCompFim}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl);
      // const response = await getVendaFaturaPixPeriodo(idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, dataCompInicio, dataCompFim, page, pageSize)
      return res.json(response.data); 
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    
  }

  async getListaVendaFaturaPixPeriodoCompensacao(req, res) {
    let { idMarca, idEmpresa, dataCompInicio, dataCompFim, page, pageSize} = req.query;
    
    idMarca = idMarca ? idMarca : '';
    idEmpresa = idEmpresa ? idEmpresa : '';
    dataCompInicio = dataCompInicio ? dataCompInicio : '';
    dataCompFim = dataCompFim ? dataCompFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    
    try {

      const response = await getVendaFaturaPixPeriodoCompensada(idMarca, idEmpresa, dataCompInicio, dataCompFim, page, pageSize)
      return res.json(response); 
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
    
  }
  
  async putListaFaturaVendaPixStatusConferido(req, res) {
    try {
        const vendas = Array.isArray(req.body) ? req.body : [req.body]; 
        const response = await putVendaPixStatusConferido(vendas);
        return res.json(response);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return res.status(500).json({ error: error.message });
    }
  }

  async putListaAtualizarRecompra(req, res) {
    try {
        const detalhes = Array.isArray(req.body) ? req.body : [req.body]; 
        const response = await putAtualizarRecompra(detalhes);
        return res.json(response);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return res.status(500).json({ error: error.message });
    }
  }

  async putListaAtualizarFatura(req, res) {
    try {
        const detalhes = Array.isArray(req.body) ? req.body : [req.body]; 
        const response = await putAtualizarFatura(detalhes);
        return res.json(response);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return res.status(500).json({ error: error.message });
    }
  }

}

export default new FaturasControllers();