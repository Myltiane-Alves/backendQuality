
import axios from "axios";
import { getMotivoDevolucao, postMotivoDevolucao, putMotivoDevolucao } from "../repositories/motivoDevolucao.js";
import 'dotenv/config';
const url = process.env.API_URL|| 'localhost:6001'



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
      const apiUrl = `${url}/api/financeiro/motivo-devolucao.xsjs?idMotivo=${idMotivo}&descMotivo=${descricaoMotivo}&dtInicio=${dataPesquisaInicio}&dtFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl);
      // const response = await getMotivoDevolucao(idMotivo, descricaoMotivo, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async updateMotivoDevolucao(req, res) {
    try {
      let {IDUSUARIO, IDMOTIVODEVOLUCAO, DSMOTIVO, STATIVO} = req.body;
      // const response = await putMotivoDevolucao(devolucoes)
      if (!IDUSUARIO || !IDMOTIVODEVOLUCAO || !DSMOTIVO || STATIVO === undefined) {
        return res.status(400).json({ error: "IDUSUARIO, IDMOTIVODEVOLUCAO, DSMOTIVO and STATIVO are required." });
      }
      const response = await axios.post(`${url}/api/financeiro/motivo-devolucao.xsjs`, {
        IDUSUARIO,
        IDMOTIVODEVOLUCAO,
        DSMOTIVO,
        STATIVO
      });

      return res.json(response.data);
    } catch (error) {
      console.error("Erro no DevolucaoControllers.updateMotivoDevolucao", error);
      return res.status(500).json({ error: "Internal Server Error" });
      
    }
  }


  async createMotivoDevolucao(req, res) {
    
    try {
      let {IDUSUARIO, DSMOTIVO} = req.body;
      // const response = await postMotivoDevolucao(devolucao)

      if (!IDUSUARIO || !DSMOTIVO) {
        return res.status(400).json({ error: "IDUSUARIO and DSMOTIVO are required." });
      }
      const response = await axios.post(`${url}/api/financeiro/motivo-devolucao.xsjs`, {IDUSUARIO, DSMOTIVO});

      return res.json(response.data);
    } catch (error) {
      console.error("Erro no DevolucaoControllers.createMotivoDevolucao", error);
      throw error;
    }
  }
}


export default new DevolucaoControllers();