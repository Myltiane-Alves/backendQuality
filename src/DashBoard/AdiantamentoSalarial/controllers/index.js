import axios from "axios";
import { getAdiantamentosLojas, putAdiantamentosLojas } from "../repositories/adiantamento-lojas.js";
import { getAdiantamentosFuncionarios } from "../repositories/funcionarios.js";
import { createAdiantamentoSalarial, getAdiantamentoSalarialDashBoard, updateAdiantamentoSalarial } from "../repositories/adiantamentoSalarial.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class DashBoardAdiantamentoSalarialControllers {


    async getListaAdiantamentoSalarialLoja(req, res) {
        let { idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        idMarca = idMarca ? idMarca : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        pageSize = pageSize ? pageSize : '';
        page = page ? page : '';

        try {
            
            const response = await getAdiantamentosLojas(idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page)

            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }
    async getListaAdiantamentosFuncionarios(req, res) {
        let { idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        pageSize = pageSize ? pageSize : '';
        page = page ? page : '';

        try {
            
            const response = await getAdiantamentosFuncionarios(idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page)

            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaAdiantamentosSalarialDashBoard(req, res) {
        let { idEmpresa, dataPesquisa, pageSize, page } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        dataPesquisa = dataPesquisa ? dataPesquisa : '';
        pageSize = pageSize ? pageSize : '';
        page = page ? page : '';

        try {
            
            const response = await getAdiantamentoSalarialDashBoard(idEmpresa, dataPesquisa, pageSize, page)

            return res.json(response)
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async updateAdiantamentoStatus(req, res) {
        let { STATIVO,IDADIANTAMENTOSALARIO } = req.body;
        
        if(!STATIVO || !IDADIANTAMENTOSALARIO) {
            return res.status(400).json({error: "IDANDIANTAMENTOSALARIO e STATIVO são obrigatórios"})
        }
        try {
          const response = await putAdiantamentosLojas(STATIVO, IDADIANTAMENTOSALARIO, )
    

          return res.json(response);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }

    async putAdiantamentoSalarial(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await updateAdiantamentoSalarial(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
 
    async postAdiantamentoSalarial(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await createAdiantamentoSalarial(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
}

export default new DashBoardAdiantamentoSalarialControllers();