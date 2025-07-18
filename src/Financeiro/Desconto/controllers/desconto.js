
import axios from "axios";
import { getDescontoMotivoVendas } from "../repositories/descontoMotivoVendas.js";
import { getDescontoVendas } from "../repositories/descontoVendas.js";
import { getDescontoVendaSimplificado } from "../repositories/descontoVendasSimplificado.js";
import 'dotenv/config';
const url = process.env.API_URL;


class DescontoControllers {
  async getListaDescontoVendas(req, res) {
    let { idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;


    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    idEmpresa = idEmpresa ? idEmpresa : '';
    idMarca = idMarca ? idMarca : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    try {
      const apiUrl = `${url}/api/financeiro/desconto-vendas.xsjs?page=${page}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}`
      const response = await axios.get(apiUrl)
      // const response = await getDescontoVendas(idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }


  async getListaDescontoMotivoVendas(req, res) {
    let { idEmpresa, idMarca, motivoDesconto, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    idEmpresa = idEmpresa ? idEmpresa : '';
    idMarca = idMarca ? idMarca : '';
    motivoDesconto = motivoDesconto ? motivoDesconto : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/financeiro/desconto-motivo-vendas.xsjs?page=${page}&pageSize${pageSize}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}&dsmotdesc=${motivoDesconto}`
      const response = await axios.get(apiUrl)
      // const response = await getDescontoMotivoVendas(idEmpresa, idMarca, dsMotivoDesconto, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaDescontoVendasSimplificada(req, res) {
    let { idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;


    idEmpresa = idEmpresa ? idEmpresa : '';
    idMarca = idMarca ? idMarca : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/financeiro/desconto-vendas-simplificado.xsjs?page=${page}&pageSize=${pageSize}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}`
      const response = await axios.get(apiUrl)
      // / const response = await getDescontoVendaSimplificado(idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  //  UPDATE

}

export default new DescontoControllers();