import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class ContaBancoControllers  {

    async getListaContaBanco(req,res) {
        let {  } = req.query;

        try {
            const apiUrl = `${url}/api/conta-banco.xsjs`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

}

export default new ContaBancoControllers();