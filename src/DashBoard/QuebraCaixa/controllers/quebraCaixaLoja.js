import axios from "axios";
import { getQuebraCaixaLoja } from "../repositories/quebraCaixaLoja.js";
import { getQuebraCaixa, updateStatusQuebraCaixa } from "../repositories/listaQuebraCaixa.js";
import { createQuebraCaixa, updateQuebraCaixa, } from "../repositories/todos.js";
import { getQuebraCaixaID } from "../repositories/quebraCaixa.js";

class QuebraCaixaControllers {
    async getListaQuebraCaixaResumoADM(req, res) {
        let { idEmpresa, dataPesquisa, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        dataPesquisa = dataPesquisa ? dataPesquisa : '';
        
        try {
            
            const response = await getQuebraCaixaLoja(idEmpresa, dataPesquisa, page, pageSize)
           
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }

    async getListaQuebraCaixa(req, res) {
        let {idMovimentoCaixa, idMarca, idEmpresa, cpfOperadorQuebra, stQuebraPositivaNegativa, dataPesquisaInicio, dataPesquisaFim, pageSize, page } = req.query;
        idMovimentoCaixa = idMovimentoCaixa ? idMovimentoCaixa : '';
        idMarca = idMarca ? idMarca : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        cpfOperadorQuebra = cpfOperadorQuebra ? cpfOperadorQuebra : '';
        stQuebraPositivaNegativa = stQuebraPositivaNegativa ? stQuebraPositivaNegativa : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        
        try {
            
            const response = await getQuebraCaixa(idMovimentoCaixa, idMarca, idEmpresa, cpfOperadorQuebra, stQuebraPositivaNegativa, dataPesquisaInicio, dataPesquisaFim, pageSize, page)
            
            return res.json(response); 
        } catch (error) {
            console.error("Erro no QuebraCaixaControllers.getListaQuebraCaixa:", error);
            throw error;
        }
        
    }

    async getQuebraCaixaID(req, res) {
        let { idQuebraCaixa, page, pageSize } = req.query;

        idQuebraCaixa = idQuebraCaixa ? idQuebraCaixa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        
        try {
            
            const response = await getQuebraCaixaID(idQuebraCaixa, page, pageSize)
            
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    async putListaStatusQuebraCaixa(req, res) {
        let { IDQUEBRACAIXA, STATIVO } = req.body;

        // Verifica se os parâmetros estão presentes
        if (!IDQUEBRACAIXA || !STATIVO) {
            return res.status(400).json({ error: "IDQUEBRACAIXA e STATIVO são obrigatórios" });
        }
    
        try {
            const quebras = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateStatusQuebraCaixa(quebras);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }
    async putQuebraCaixa(req, res) {
        try {
            const quebras = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateQuebraCaixa(quebras);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }

    async postQuebraCaixa(req, res) {
        try {
            const quebras = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  createQuebraCaixa(quebras);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
       
    }
}

export default new QuebraCaixaControllers();