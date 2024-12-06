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
            const response = await getRecebimento(idVenda)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }  
    }
    
}

export default new AdmRecebimentosControllers();