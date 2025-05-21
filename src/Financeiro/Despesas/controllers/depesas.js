
import axios from "axios";
import { getDespesaLoja, updateDespesasLoja, updateStatusDespesasLoja } from "../repositories/despesaLoja.js";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getDespesaLojaDashBoard } from "../../../DashBoard/DespesaLoja/repositories/despesaLoja.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


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
  
        // const apiUrl = `${url}/api/financeiro/despesa-loja.xsjs?idCategoria=${idCategoria}&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
        // const response = await axios.get(apiUrl)
        const response = await getDespesaLoja(idDespesaLoja, idEmpresa, dataPesquisaInicio, dataPesquisaFim, idCategoria, page, pageSize)
        
        return res.json(response);
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
  
  }    

  async putDespesasLoja(req, res) {
    let {IDCATEGORIARECEITADESPESA, VRDESPESA, DSPAGOA, DSHISTORIO, TPNOTA, NUNOTAFISCAL, IDUSRCACELAMENTO, DSMOTIVOCANCELAMENTO, IDDESPESASLOJA} = req.body;
    if(IDDESPESASLOJA === undefined && DSPAGOA === '' && DSHISTORIO === '') {
      try {
        // const despesas = Array.isArray(req.body) ? req.body : [req.body]; 
        const response = await  updateDespesasLoja(IDCATEGORIARECEITADESPESA, VRDESPESA, DSPAGOA, DSHISTORIO, TPNOTA, NUNOTAFISCAL, IDUSRCACELAMENTO, DSMOTIVOCANCELAMENTO, IDDESPESASLOJA);
        return res.json(response);
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        return res.status(500).json({ error: error.message });
      }
    } else {
      return res.status(500).json({ error: 'Informe os campos obrigatórios putDespesasLoja' });
    }
  }
  
  async putStatusDespesasLoja(req, res) {
    try {
      const despesas = Array.isArray(req.body) ? req.body : [req.body]; 
      const response = await  updateStatusDespesasLoja(despesas);
      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return res.status(500).json({ error: error.message });
    }
   
  }

}

export default new DespesasControllers();