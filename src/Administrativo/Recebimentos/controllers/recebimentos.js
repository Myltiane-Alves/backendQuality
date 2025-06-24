import axios from "axios";
import 'dotenv/config';
const url = process.env.API_URL;
import { getFuncionarioRecebimento } from "../repositories/funcionarioRecebimentos.js";
import { getRecebimento } from "../repositories/recebimento.js";

class AdmRecebimentosControllers {
 
    async getListaFuncionarioRecebimento(req, res) {
        let { idEmpresa, page, pageSize} = req.query; 
        try {
            const response = await getFuncionarioRecebimento(idEmpresa, page, pageSize)
        
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }  
    }

    async getListaPagamentoVenda(req, res) {
        let { idVenda,  } = req.query;

        idVenda = idVenda ? idVenda : '';
        try {
            // const response = await getRecebimento(idVenda)
            const apiUrl = `${url}/api/dashboard/venda/recebimento.xsjs?id=${idVenda}`;

            const response = await axios.get(apiUrl) 
            return res.json(response.data);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }  
    }
    
}

export default new AdmRecebimentosControllers();