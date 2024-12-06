
import axios from "axios";
import { getMotivoDevolucao, postMotivoDevolucao, putMotivoDevolucao } from "../repositories/motivoDevolucao.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;



class DevolucaoControllers {
  async getListaMotivosDevolucao(req, res) {
    let { idMotivo, descricaoMotivo, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    idMotivo = idMotivo ? idMotivo : '';
    descricaoMotivo = descricaoMotivo ? descricaoMotivo : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {

      const response = await getMotivoDevolucao(idMotivo, descricaoMotivo, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async updateMotivoDevolucao(req, res) {
    try {
      const devolucoes = Array.isArray(req.body) ? req.body : [req.body];
      const response = await putMotivoDevolucao(devolucoes)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }


  async createMotivoDevolucao(req, res) {
    const devolucao  = Array.isArray(req.body) ? req.body : [req.body];

    try {

      const response = await postMotivoDevolucao(devolucao)


      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }
}


export default new DevolucaoControllers();