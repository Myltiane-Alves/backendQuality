import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getDescontoMotivoVendas } from "../repositories/descontoMotivoVendas.js";
import 'dotenv/config';
const url = process.env.API_URL;

class AdmDescontoControllers {
    async getListaDescontoMotivoVendas(req, res) {
        let {idEmpresa, idGrupo, dataPesquisaInicio, dataPesquisaFim, dsMotivoDesc, page, pageSize } = req.query;
      
        idEmpresa = idEmpresa ? Number(idEmpresa) : '';
        idGrupo = idGrupo ? Number(idGrupo) : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
        dsMotivoDesc = dsMotivoDesc ? dsMotivoDesc : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';


        try {
                                //   /api/administrativo/desconto-motivo-vendas.xsjs?idMarca=1&idEmpresa=&dataInicial=2024-09-19&dataFinal=2024-09-19&dsmotdesc=Convenio&page=1
            const apiUrl = `${url}/api/administrativo/desconto-motivo-vendas.xsjs?idMarca=${idGrupo}&idEmpresa=${idEmpresa}&dataInicial=${dataPesquisaInicio}&dataFinal=${dataPesquisaFim}&dsmotdesc=${dsMotivoDesc}`
            const response = await axios.get(apiUrl)
            // const response = await getDescontoMotivoVendas(idEmpresa, idGrupo, dataPesquisaInicio, dataPesquisaFim, dsMotivoDesc, page, pageSize)

            console.log("Response from Desconto Motivo Vendas:", response.data);
            return res.json(response.data);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }
}

export default new AdmDescontoControllers();