import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getListaPrecos } from "../repositories/listaPreco.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;

class ListaPrecoControllers {

    async getListaPrecoPorMarca(req, res) {
        let { idResumoLista, idLoja, nomeLista, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
        idResumoLista = idResumoLista ? idResumoLista : '';
        idLoja = idLoja ? idLoja : '';
        nomeLista = nomeLista ? nomeLista : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : ''; 
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/listas-de-precos.xsjs?dtInicio=${dataPesquisaInicio}&dtFim=${dataPesquisaFim}&idLoja=${idLoja}&idLista=${idLista}&nomeLista=${nomeLista}`;
            // const response = await axios.get(apiUrl)
            const response = await getListaPrecos(idResumoLista, idLoja, nomeLista,  dataPesquisaInicio, dataPesquisaFim,  page, pageSize)
            return res.json(response); 
        } catch(error) {
            console.error('Erro no controller Lista de Preço no getListaPrecoPorMarca:', error);
            throw error;
        } 
    }
}

export default new ListaPrecoControllers()