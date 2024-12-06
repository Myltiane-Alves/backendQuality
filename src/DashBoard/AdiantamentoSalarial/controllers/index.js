import axios from "axios";
import { getAdiantamentosLojas, putAdiantamentosLojas } from "../repositories/adiantamento-lojas.js";
import { getAdiantamentosFuncionarios } from "../repositories/funcionarios.js";
import { createAdiantamentoSalarial, getAdiantamentoSalarialDashBoard, updateAdiantamentoSalarial } from "../repositories/adiantamentoSalarial.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;


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
            // http://164.152.245.77:8000/quality/concentrador_homologacao/api/dashboard/adiantamento-salarial/adiantamentolojas.xsjs?idEmpresa=0&dataPesquisaIni=2024-12-06&dataPesquisaFim=2024-12-06&idMarca=undefined
            const apiUrl = `${url}/api/dashboard/adiantamento-salarial/adiantamentolojas.xsjs?idEmpresa=${idEmpresa}&dataPesquisaIni=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${idMarca}&pageSize=${pageSize}&page=${page}`;
           const response = await axios.get(apiUrl);
            // const response = await getAdiantamentosLojas(idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page)

            return res.json(response.data); // Retorna
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
        
        STATIVO = STATIVO ? STATIVO : '';
        IDADIANTAMENTOSALARIO = IDADIANTAMENTOSALARIO ? IDADIANTAMENTOSALARIO : '';
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