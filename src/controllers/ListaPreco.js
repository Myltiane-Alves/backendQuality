import axios from "axios";
import { dataFormatada } from "../utils/dataFormatada.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;

class ListaPrecoControllers {

    async getListaPrecoPorMarca(req, res) {
        let { 
            idLoja,
            idLista,
            nomeLista,
            dataPesquisaInicio, 
            dataPesquisaFim,
        } = req.query;
    
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : ''; 
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        idLoja = idLoja ? idLoja : '';
        idLista = idLista ? idLista : '';
        nomeLista = nomeLista ? nomeLista : '';

        try {
            const apiUrl = `${url}/api/listas-de-precos.xsjs?dtInicio=${dataPesquisaInicio}&dtFim=${dataPesquisaFim}&idLoja=${idLoja}&idLista=${idLista}&nomeLista=${nomeLista}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); 
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
}

export default new ListaPrecoControllers()