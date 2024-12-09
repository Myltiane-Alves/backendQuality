
import axios from "axios";
import { getLogsUsuarios, postLogUsuario } from "../repositories/logWeb.js";

let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;


class LogsControllers {
    async getListaLogsUsuario(req, res) {
        let { byId, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
    
        byId = byId ? byId : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';    

        try {
    
          const response = await getLogsUsuarios(byId, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
    
          return res.json(response);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }

    async createLogsUsuario(req, res) {
        
        try {
            const logs = Array.isArray(req.body) ? req.body : [req.body]; 
            
            // const response = await postLogUsuario(logs);
            const response = await axios.post(`${url}/api/log-usuario`, logs);

            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

}

export default new LogsControllers();