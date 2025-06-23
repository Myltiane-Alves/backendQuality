
import axios from 'axios';
import { getDetalheVoucherDados } from '../repositories/detalheVoucherDados.js';
import { getDetalheVoucher } from '../repositories/detalheVoucher.js';
import { createAuthFuncionarioCreateVoucher } from '../repositories/authFuncionarioCreateVoucher.js';
import { getEmpresasVoucher } from '../repositories/empresa.js';
import { createAuthFuncionarioPrintVoucher } from '../repositories/authFuncionarioPrintVoucher.js';
import { createAuthFuncionarioUpdateVoucher } from '../repositories/authFuncionarioUpdateVoucher.js';
import 'dotenv/config';
const url = process.env.API_URL;


class ResumoVoucherControllers {

    async getResumoDetalheVoucher(req, res) {
        let { numeroVoucher, dataPesquisaInicio, dataPesquisaFim } = req.query;

    
        numeroVoucher = numeroVoucher ? numeroVoucher : ''
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : ''
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : ''
    
        try {
            // ${url}/api/resumo-voucher/detalhe-voucher-dados.xsjs?page=1&dataPesquisaInicio=2024-01-03&dataPesquisaFim=2024-01-03&subgrupoEmpresa=1&idEmpresa=1
            const apiUrl = `${url}/api/resumo-voucher/detalhe-voucher.xsjs?id=${numeroVoucher}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`
            const response = await axios.get(apiUrl)
    
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    
    }
    async getListaVoucherGerencia(req, res) {
        let { idVoucher, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

        if(idVoucher) {
        
            try {
                idVoucher = idVoucher ? idVoucher : ''
                dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : ''
                dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '' 
                page = page ? page : '' 
                pageSize = pageSize ? pageSize : ''
                const apiUrl = `${url}/api/resumo-voucher/detalhe-voucher.xsjs?id=${idVoucher}`
                const response = await axios.get(apiUrl)
                // const response = await getDetalheVoucher(idVoucher)
        
                return res.json(response.data);
            } catch (error) {
                console.error("Erro no ResumoVoucherControllers.getListaVoucherGerencia:", error);
                throw error;
            }
        }
    
    }

    async getListaDetalheVoucherDados(req, res) {
        let { idSubGrupoEmpresa, idEmpresa, idVoucher, dataPesquisaInicio, dataPesquisaFim, dadosVoucher, stStatus, stTipoTroca, page, pageSize} = req.query;
        
        idSubGrupoEmpresa = idSubGrupoEmpresa ? idSubGrupoEmpresa : ''
        idEmpresa = idEmpresa ? idEmpresa : ''
        idVoucher = idVoucher ? idVoucher : ''
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : ''
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : ''
        dadosVoucher = dadosVoucher ? dadosVoucher : ''
        stStatus = stStatus ? stStatus : ''
        stTipoTroca = stTipoTroca ? stTipoTroca : ''
        page = page ? page : ''
        pageSize = pageSize ? pageSize : ''
        try {
            // ${url}/api/resumo-voucher/detalhe-voucher-dados.xsjs?page=1&dataPesquisaInicio=2024-01-03&dataPesquisaFim=2024-01-03&subgrupoEmpresa=1&idEmpresa=1
            const apiUrl = `${url}/api/resumo-voucher/detalhe-voucher-dados.xsjs?id=${idVoucher}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dadosVoucher=${dadosVoucher}&subgrupoEmpresa=${idSubGrupoEmpresa}&idEmpresa=${idEmpresa}&stStatus=${stStatus}&page=${page}&pageSize=${pageSize}`
            const response = await axios.get(apiUrl)
            // const response = await getDetalheVoucherDados(idSubGrupoEmpresa, idEmpresa, idVoucher, dataPesquisaInicio, dataPesquisaFim, dadosVoucher, stStatus, stTipoTroca, page, pageSize)
           
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Error in ResumoVoucherControllers.getListaDetalheVoucherDados:", error);
            throw error;
        }
    }
    async getListaEmpresasVoucher(req, res) {
        let { idEmpresa, idSubGrupoEmpresa, page, pageSize } = req.query;

        idEmpresa = idEmpresa ? idEmpresa : '';
        idSubGrupoEmpresa = idSubGrupoEmpresa ? idSubGrupoEmpresa : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            const apiUrl = `${url}/api/resumo-voucher/empresa.xsjs?idEmpresa=${idEmpresa}&idSubGrupoEmpresa=${idSubGrupoEmpresa}&page=${page}&pageSize=${pageSize}`;

            // const response = await axios.get(apiUrl);
            const response = await getEmpresasVoucher(idEmpresa, idSubGrupoEmpresa, page, pageSize);
            
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;    
        
        }
    }

    async getDetalheNumeroVoucherDados(req, res) {
        let { numeroVoucher, idSubGrupoEmpresa } = req.query;

        if(!isNaN(numeroVoucher)) {

            idSubGrupoEmpresa = ''
          
            try {
                
                const apiUrl = `${url}/api/resumo-voucher/detalhe-voucher-dados.xsjs?dadosVoucher=${numeroVoucher}&subgrupoEmpresa=${idSubGrupoEmpresa}`
                const response = await axios.get(apiUrl)
        
                return res.json(response.data); // Retorna
            } catch (error) {
                console.error("Unable to connect to the database:", error)
                throw error;
            }
        }
    
    }
    async getDetalheIDVoucherDados(req, res) {
        let { idVoucher, idSubGrupoEmpresa } = req.query;

        
        idVoucher = idVoucher ? idVoucher : ''
        idSubGrupoEmpresa = idSubGrupoEmpresa ? idSubGrupoEmpresa : ''        
    
        try {
            //api/resumo-voucher/detalhe-voucher-dados.xsjs?id=${idVoucher}&subgrupoEmpresa=${grupoEmpresa}
            const apiUrl = `${url}/api/resumo-voucher/detalhe-voucher-dados.xsjs?id=${idVoucher}&subgrupoEmpresa=${idSubGrupoEmpresa}`
            const response = await axios.get(apiUrl)
    
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    
    }
    async getDetalheIDVoucherDadosModal(req, res) {
        let { idVoucher } = req.query;

        if(!isNaN(idVoucher) ) {
            idVoucher = Number(idVoucher)
                    
        
            try {
               
                const apiUrl = `${url}/api/resumo-voucher/detalhe-voucher-dados.xsjs?id=${idVoucher}`
                const response = await axios.get(apiUrl)
        
                return res.json(response.data); // Retorna
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        }
    
    }

    async autorizacaoEditarStatusVoucher(req, res) {
        let {
            MATRICULA,
            SENHA
        } = req.body;

        try {
            const response = await axios.post(`${url}/api/resumo-voucher/autFuncionario.xsjs`, {
                MATRICULA,
                SENHA
            })

            return res.status(200).json({message: 'Usuário autorizado com sucesso!'})
        } catch (error) {
            console.error("Erro Verifique os campos do formulário:", error);
            throw error;
        }
    }

    async postAuthFuncionarioCreateVoucher(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await createAuthFuncionarioCreateVoucher(dados)
            
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async postAuthFuncionarioPrintVoucher(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await createAuthFuncionarioPrintVoucher(dados)
            
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }


    async postAuthFuncionarioUpdateVoucher(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await createAuthFuncionarioUpdateVoucher(dados)
            
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
}


export default new ResumoVoucherControllers();
