import axios from "axios";
import { getFuncionariosDescontos } from "../repositories/funcionarioDesconto.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class DashBoardFuncionariosControllers {


    async getListaFuncionarios(req, res,) {
        let { idEmpresa, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            const response = await getFuncionariosDescontos(idEmpresa, page, pageSize)
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error; 
        }
    }

}

export default new DashBoardFuncionariosControllers();