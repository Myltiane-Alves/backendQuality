
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getResumoVoucher } from "../repositories/resumoVoucher.js";

let url = `http://164.152.245.77:8000/quality/concentrador`;


class VoucherControllers {
    async getListaResumoVoucherFinanceiro(req, res) {
        let { idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page } = req.query;
    
        // idEmpresa = idEmpresa ? idEmpresa : '';
        // dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        // dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        try {
          // const apiUrl = `${url}/api/financeiro/resumo-voucher.xsjs?pageSize=500&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
          const response = await getResumoVoucher(idEmpresa, dataPesquisaInicio, dataPesquisaFim, pageSize, page)
    
          return res.json(response);
        } catch (error) {
          console.error("Unable to connect to the database:", error);
          throw error;
        }
      }
}

export default new VoucherControllers();