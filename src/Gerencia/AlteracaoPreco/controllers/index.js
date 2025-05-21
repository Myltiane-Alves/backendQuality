import axios from "axios";
import { getAlteracaoPreco } from "../repositories/alteracao.js";


let url = `http://164.152.245.77:8000/quality/concentrador`;



class GERAlteracaoPrecoControllers {
    async getListaAlteracaoPreco(req, res) {
        let {
            idMarca,
            idEmpresa,
            grupo,
            subGrupo,
            descProduto,
            codBarras,
            estoque,
            dataPesquisaInicio,
            dataPesquisaFim,
            page,
            pageSize 
        } = req.query;


        idMarca = idMarca ? idMarca : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        grupo = grupo ? grupo : '';
        subGrupo = subGrupo ? subGrupo : '';
        descProduto = descProduto ? descProduto : '';
        codBarras = codBarras ? codBarras : '';
        estoque = estoque ? estoque : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        
        console.log(estoque, 'estoque')
        try {
            const apiUrl = `${url}/api/administrativo/alteracao-preco.xsjs?idEmpresa=${idEmpresa}&grupo=${grupo}&subgrupo=${subGrupo}&produto=${descProduto}&codigobarras=${codBarras}&estoque=${estoque}&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl);
            // const response = await getAlteracaoPreco(idMarca, idEmpresa, grupo, subGrupo, descProduto, codBarras, estoque, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
        
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }
}



export default new GERAlteracaoPrecoControllers();