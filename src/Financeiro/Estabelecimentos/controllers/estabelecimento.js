
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getEstabelecimentos } from "../repositories/estabelecimentos.js";
import 'dotenv/config';
const url = process.env.API_URL;

class EstabelecimentoControllers {
  async getListaEstabelecimentos(req, res) {
    let { idGrupo, idEstabelecimento, idEmpresa, page, pageSize } = req.query;


    pageSize = pageSize ? pageSize : ''
    page = page ? page : '';
    idEmpresa = idEmpresa ? idEmpresa : '';
    idGrupo = idGrupo ? idGrupo : '';
    try {
      const apiUrl = `${url}/api/financeiro/estabelecimentos.xsjs?page=${page}&pageSize=${pageSize}&idGrupoEmpresa=${idGrupo}&idLojaEmpresa=${idEmpresa}`
      const response = await axios.get(apiUrl);
      // const response = await getEstabelecimentos(idGrupo, idEstabelecimento, idEmpresa,  page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }

  }
}

export default new EstabelecimentoControllers();