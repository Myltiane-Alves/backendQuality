import axios from "axios";
import { getParceiroNegocio } from "../repositories/parceiroNegocio.js";
import { getProdutoQuality } from "../../Produtos/repositories/produtoQuality.js";
import { getGrupoProduto } from "../../Comercial/Produto/repositories/grupoProduto.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class ProdutoSAPControllers  {


    async getListaProdutosLojaQuality(req, res) {
        let { descricaoProduto, idEmpresa, idListaLoja, codBarrasOuNome, page, pageSize } = req.query;
            descricaoProduto = descricaoProduto ? descricaoProduto : ''; 
            idEmpresa = idEmpresa ? idEmpresa : ''; 
            idListaLoja = idListaLoja ? idListaLoja : '';         
            codBarrasOuNome = codBarrasOuNome ? codBarrasOuNome : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            // const apiUrl = `${url}/api/produto-sap/produto-quality.xsjs?codeBarsOuNome=${descricaoProduto}&IdEmpresaLoja=${idEmpresa}&IdListaLoja=${idListaLoja}`;
            // const response = await axios.get(apiUrl)
            const response = await getProdutoQuality(idEmpresa, codBarrasOuNome, page, pageSize);
            return res.json(response); 
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async getListaParceiroNegocio(req, res) {
        let { idParceiro, page, pageSize } = req.query; 
            idParceiro = idParceiro ? idParceiro : '';        
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            const response = await getParceiroNegocio(idParceiro, page, pageSize)
            return res.json(response);
        } catch(error) {
            console.error("erro no ProdutoSAPControllers getListaParceiroNegocio:", error);
            throw error;
        } 
    }

    async getListaGrupoProdutoSap(req, res) {
        let { idGrupo, page, pageSize } = req.query; 
            idGrupo = idGrupo ? idGrupo : '';        
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            const response = await getGrupoProduto(idGrupo, page, pageSize)
            return res.json(response);
        } catch(error) {
            console.error("erro no ProdutoSAPControllers getListaGrupoProduto:", error);
            throw error;
        } 
    }

    async getListaGrade(req, res) {
        let { idGrupo  } = req.query; 
        idGrupo = idGrupo ? idGrupo : '';        
    
        try {   
            const apiUrl = `${url}/api/produto-sap/grade.xsjs?idgrupograde=${idGrupo}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    
    async getListaGrupoProdutoSap(req, res) {
        let { idEmpresa } = req.query;

        try {
            const apiUrl = `${url}/api/produto-sap/grupo.xsjs`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
}

export default new ProdutoSAPControllers();