
import axios from "axios";
import { getLogsUsuarios, postLogUsuario } from "../repositories/logWeb.js";

const url = process.env.API_URL;



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
            const response = await axios.post(`${url}/api/log-web.xsjs`, logs);
            
            return res.json(response.data);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

}

export default new LogsControllers();