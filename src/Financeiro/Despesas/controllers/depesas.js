
import axios from "axios";
import { getDespesaLoja, updateDespesasLoja, updateStatusDespesasLoja } from "../repositories/despesaLoja.js";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getDespesaLojaDashBoard } from "../../../DashBoard/DespesaLoja/repositories/despesaLoja.js";
import 'dotenv/config';
const url = process.env.API_URL;


class DespesasControllers {

  async getListaDespesasLoja(req, res) {
      let { idDespesaLoja, idEmpresa, dataPesquisaInicio, dataPesquisaFim, idCategoria, page, pageSize } = req.query;
        idDespesaLoja = Number(idDespesaLoja) ? Number(idDespesaLoja) : '';
        idEmpresa = Number(idEmpresa) ? Number(idEmpresa) : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        idCategoria = idCategoria ? idCategoria : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
      try {
  
        const apiUrl = `${url}/api/financeiro/despesa-loja.xsjs?idCategoria=${idCategoria}&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
        const response = await axios.get(apiUrl)
        // const response = await getDespesaLoja(idDespesaLoja, idEmpresa, dataPesquisaInicio, dataPesquisaFim, idCategoria, page, pageSize)
        
        return res.json(response.data);
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
  
  }    

  async putDespesasLoja(req, res) {
    try {
      const despesas = Array.isArray(req.body) ? req.body : [req.body]; 
      // const response = await  updateDespesasLoja(despesas);
      
      const response = await axios.put(`${url}/api/despesa-loja/editar-despesa.xsjs`, despesas);
      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return res.status(500).json({ error: error.message });
    }
   
  }
  async putStatusDespesasLoja(req, res) {
    try {
      let  {STCANCELADO, IDDESPESASLOJA} = req.body; 
      // const response = await  updateStatusDespesasLoja(despesas);
      if(!IDDESPESASLOJA) {
        return res.status(400).json({ error: "IDDESPESASLOJA is required" });
      }
      const response = await axios.put(`${url}/api/despesa-loja/atualizacao-status.xsjs`, {STCANCELADO, IDDESPESASLOJA});

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return res.status(500).json({ error: error.message });
    }
   
  }

}

export default new DespesasControllers();