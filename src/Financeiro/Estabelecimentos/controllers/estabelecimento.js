
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getEstabelecimentos } from "../repositories/estabelecimentos.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class EstabelecimentoControllers {
    async getListaEstabelecimentos(req, res) {
        let { idGrupo, idEstabelecimento, idEmpresa,  page, pageSize } = req.query;
    
    
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