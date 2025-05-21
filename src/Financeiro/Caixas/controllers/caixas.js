
import axios from "axios";
import { getListaPCJById } from "../repositories/listaCaixaMovimentos.js";
import { getCaixaStatus } from "../repositories/listaCaixaStatus.js";
import { getCaixaZerados } from "../repositories/listaCaixaZerados.js";
import { putFecharCaixaZerados } from "../repositories/fechaCaixaZerados.js";
import { dataFormatada } from "../../../utils/dataFormatada.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class CaixasControllers {
    async getListaCaixasMovmentoFinanceiro(req, res) {
        let {idMarca, dataPesquisaInicio, dataPesquisaFim, idLoja, idLojaPesquisa, page, pageSize } = req.query;
    
        idMarca = idMarca ? idMarca : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        idLoja = idLoja ? idLoja : '';
        idLojaPesquisa = idLojaPesquisa ? idLojaPesquisa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
          
          // const apiUrl = `http://164.152.245.77:8000/quality/concentrador/api/financeiro/lista-caixas-movimento.xsjs?idMarca=${idMarca}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${idLoja}&idLojaPesquisa=${idLojaPesquisa}&page=${page}&pageSize=${pageSize}`
          // const response = await axios.get(apiUrl)
          const response = await getListaPCJById(idMarca, dataPesquisaInicio, dataPesquisaFim, idLoja)
          
          return res.json(response); // Retorna
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    
    }

    async getListaCaixaStatus(req, res) {
        let { idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
    
        page = page ? page : '';
        pageSize = pageSize ? pageSize : ''
        idEmpresa = idEmpresa ? idEmpresa : '';
        idMarca = idMarca ? idMarca : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        try {
          // const apiUrl = `${url}/api/financeiro/lista-caixas-status.xsjs?page=${page}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}`
          // const response = await axios.get(apiUrl)
          const response = await getCaixaStatus(idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
    
          
          return res.json(response);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    
    }

    async getListaCaixaZerados(req, res) {
      let { idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
        idEmpresa = idEmpresa ? idEmpresa : '';
        idMarca = idMarca ? idMarca : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        page = page ? page : ''
        pageSize = pageSize ? pageSize : ''
      try {
          
        // const apiUrl = `http://164.152.245.77:8000/quality/concentrador_homologacao/api/financeiro/lista-caixas-zerados.xsjs?page=${page}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}`
        const response = await getCaixaZerados(idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
  
        return res.json(response);
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
    
    }


    //  UPDATE
    async updateFecharCaixaZerado(req, res) {
        let { ID } = req.body;
    
        try {
          // const apiUrl = `http://164.152.245.77:8000/quality/concentrador_homologacao/api/financeiro/fecha-caixas-zerados.xsjs`
          const response = await putFecharCaixaZerados(ID)
    
          return res.json(response);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }
}

export default new CaixasControllers();