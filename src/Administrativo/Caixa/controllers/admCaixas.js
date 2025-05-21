import axios from "axios";
import { getListaMovimentoCaixa, getListaPCJ, getVenda } from "../repositories/listaCaixaMovimentos.js";
import { getCaixasFechados } from "../repositories/listaCaixasFechados.js";


class ADMCaixasControllers {
    async getListaCaixasMovimento(req, res) {
        let { idEmpresa, dataFechamento, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        dataFechamento = dataFechamento ? dataFechamento : '';
        
        try {
            // const apiUrl = `${url}/api/administrativo/quebra-caixa-loja.xsjs?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}`
            const response = await getListaMovimentoCaixa(idEmpresa, dataFechamento, page, pageSize)
            console.log(response)
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }
    async getListaCaixasFechados(req, res) {
        let { idEmpresa, dataFechamento, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        dataFechamento = dataFechamento ? dataFechamento : '';
        
        try {
            // const apiUrl = `${url}/api/administrativo/quebra-caixa-loja.xsjs?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}`
            const response = await getCaixasFechados(idEmpresa, dataFechamento, page, pageSize)
      
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }
}

export default new ADMCaixasControllers();