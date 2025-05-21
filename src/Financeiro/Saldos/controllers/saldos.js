
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
      console.error("Erro no SaldoControllers.getListaExtratoBonificacaoById:", error);
      throw error;
    }
  }

  async getListaSaldoExtratoLoja(req, res) {
    let { idGrupoEmpresarial, dataPesquisa, pageSize, page } = req.query;
    idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
    dataPesquisa = dataPesquisa ? dataPesquisa : dataFormatada();
    pageSize = pageSize ? pageSize : '';
    page = page ? page : '';

    // let partes = dataPesquisa.split('/');
    // dataPesquisa = `${partes[2]}-${partes[1]}-${partes[0]}`;
    // let dataFinal = new Date(partes[2], partes[1] - 1, partes[0]);
    // let dd = ('0' + dataFinal.getDate()).slice(-2);
    // let mm = ('0' + (dataFinal.getMonth() + 1)).slice(-2);
    // let yyyy = dataFinal.getFullYear();
    // dataPesquisa = `${yyyy}-${mm}-${dd}`;

    if (dataPesquisa || '' && dataPesquisa === undefined) {
      try {
        const response = await getLojaSaldoPorGrupo(idGrupoEmpresarial, dataPesquisa, pageSize, page);
        return res.json(response);
      } catch (error) {
        console.error("Erro no SaldoControllers.getListaSaldoExtratoLoja:", error);
        throw error;
      }
    } else {
      console.error("Erro no SaldoControllers.getListaSaldoExtratoLoja: dataPesquisa não informada");
    }
  }


  async createMovimentoSaldoBonificacao(req, res) {
    let { IDFUNCIONARIO, TIPOMOVIMENTO, VRMOVIMENTO, OBSERVACAO, IDFUNCIONARIORESP } = req.body;

    try {
      
      const response = await postMovimentoSaldoBonificacao(IDFUNCIONARIO, TIPOMOVIMENTO, VRMOVIMENTO, OBSERVACAO, IDFUNCIONARIORESP)

      return res.json(response); 
    } catch (error) {
      console.error("Erro no SaldoControllers.createMovimentoSaldoBonificacao:", error);
      throw error;
    }
  }
}

export default new SaldosControllers();