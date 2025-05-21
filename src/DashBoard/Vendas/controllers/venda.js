
import axios from "axios";
import { dataFormatada } from "../../../utils/dataFormatada.js";
import { getDetalheVendas } from "../repositories/detalheVenda.js";
import { getResumoVendaCaixaDetalhado } from "../repositories/resumoVendaCaixaDetalhado.js";
import { getResumoVendaConvenioDesconto } from "../repositories/resumoVendaConvenioDesconto.js";
import { getVendasResumida } from "../repositories/vendaResumida.js";
import { getVendaVendedor } from "../repositories/vendasVendedor.js";
import { getRecebimento } from "../repositories/recebimentos.js";
import { getCaixasMovimentos } from "../repositories/listaCaixaMovimentos.js";
import { getResumoVendaCaixa } from "../repositories/resumoVendaCaixa.js";
import { getResumoVendaConvenio } from "../repositories/resumoVendaConvenio.js";
import { getCaixasFechadosNaoConferidos } from "../repositories/listaCaixasFechadosNaoConferidos.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;


class DashBoardVendasControllers {

    async getRetornoVendasAtivasDetalheProduto(req, res) {
        let { idEmpresa, idVenda } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        idVenda = idVenda ? idVenda : '';
        try {
            // const apiUrl = `${url}/api/dashboard/venda/detalhe-venda.xsjs?idEmpresa=${idEmpresa}&idVenda=${idVenda}`
            // const response = await axios.get(apiUrl)
            const response = await getDetalheVendas(idVenda, idEmpresa);

            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaVendaDetalhe(req, res) {
        let { statusCancelado, idVenda, idEmpresa, dataFechamento, page, pageSize } = req.query;
        statusCancelado = statusCancelado ? statusCancelado : '';
        idVenda = idVenda ? idVenda : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        dataFechamento = dataFechamento ? dataFechamento : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/dashboard/venda/resumo-venda-caixa-detalhado.xsjs?idEmpresa=${idEmpresa}&idVenda=${idVenda}`
            // const response = await axios.get(apiUrl)
            const response = await getResumoVendaCaixaDetalhado(statusCancelado, idVenda, idEmpresa, dataFechamento, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getVendasConvenioDescontoFuncionario(req, res) {
        let { statusCancelado, idVenda, idEmpresa, idFuncionario, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
        statusCancelado = statusCancelado ? statusCancelado : '';
        idVenda = idVenda ? idVenda : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        idFuncionario = idFuncionario ? idFuncionario : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            
            const response = await getResumoVendaConvenioDesconto(statusCancelado, idVenda, idEmpresa, idFuncionario, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("Erro no DashBoardVendasControllers.getVendasConvenioDescontoFuncionario:", error);
            throw error;
        }
    }
    async getListaResumoVendasConvenio(req, res) {
        let { statusCancelado, idVenda, idEmpresa, dataFechamento, page, pageSize } = req.query;
            statusCancelado = statusCancelado ? statusCancelado : '';
            idVenda = idVenda ? idVenda : '';
            idEmpresa = idEmpresa ? idEmpresa : '';
            dataFechamento = dataFechamento ? dataFechamento : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            
            const response = await getResumoVendaConvenio(statusCancelado, idVenda, idEmpresa, dataFechamento, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("Erro no DashBoardVendasControllers.getVendasConvenioDescontoFuncionario:", error);
            throw error;
        }
    }

    async getListaVendasLojaResumidoGerencia(req, res) {
        let { idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';


        try {
          
            // const apiUrl = `http://164.152.245.77:8000/quality/concentrador/api/dashboard/venda/venda-resumido.xsjs?idLoja=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
            // const response = await axios.get(apiUrl);
            const response = await getVendasResumida(idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize);
            return res.json(response);
        } catch (error) {
            console.error("Erro ao conectar ao servidor:", error);

            throw error;
        }
    }

    async getListaVendasVendedorPeriodoGerencia(req, res) {
        let { idEmpresa, byId, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

            idEmpresa = idEmpresa ? idEmpresa : '';
            byId = byId ? byId : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
            dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
    
            try {
                
                // const apiUrl = `${url}/api/dashboard/venda/venda-vendedor.xsjs?idEmpresa=${idEmpresaLogin}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
                // const response = await axios.get(apiUrl)
                const response = await getVendaVendedor(idEmpresa, byId, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

                return res.json(response); // Retorna
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        
    }

    async getListaRecebimento(req, res) {
        let { idVenda,page, pageSize } = req.query
        idVenda = idVenda ? idVenda : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/dashboard/venda/recebimento.xsjs?id=${idVenda}`
            // const response = await axios.get(apiUrl)
            const response = await getRecebimento(idVenda, page, pageSize);

            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    async getListaCaixaMovimentosGerencia(req, res) {
        let { byId, idEmpresa, dataFechamento, page, pageSize } = req.query
        byId = byId ? byId : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/dashboard/venda/recebimento.xsjs?id=${idVenda}`
            // const response = await axios.get(apiUrl)
            const response = await getCaixasMovimentos(byId, idEmpresa, dataFechamento, page, pageSize);

            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaResumoVendasCaixas(req, res) {
        let { idVenda, idEmpresa, dataFechamento, statusCancelado, page, pageSize } = req.query;
        if (!isNaN(idEmpresa)) {
            idVenda = idVenda ? idVenda : '';
            idEmpresa = idEmpresa ? idVenda : '';
            dataFechamento = dataFechamento ? dataFechamento : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

            try {
                // const apiUrl = `${url}/api/dashboard/venda/resumo-venda-caixa.xsjs?pagesize=100&status=False&idEmpresa=${idEmpresa}&dataFechamento=${dataFechamento}`
                // const response = await axios.get(apiUrl)
                const response = await getResumoVendaCaixa(idVenda, idEmpresa, dataFechamento, statusCancelado, page, pageSize)

                return res.json(response); // Retorna
            } catch (error) {
                console.error("erro no  DashBoardVendasControllers.getListaResumoVendasCaixas")
                throw error;
            }
        }
    }
    async getListaCaixasFechadosConferidos(req, res) {
        let { idEmpresa, page, pageSize } = req.query;
        if (!isNaN(idEmpresa)) {
            idEmpresa = idEmpresa ? idEmpresa : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

            try {
                const response = await getCaixasFechadosNaoConferidos(idEmpresa, page, pageSize)

                return res.json(response); 
            } catch (error) {
                console.error("erro no  DashBoardVendasControllers.getListaCaixasFechadosConferidos")
                throw error;
            }
        } else {
            throw new Error('idEmpresa não é um número válido.');
        }
    }
}

export default new DashBoardVendasControllers();