
import axios from "axios";
import { getDescontoMotivoVendas } from "../repositories/descontoMotivoVendas.js";
import { getDescontoVendas } from "../repositories/descontoVendas.js";
import { getDescontoVendaSimplificado } from "../repositories/descontoVendasSimplificado.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class DescontoControllers {
    async getListaDescontoVendas(req, res) {
        let {idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
    

        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        idMarca = idMarca ? idMarca : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        try {
          // const apiUrl = `${url}/api/financeiro/desconto-vendas.xsjs?page=${page}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}`
          // const response = await axios.get(apiUrl)
          const response = await getDescontoVendas(idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
    
          return res.json(response);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }

    
    async getListaDescontoMotivoVendas(req, res) {
        let { idEmpresa, idMarca, dsMotivoDesconto, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
    
        idEmpresa = idEmpresa ? idEmpresa : '';
        idMarca = idMarca ? idMarca : '';
        dsMotivoDesconto = dsMotivoDesconto ? dsMotivoDesconto : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
          const apiUrl = `${url}/api/financeiro/desconto-motivo-vendas.xsjs?page=${page}&pageSize${pageSize}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}&dsmotdesc=${dsMotivoDesconto}`
          // const response = await axios.get(apiUrl)
          const response = await getDescontoMotivoVendas(idEmpresa, idMarca, dsMotivoDesconto, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
    
          return res.json(response);
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
      // const response = await axios.get(apiUrl)
      const response = await getDescontoVendaSimplificado(idEmpresa, idMarca, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Erro no DescontoControllers.getListaDescontoVendasSimplificada:", error);
      throw error;
    }
  }

    //  UPDATE
 
}

export default new DescontoControllers();