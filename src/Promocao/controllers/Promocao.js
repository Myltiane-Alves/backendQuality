import { createPromocao, getPromocaoAtiva, updatePromocao } from "../repositories/promocaoAtiva.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;
import axios from "axios";
class PromocaoControllers  {


   async getListaPromocoesAtivas(req, res) {
        let { idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query; 
            idResumoPromocao = idResumoPromocao ? idResumoPromocao : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
            dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';     
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            const apiUrl = `${url}/api/promocao-ativa.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idResumoPromocao=${idResumoPromocao}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getPromocaoAtiva(idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response.data);
        } catch(error) {
            console.error("erro no PromocaoControllers  getListaPromocoesAtivas:", error);
            throw error;
        } 
    }
    async getListaDetalhesPromocoesAtivas(req, res) {
        let { idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize} = req.query; 
            idResumoPromocao = idResumoPromocao ? idResumoPromocao : '';    
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            const apiUrl = `${url}/api/detalhe-promocao-ativa.xsjs?idResumoPromocao=${idResumoPromocao}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getPromocaoAtiva(idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response.data);
        } catch(error) {
            console.error("erro no PromocaoControllers  getListaPromocoesAtivas:", error);
            throw error; 
        } 
    }

    async putPromocao(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await updatePromocao(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    
    async postPromocao(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
                  
            const response = await axios.post(`${url}/api/promocao-ativa.xsjs`, dados);

            return res.status(200).json({
                message: "Promoção(s) criada(s) com sucesso",
                data: response.data
            });
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

}

export default new PromocaoControllers();


// '[{
//     "TPAPARTIRDE":0,
//     "TPAPLICADOA":2,
//     "TPFATORPROMO":2,
//     "APARTIRDEQTD":"1",
//     "APARTIRDOVLR":0,
//     "FATORPROMOVLR":0,
//     "FATORPROMOPERC":"2",
//     "VLPRECOPRODUTO":0,
//     "DTHORAINICIO":"2025-05-26",
//     "DTHORAFIM":"2025-05-26 23:59:59",
//     "DSPROMOCAOMARKETING":"TESTANDO DO REACT PARA HOMOLOGACAO QUALITY",
//     "STEMPRESAPROMO":"True",
//     "STDETPROMOORIGEM":"True",
//     "STDETPROMODESTINO":"True",
//     "IDEMPRESA":[3],
//     "IDGRUPOEMDESTINO":-1,
//     "IDSUBGRUPOEMDESTINO":-1,
//     "IDMARCAEMDESTINO":-1,
//     "IDFORNECEDOREMDESTINO":-1,
//     "IDPRODUTODESTINO":["1_330231104","2_390141096"],
//     "IDGRUPOEMORIGEM":-1,
//     "IDSUBGRUPOEMORIGEM":-1,
//     "IDMARCAEMORIGEM":-1,
//     "IDFORNECEDOREMORIGEM":-1,
//     "IDPRODUTOORIGEM":["1_330231104","2_390141096"],
// "IDPRODUTO":["1_330231104","2_390141096"]}]'