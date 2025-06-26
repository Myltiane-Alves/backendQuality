import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getCategoriaReceitaDespesa } from "../repositories/categoriaReceitaDespesa.js";
import 'dotenv/config';
const url = process.env.API_URL;

class CategoriaReceitaDespesasControllers  {

    async getListaCategoriaDespesas(req,res) {
        
        let {idCategoria, tipoCategoria, pageSize, page } = req.query;
        try {
            idCategoria = idCategoria ? idCategoria : '';
            tipoCategoria = tipoCategoria ? tipoCategoria : '';
            pageSize = pageSize ? pageSize : '';
            page = page ? page : '';
            const apiUrl = `${url}/api/categoria-receita-despesa.xsjs`;
            const response = await axios.get(apiUrl)
            // const response = await getCategoriaReceitaDespesa(idCategoria, tipoCategoria, pageSize, page)
            return res.json(response.data); 
        } catch(error) {
            console.error("Erro no CategoriaReceitaDespesasControllers.getListaCategoriaDespesas:", error);
            throw error;
        }
        
    }

    async getListaCategoriaDespesasFinanceira(req,res) {
        let { } = req.query;

        try {

            const apiUrl = `http://164.152.245.77:8000/quality/concentrador/api/categoria-receita-despesa.xsjs?tipo=D`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }
}

export default new CategoriaReceitaDespesasControllers();