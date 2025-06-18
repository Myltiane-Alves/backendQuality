
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";

import { getMovimentoSaldoBonificacaoById, postMovimentoSaldoBonificacao } from "../repositories/movimentoSaldoBonificacao.js";
import { getLojaSaldoPorGrupo } from "../repositories/saldoLojaPorGrupo.js";
import 'dotenv/config';
const url = process.env.API_URL;


class SaldosControllers {
    async getListaExtratoBonificacaoById(req, res) {
        let { idFuncionario, page, pageSize } = req.query;
        idFuncionario = idFuncionario ? idFuncionario : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
          const apiUrl = `${url}/api/financeiro/movimento-saldo-bonificacao.xsjs?page=${page}&pageSize=${pageSize}&idFuncionario=${idFuncionario}`
          const response = await axios.get(apiUrl)
          // const response = await getMovimentoSaldoBonificacaoById(idFuncionario,  page, pageSize)
    
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
        const apiUrl = `${url}/api/financeiro/saldo-loja-por-grupo.xsjs?idGrupoEmpresarial=${idGrupoEmpresarial}&dataPesquisa=${dataPesquisa}&pageSize=${pageSize}&page=${page}`
        const response = await axios.get(apiUrl)

        // const response = await getLojaSaldoPorGrupo(idGrupoEmpresarial, dataPesquisa, pageSize, page)
  
        return res.json(response.data);
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
    }


    async createMovimentoSaldoBonificacao(req, res) {
        // let { IDFUNCIONARIO, TIPOMOVIMENTO, VRMOVIMENTO, OBSERVACAO, IDFUNCIONARIORESP } = req.body;
    
      
        try {
          const despesas = Array.isArray(req.body) ? req.body : [req.body]; 
  
          const response = await axios.post(`${url}/api/financeiro/movimento-saldo-bonificacao.xsjs`, despesas);
          // const response = await postMovimentoSaldoBonificacao(IDFUNCIONARIO, TIPOMOVIMENTO, VRMOVIMENTO, OBSERVACAO, IDFUNCIONARIORESP)
          return res.json(response.data);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
    }
}

export default new SaldosControllers();