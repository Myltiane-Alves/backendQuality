import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import 'dotenv/config';
const url = process.env.API_URL;


class ContaBancoControllers  {

    async getListaContaBanco(req,res) {
        let {  } = req.query;

        try {
            const apiUrl = `${url}/api/conta-banco.xsjs`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); 
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

}

export default new ContaBancoControllers();