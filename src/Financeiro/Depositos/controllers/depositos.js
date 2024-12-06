
import axios from "axios";
import { getDepositoLoja, putDepositoLoja } from "../repositories/depositoLoja.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class DepositosControllers {
    async getListaConciliarBanco(req, res) {
        let {idDeposito, idConta, idEmpresa, dataCompInicio, dataCompFim, dataMovInicio, dataMovFim, dataPesquisaInicio, dataPesquisaFim, pageSize, page } = req.query;
    
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
        let {  idDeposito, idConta, idEmpresa, dataCompInicio, dataCompFim, dataMovInicio, dataMovFim, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
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
          // const apiUrl = `${url}/api/financeiro/deposito-loja.xsjs?page=1&pagesize=1000&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
          // const response = await axios.get(apiUrl)
          const response = await getDepositoLoja(idDeposito, idConta, idEmpresa, dataCompInicio, dataCompFim, dataMovInicio, dataMovFim, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
    
          return res.json(response);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    
    }

    async updateDepositoLoja(req, res) {
        let { IDDEPOSITOLOJA } = req.body;
    
        try {
          // const apiUrl = `http://164.152.245.77:8000/quality/concentrador_homologacao/api/financeiro/atualizar-deposito-loja.xsjs`
          const response = await putDepositoLoja(IDDEPOSITOLOJA)
    
          return res.json(response.data);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }
}

export default new DepositosControllers();