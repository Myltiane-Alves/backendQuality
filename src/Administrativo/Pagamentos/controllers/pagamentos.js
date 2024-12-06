import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getFormaPagamento } from "../repositories/formaPagamento.js";
import { getPagamentoTef } from "../repositories/pagamento-tef.js";
import { getPagamentoPos } from "../repositories/pagamento-pos.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class AdmPagamentosControllers {
 
    async getListaFormaPagamento(req, res) {
        let {} = req.query; 
        try {

            // const apiUrl = `${url}/api/administrativo/formapagamento.xsjs`;
            // const response = await axios.get(apiUrl)
            const response = await getFormaPagamento()
        
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }  
    }
    async getListaPagamentoTef(req, res) {
        let {numeroTef, page, pageSize} = req.query; 
        try {

            numeroTef = numeroTef ? numeroTef : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
            const apiUrl = `${url}/api/administrativo/pagamento-tef.xsjs`;
            const response = await axios.get(apiUrl)
            // const response = await getPagamentoTef(numeroTef, page, pageSize)
        
            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }  
    }
    async getListaPagamentoPos(req, res) {
        let {numeroPos, page, pageSize} = req.query; 
        try {

            numeroPos = numeroPos ? numeroPos : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
            const response = await getPagamentoPos(numeroPos, page, pageSize)
        
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }  
    }
    
}

export default new AdmPagamentosControllers();