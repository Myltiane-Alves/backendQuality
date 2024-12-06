
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";

import { getMovimentoSaldoBonificacaoById, postMovimentoSaldoBonificacao } from "../repositories/movimentoSaldoBonificacao.js";
import { getLojaSaldoPorGrupo } from "../repositories/saldoLojaPorGrupo.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class SaldosControllers {
    async getListaExtratoBonificacaoById(req, res) {
        let { idFuncionario, page, pageSize } = req.query;
        // idFuncionario = idFuncionario ? idFuncionario : '';
        try {
          // const apiUrl = `${url}/api/financeiro/movimento-saldo-bonificacao.xsjs?pageSize=500&idFuncionario=${idFuncionario}`
          const response = await getMovimentoSaldoBonificacaoById(idFuncionario,  page, pageSize)
    
          return res.json(response.data);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }

    async getListaSaldoExtratoLoja(req, res) {
      let { idGrupoEmpresarial, dataPesquisa, pageSize, page } = req.query;
      idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
      try {

        const response = await getLojaSaldoPorGrupo(idGrupoEmpresarial, dataPesquisa, pageSize, page)
  
        return res.json(response);
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
    }


    async createMovimentoSaldoBonificacao(req, res) {
        let { IDFUNCIONARIO, TIPOMOVIMENTO, VRMOVIMENTO, OBSERVACAO, IDFUNCIONARIORESP } = req.body;
    
        try {
          
          const response = await postMovimentoSaldoBonificacao(IDFUNCIONARIO, TIPOMOVIMENTO, VRMOVIMENTO, OBSERVACAO, IDFUNCIONARIORESP)
    
          return res.json(response); 
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }
}

export default new SaldosControllers();