
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getEstabelecimentos } from "../repositories/estabelecimentos.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class EstabelecimentoControllers {
  async getListaEstabelecimentos(req, res) {
    let { idGrupo, idEstabelecimento, idEmpresa,  page, pageSize } = req.query;


      idGrupo = idGrupo ? idGrupo : '';
      idEstabelecimento = idEstabelecimento ? idEstabelecimento : '';
      idEmpresa = idEmpresa ? idEmpresa : '';
      page = page ? page : '';
      pageSize = pageSize ? pageSize : ''
    try {
      // const apiUrl = `${url}/api/financeiro/estabelecimentos.xsjs?page=${page}&pageSize=${pageSize}&idGrupoEmpresa=${idGrupo}&idLojaEmpresa=${idEmpresa}`
      const response = await getEstabelecimentos(idGrupo, idEstabelecimento, idEmpresa,  page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Erro no EstabelecimentoControllers.getListaEstabelecimentos: ", error);
      throw error;
    }
  
  }
}

export default new EstabelecimentoControllers();