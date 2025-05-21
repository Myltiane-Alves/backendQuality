import { getHistoricosMalotes } from "../historicosMalotes.js";
import { getMalortesPorLoja, updateMalote } from "../malotesPorLoja.js";
import { getPendenciasMalotes } from "../pendenciasMalotes.js";

class MalotesController {
  async getListasHistoricosMalotes(req, res) {
    let { idEmpresa, idMalote, idHistoricoMalote, dataPesquisaInicio, dataPesquisaFim, dataConferenciaInicio, dataConferenciaFim, page, pageSize} = req.query;

    idEmpresa = idEmpresa ? idEmpresa : '';
    idMalote = idMalote ? idMalote : '';
    idHistoricoMalote = idHistoricoMalote ? idHistoricoMalote : '';
    dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    dataConferenciaInicio = dataFormatada(dataConferenciaInicio) ? dataFormatada(dataConferenciaInicio) : '';
    dataConferenciaFim = dataFormatada(dataConferenciaFim) ? dataFormatada(dataConferenciaFim) : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';

    try {
                

      // const apiUrl = `${url}/api/financeiro/historicos-malotes.xsjs?idEmpresa=${idEmpresa}&idMalote=${idMalote}&idHistoricoMalote=${idHistoricoMalote}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`
      // const response = await axios.get(apiUrl)
      const response = await getHistoricosMalotes(idEmpresa, idMalote, statusMalote, pendenciaMalote, page, pageSize)

      return res.json(response); 
    } catch (error) {
      console.error("Erro no FinanceiroControllers.getListasHistoricosMalotes verifique se os parâmetros estão sendo preenchidos:", error);
      throw error;
    }
  }
  
  async getListasMalotesLojas(req, res) {
    let {idEmpresa, idMarca, idMalote, statusMalote, pendenciaMalote, dataPesquisaInicio, dataPesquisaFim, dataConferenciaInicio, dataConferenciaFim, page, pageSize} = req.query;

    
    idEmpresa = idEmpresa ? idEmpresa : '';
    idMalote = idMalote ? idMalote : '';
    statusMalote = statusMalote ? statusMalote : '';
    pendenciaMalote = pendenciaMalote ? pendenciaMalote : '';
    dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    idMarca = idMarca ? idMarca : '';
    dataConferenciaInicio = dataFormatada(dataConferenciaInicio) ? dataFormatada(dataConferenciaInicio) : '';
    dataConferenciaFim = dataFormatada(dataConferenciaFim) ? dataFormatada(dataConferenciaFim) : '';

    try {
                

      // const apiUrl = `${url}/api/financeiro/malotes-por-loja.xsjs?idGrupoEmpresarial=${idMarca}&idEmpresa=${idEmpresa}&statusMalote=${statusMalote}&idMalote=${idMalote}&idPendenciaMalote=${pendenciaMalote}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataConferenciaInicio=${dataConferenciaInicio}&dataConferenciaFim=${dataConferenciaFim}&page=${page}&pageSize=${pageSize}`
      // const response = await axios.get(apiUrl)
      const response = await getMalortesPorLoja(idEmpresa, idMarca, idMalote, statusMalote, pendenciaMalote, page, pageSize)

      return res.json(response); 
    } catch (error) {
      console.error("Erro no FinanceiroControllers.getListasMalotes verifique se os parâmetros estão sendo preenchidos:", error);
      throw error;
    }
  }
  
  async getListaPendenciasMalotes(req, res) {
    let { idEmpresa, idMalote, statusMalote, pendenciaMalote, page, pageSize} = req.query;
    
    
      idEmpresa = idEmpresa ? idEmpresa : '';
      idMalote = idMalote ? idMalote : '';
      statusMalote = statusMalote ? statusMalote : '';
      pendenciaMalote = pendenciaMalote ? pendenciaMalote : '';
      page = page ? page : '';
      pageSize = pageSize ? pageSize : '';

      try {
        // const apiUrl = `${url}/api/financeiro/pendencias-malotes.xsjs?idEmpresa=${idEmpresa}&idMalote=${idMalote}&statusMalote=${statusMalote}&pendenciaMalote=${pendenciaMalote}&page=${page}&pageSize=${pageSize}`
        // const response = await axios.get(apiUrl)
        const response = await getPendenciasMalotes(idEmpresa, idMalote, statusMalote, pendenciaMalote, page, pageSize)

        return res.json(response); 
      } catch (error) {
        console.error("Erro no FinanceiroControllers.getListaPendenciasMalotes verifique se os parâmetros estão sendo preenchidos:", error);
        throw error;
      }
    
  }

  async putMalotesLoja(req, res) {
        
    try {
      let { IDMALOTE, STATUS, OBSERVACAOADMINISTRATIVO, PENDENCIAS, IDUSERULTIMAALTERACAO } = req.body;
  
      if(!IDMALOTE || IDUSERULTIMAALTERACAO) {
        console.error("Erro no FinanceiroControllers.putMalotes: Faltando Parametos obrigatórios", error);
        return res.status(400).json({ error: "Faltando Parametos obrigatórios" });
      }
      const apiUrl = `${url}/api/financeiro/malote-loja.xsjs`;
      const response = await axios.put(apiUrl, {
        IDMALOTE,
        STATUS,
        OBSERVACAOADMINISTRATIVO,
        PENDENCIAS,
        IDUSERULTIMAALTERACAO
      })
      // const response = await updateMalote(IDMALOTE, IDUSERULTIMAALTERACAO)
      console.log(response.data, 'response.data')
      if (response.status !== 200) {
        console.error("Erro no FinanceiroControllers.putMalotes: Erro ao atualizar malote", response.data);
        return res.status(response.status).json({ error: "Erro ao atualizar malote" });
      }

      return res.json(response.data); 
    } catch (error) {
      console.error("Erro no FinanceiroControllers.putMalotes:", error);
      return res.status(500).json({ error: "Erro no servidor" });
    }
  }
}

export default new MalotesController();