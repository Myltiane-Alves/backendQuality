
import axios from "axios";
import { getDepositoLoja, putDepositoLoja } from "../repositories/depositoLoja.js";
import 'dotenv/config';
const url = process.env.API_URL;

class DepositosControllers {
  async getListaConciliarBanco(req, res) {
    let { idDeposito, idConta, idEmpresa, dataCompInicio, dataCompFim, dataMovInicio, dataMovFim, dataPesquisaInicio, dataPesquisaFim, pageSize, page } = req.query;

    pageSize = pageSize ? pageSize : '';
    page = page ? page : '';
    idConta = idConta ? idConta : '';
    dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    dataCompInicio = dataFormatada(dataCompInicio) ? dataFormatada(dataCompInicio) : '';
    dataCompFim = dataFormatada(dataCompFim) ? dataFormatada(dataCompFim) : '';
    dataMovInicio = dataFormatada(dataMovInicio) ? dataFormatada(dataMovInicio) : '';
    dataMovFim = dataFormatada(dataMovFim) ? dataFormatada(dataMovFim) : '';

    try {
      // const apiUrl = `${url}/api/financeiro/deposito-loja.xsjs?page=1&idConta=${idConta}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataCompInicio=${dataCompensacaoInicio}&dataCompFim=${dataCompensacaoFim}&datamovinicio=${dataMovimentoInicio}&datamovfim=${dataMovimentoFim}`
      const response = await getDepositoLoja(idDeposito, idConta, idEmpresa, dataCompInicio, dataCompFim, dataMovInicio, dataMovFim, dataPesquisaInicio, dataPesquisaFim, pageSize, page)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }

  }

  async getListaDepositosLoja(req, res) {
    let { idDeposito, idConta, idEmpresa, dataCompInicio, dataCompFim, dataMovInicio, dataMovFim, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
    idDeposito = idDeposito ? idDeposito : '';
    idConta = idConta ? idConta : '';
    idEmpresa = idEmpresa ? idEmpresa : '';
    dataCompInicio = dataCompInicio ? dataCompInicio : '';
    dataCompFim = dataCompFim ? dataCompFim : '';
    dataMovInicio = dataMovInicio ? dataMovInicio : '';
    dataMovFim = dataMovFim ? dataMovFim : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/financeiro/deposito-loja.xsjs?page=${page}&pagesize=${pageSize}&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
      const response = await axios.get(apiUrl)
      // const response = await getDepositoLoja(idDeposito, idConta, idEmpresa, dataCompInicio, dataCompFim, dataMovInicio, dataMovFim, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }

  }

  async updateDepositoLoja(req, res) {
    let { IDDEPOSITOLOJA } = req.body;

    if(!IDDEPOSITOLOJA) {
      return res.status(400).json({ error: "IDDEPOSITOLOJA is required" });
    }

    try {
      // const response = await putDepositoLoja(IDDEPOSITOLOJA)
      // const despesas = Array.isArray(req.body) ? req.body : [req.body]; 
      const response = await axios.put(`${url}/api/financeiro/atualizar-deposito-loja.xsjs`, {IDDEPOSITOLOJA: IDDEPOSITOLOJA});
      return res.json(response.data);
    } catch (error) {
      console.error("Erro no DepositosControllers:", error);
      res.status(500).json({ error: "Erro ao atualizar depósito loja" });
      throw error;
    }
  }
}

export default new DepositosControllers();