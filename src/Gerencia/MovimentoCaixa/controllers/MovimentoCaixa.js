import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getMovimentoCaixaGerencia } from "../repositories/gerencia.js";
import { putAtualizacaoStatus } from "../repositories/atualizacaoStatus.js";
import { putAjusteRecebimento } from "../repositories/ajusteRecebimento.js";
import { getFechamentoCaixa } from "../repositories/fechamentoCaixa.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;
class MovimentoCaixaControllers {

    async listaCaixasMovimentojuste(req, res) {

        let { idEmpresa, pageNumber, dataPesq } = req.query;
        if (!isNaN(idEmpresa)) {
            idEmpresa = Number(idEmpresa);
            const pageSize = 100;
            const offset = (pageNumber - 1) * pageSize;
            dataPesq = dataFormatada(dataPesq)
            try {
                const apiUrl = `${url}/api/movimento-caixa/ajuste-fisicodinheiro.xsjs?pagesize=${pageSize}&idEmpresa=${idEmpresa}&offset=${offset}`
                const response = await axios.get(apiUrl)

                // return console.log(response.data);
                return res.json(response.data);
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        }
    }
    async listaAjusteMovimentoCaixa(req, res) {

        let { idMovimentoCaixa } = req.query;
        if (!isNaN(idMovimentoCaixa)) {
            idMovimentoCaixa = Number(idMovimentoCaixa);

            try {
                const apiUrl = `${url}/api/movimento-caixa/gerencia.xsjs?idMovimentoCaixa=${idMovimentoCaixa}`
                const response = await axios.get(apiUrl)

                // return console.log(response.data);
                return res.json(response.data);
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        }
    }
    async listaCaixasMovimentoGerencia(req, res) {

        let { idEmpresa, idMovimentoCaixa, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

        idEmpresa = Number(idEmpresa) ? idEmpresa : '';
        idMovimentoCaixa = idMovimentoCaixa ? idMovimentoCaixa : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';

        try {

            const response = await getMovimentoCaixaGerencia(idEmpresa, idMovimentoCaixa, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaFechamentoCaixa(req, res) {
        let { idEmpresa, idMovimentoCaixa, idCaixa, dataPesquisa,  page, pageSize } = req.query;
            idEmpresa = idEmpresa ? idEmpresa : '';
            idMovimentoCaixa = idMovimentoCaixa ? idMovimentoCaixa : '';
            idCaixa = idCaixa ? idCaixa : '';
            dataPesquisa = dataPesquisa ? dataPesquisa : '';
            page = page ? page : ''
            pageSize = pageSize ? pageSize : ''
        try {
            
            const apiUrl = `${url}/api/movimento-caixa/fechamento-caixa.xsjs?idMovimentoCaixa=${idMovimentoCaixa}`
            const response = await axios.get(apiUrl)
            // const response = await getFechamentoCaixa(idEmpresa, idMovimentoCaixa, idCaixa, dataPesquisa,  page, pageSize)
    
          return res.json(response.data);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
      
      }

    async putListaAtualizacaoStatus(req, res) {
        try {
            const status = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await putAtualizacaoStatus(status);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }
    async putListaAjusteRecebimento(req, res) {
        try {
            const status = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await putAjusteRecebimento(status);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new MovimentoCaixaControllers();