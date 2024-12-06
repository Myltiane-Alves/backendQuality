
import axios from "axios";
import { getAdiantamentoSalarial } from "../repositories/adiantamentoSalarial.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;


class AdiantamentosControllers {
    async getListaAdiantamentoSalarialFinanceiro(req, res) {
        let { idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page } = req.query;
    
        // idEmpresa = idEmpresa ? idEmpresa : '';
        // dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        // dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        try {
          const apiUrl = `${url}/api/financeiro/adiantamento-salarial.xsjs?idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
          const response = await axios.get(apiUrl);
          // const response = await getAdiantamentoSalarial(idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page)
    
          return res.json(response.data);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }

}

export default new AdiantamentosControllers();