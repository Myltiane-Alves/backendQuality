import { createPromocao, getPromocaoAtiva, updatePromocao } from "../repositories/promocaoAtiva.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class PromocaoControllers  {

    async getListaPromocoesAtivas(req, res) {
        let { idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query; 
            idResumoPromocao = idResumoPromocao ? idResumoPromocao : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
            dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';     
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            const response = await getPromocaoAtiva(idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response);
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
            const response = await createPromocao(dados)
         
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

}

export default new PromocaoControllers();