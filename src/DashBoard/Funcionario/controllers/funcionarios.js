import axios from "axios";
import { getFuncionariosDescontos } from "../repositories/funcionarioDesconto.js";
import 'dotenv/config';
const url = process.env.API_URL;


class DashBoardFuncionariosControllers {


    async getListaFuncionarios(req, res,) {
        let { idEmpresa, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // http://164.152.245.77:8000/quality/concentrador/api/dashboard/funcionario.xsjs?idEmpresa=1

            const apiUrl = `${url}/api/dashboard/funcionario.xsjs?idEmpresa=${idEmpresa}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl);
            // const response = await getFuncionariosDescontos(idEmpresa, page, pageSize)
            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error; 
        }
    }

}

export default new DashBoardFuncionariosControllers();