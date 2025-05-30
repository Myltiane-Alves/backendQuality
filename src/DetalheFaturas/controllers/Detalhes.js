import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { createDetalheFatura, getDetalheFaturaId, putDetalheFatura } from "../../Financeiro/Faturas/repositories/detalheFatura.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;

class DetalheFaturasControllers {

  async getDetalheFatura(req, res) {

    let { idEmpresa, pageNumber, dataPesquisaInicio, dataPesquisaFim, } = req.query;
    if (!isNaN(idEmpresa)) {
      idEmpresa = Number(idEmpresa);
      const pageSize = 100;
      const offset = (pageNumber - 1) * pageSize;
      dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
      dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';


      try {
        const apiUrl = `${url}/api/detalhe-fatura.xsjs?idEmpresa=${idEmpresa}&dataPesquisaInic=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
        const response = await axios.get(apiUrl)

        return res.json(response.data); // Retorna
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
    }
  }

  // async getDetalheFaturaFinanceiro(req, res) {
  //     let { idEmpresa, dataPesquisaInicio, dataPesquisaFim, codigoFatura,  page, pageSize} = req.query;

  //     idEmpresa = idEmpresa ? idEmpresa : '';
  //     dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
  //     dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
  //     codigoFatura = codigoFatura ? codigoFatura : '';
  //     page = page ? page : '';
  //     pageSize = pageSize ? pageSize : '';


  //     try {

  //         const response = await getDetalheFatura(idEmpresa, dataPesquisaInicio, dataPesquisaFim, codigoFatura,  page, pageSize)
  //         return res.json(response); 
  //     } catch (error) {
  //         console.error("Unable to connect to the database:", error);
  //         throw error;
  //     }

  // }

  async getDetalheFaturaById(req, res) {
    let { idFatura } = req.query;

    try {
      // const apiUrl = `${url}/api/detalhe-fatura.xsjs?id=${idFatura}`
      // const response = await axios.get(apiUrl)
      const response = await getDetalheFaturaId(idFatura)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }

  }

  async updateFatura(req, res) {
    let {
      IDDETALHEFATURA,
      NUCODAUTORIZACAO,
      VRRECEBIDO,
      NUAUTORIZACAO,
      STPIX,
      STCANCELADO } = req.body;

    try {
      //   const apiUrl = `${url}/api/financeiro/atualizar-fatura.xsjs`
      const response = await putDetalheFatura(apiUrl,
        IDDETALHEFATURA,
        NUCODAUTORIZACAO,
        VRRECEBIDO,
        NUAUTORIZACAO,
        STPIX,
        STCANCELADO,
      )

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async postDetalheFaturaLoja(req, res) {
    try {
      const detalhes = Array.isArray(req.body) ? req.body : [req.body];
      const response = await createDetalheFatura(detalhes);
      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      return res.status(500).json({ error: error.message });
    }
  }

}

export default new DetalheFaturasControllers();