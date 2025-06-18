import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getEmpresasLista, updateEmpresa } from "../repositories/empresas.js";
import 'dotenv/config';
const url = process.env.API_URL|| 'localhost:6001'

class EmpresaControllers {

    async getAllEmpresas(req, res) {
        let {idEmpresa, idSubGrupoEmpresa,  page, pageSize} = req.query;
        idEmpresa = idEmpresa ? idEmpresa : '';
        idSubGrupoEmpresa = idSubGrupoEmpresa ? idSubGrupoEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
       
        try {
            const response = await axios.get(`${url}/api/empresa.xsjs`)
            // const response = await getEmpresasLista(idEmpresa, idSubGrupoEmpresa,  page, pageSize)
            
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error; // Lança o erro para tratamento posterior, se necessário
        }
    }
    async getListaEmpresas(req, res,) {
        let {idEmpresa} = req.query;

        try {
            idEmpresa = idEmpresa ? idEmpresa : '';
            const apiUrl = `${url}/api/empresa.xsjs?id=${idEmpresa}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error; // Lança o erro para tratamento posterior, se necessário
        }
    }
    
    async getAllGrupoEmpresarial(req, res, ) {
        let {idEmpresa, pageNumber, dataPesquisa} = req.query;
        
        const pageSize = 100;
        const offset = (pageNumber - 1) * pageSize;
        // const dataPesquisaFormatada = dataFormatada(dataPesquisa)
        try {
            const response = await axios.get(`${url}/api/grupo-empresarial.xsjs`)
            
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error; // Lança o erro para tratamento posterior, se necessário
        }
    }

    
    async getSelectLojaVouchers(req, res,) {
        let {idGrupoEmpresarial, pageNumber, dataPesquisa} = req.query;

        idGrupoEmpresarial = Number(idGrupoEmpresarial) ? idGrupoEmpresarial : '';
    
        const pageSize = 100;
        const offset = (pageNumber - 1) * pageSize;
        // const dataPesquisaFormatada = dataFormatada(dataPesquisa)
        try {
            const response = await axios.get(`${url}/api/empresa.xsjs?idSubGrupoEmpresa=${idGrupoEmpresarial}`)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error; // Lança o erro para tratamento posterior, se necessário
        }
       
    }
    async getById(req, res) {

    }

    async putListaEmpresas(req, res) {
        try {
            const empresas = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await updateEmpresa(empresas)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async deleteFuncionarios(req, res) {

    }


}

export default new EmpresaControllers();