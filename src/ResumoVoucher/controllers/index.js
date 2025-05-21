
import axios from 'axios';
import { getDetalheVoucherDados } from '../repositories/detalheVoucherDados.js';
import { getDetalheVoucher } from '../repositories/detalheVoucher.js';
import { createAuthFuncionarioCreateVoucher } from '../repositories/authFuncionarioCreateVoucher.js';
import { getEmpresasVoucher } from '../repositories/empresa.js';
import { createAuthFuncionarioPrintVoucher } from '../repositories/authFuncionarioPrintVoucher.js';
import { createAuthFuncionarioUpdateVoucher } from '../repositories/authFuncionarioUpdateVoucher.js';
import { getVoucherCompleto } from '../../Administrativo/Vouchers/repositories/voucherCompleto.js';
import { getTodosClientes, updateCliente } from '../../Cliente/repositories/todos.js';
import { createResumoVoucher, updateResumoVoucher } from '../repositories/todosWeb.js';

let url = `http://164.152.245.77:8000/quality/concentrador`;

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
                // const apiUrl = `${url}/api/resumo-voucher/detalhe-voucher.xsjs?id=${idVoucher}`
                // const response = await axios.get(apiUrl)
                const response = await getDetalheVoucher(idVoucher,dataPesquisaInicio, dataPesquisaFim, page, pageSize)
        
                return res.json(response);
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        }
    
    }
    async getListaDetalheVoucherDados(req, res) {
        let { idSubGrupoEmpresa, idEmpresa, idVoucher, dataPesquisaInicio, dataPesquisaFim, dadosVoucher, stStatus, stTipoTroca, page, pageSize } = req.query;

        idSubGrupoEmpresa = idSubGrupoEmpresa ? idSubGrupoEmpresa : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        idVoucher = idVoucher ? idVoucher : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        dadosVoucher = dadosVoucher ? dadosVoucher : '';
        stStatus = stStatus ? stStatus : '';
        stTipoTroca = stTipoTroca ? stTipoTroca : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {

            const response = await getDetalheVoucherDados(
                idSubGrupoEmpresa,
                idEmpresa,
                idVoucher,
                dataPesquisaInicio,
                dataPesquisaFim,
                dadosVoucher,
                stStatus,
                stTipoTroca,
                page,
                pageSize
            );


            return res.json(response);
        } catch (error) {
            console.error("erro no ResumoVoucherControllers getListaDetalheVoucherDados:", error);
            throw error;
        }
    }
    
    async getListaVoucherCompleto(req, res) {
        let { idVoucher, numeroVoucher, idSubGrupoEmpresa, idEmpresa, dataPesquisaInicio, dataPesquisaFim, dadosVoucher, stStatus, page, pageSize} = req.query;
        
        idVoucher = idVoucher ? idVoucher : ''
        numeroVoucher = numeroVoucher ? numeroVoucher : ''
        idSubGrupoEmpresa = idSubGrupoEmpresa ? idSubGrupoEmpresa : ''
        idEmpresa = idEmpresa ? idEmpresa : ''
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : ''
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : ''
        dadosVoucher = dadosVoucher ? dadosVoucher : ''
        stStatus = stStatus ? stStatus : ''
        page = page ? page : ''
        pageSize = pageSize ? pageSize : ''
        try {
            // ${url}/api/resumo-voucher/detalhe-voucher-dados.xsjs?page=1&dataPesquisaInicio=2024-01-03&dataPesquisaFim=2024-01-03&subgrupoEmpresa=1&idEmpresa=1
            const apiUrl = `${url}/api/administrativo/voucher-completo.xsjs?id=${idVoucher}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dadosVoucher=${dadosVoucher}&subgrupoEmpresa=${idSubGrupoEmpresa}&idEmpresa=${idEmpresa}&stStatus=${stStatus}&page=${page}&pageSize=${pageSize}`
            const response = await axios.get(apiUrl)
            // const response = await getVoucherCompleto(idVoucher, numeroVoucher, idSubGrupoEmpresa, idEmpresa, dataPesquisaInicio, dataPesquisaFim, dadosVoucher, stStatus, page, pageSize)
           
            return res.json(response.data); 
        } catch (error) {
            console.error("erro no ResumoVoucherControllers getListaDetalheVoucherDados:", error);
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
            // const apiUrl = `${url}/api/resumo-voucher/empresa.xsjs?idEmpresa=${idEmpresa}&idSubGrupoEmpresa=${idSubGrupoEmpresa}&page=${page}&pageSize=${pageSize}`;

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

    async getListaTodosClientes(req, res) {
        let { idCliente, numeroCpfCnpj, pageSize, page } = req.query;

        idCliente = idCliente ? idCliente : '';
        numeroCpfCnpj = numeroCpfCnpj ? numeroCpfCnpj : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {

            const response = await getTodosClientes(
                idCliente,
                numeroCpfCnpj,
                page,
                pageSize
            );


            return res.json(response);
        } catch (error) {
            console.error("erro no ResumoVoucherControllers getListaTodosClientes:", error);
            throw error;
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
            // const { MATRICULA, SENHA, IDGRUPOEMPRESARIAL, IDEMPRESALOGADA, IDVOUCHER, DTINVOUCHER } = dados[0] || {};
            // console.log("dados", dados[0])
            // // // Validações iniciais
            // if (!MATRICULA) throw new Error('A MATRICULA é uma informação obrigatória');
            // if (!SENHA) throw new Error('A SENHA é uma informação obrigatória');
            // if (!IDGRUPOEMPRESARIAL) throw new Error('A identificação do Grupo Empresarial é uma informação obrigatória');
            // if (!IDEMPRESALOGADA) throw new Error('A identificação de Empresa Logada é uma informação obrigatória');
            // if (!IDVOUCHER) throw new Error('A identificação do Voucher é uma informação obrigatória');
            // if (!DTINVOUCHER) throw new Error('A data de criação do voucher é uma informação obrigatória');
    
            // // Calcula a diferença de dias entre a data atual e a data do voucher
            // const dataHoraVoucher = new Date(DTINVOUCHER);
            // const dataHoraAtual = new Date();
            // dataHoraVoucher.setUTCHours(0, 0, 0, 0); // Normaliza a data do voucher
            // dataHoraAtual.setUTCHours(0, 0, 0, 0); // Normaliza a data atual
    
            // const diferencaEmDias = Math.ceil(Math.abs(dataHoraAtual - dataHoraVoucher) / (1000 * 60 * 60 * 24));
    
            // // Validação dos dias
            // if (diferencaEmDias > 180) {
            //     throw new Error(`ACESSO NEGADO! Venda fora do Prazo de Troca! DIAS PASSADOS APÓS A VENDA: ${diferencaEmDias} Dias`);
            // }
    
            // // Adiciona a diferença de dias ao objeto de dados para ser usado na função de serviço
            // dados[0].DIAS_APOS_CRIACAO = diferencaEmDias;
    
            // Chama a função que faz a consulta ao banco de dados
            const response = await createAuthFuncionarioUpdateVoucher(dados);
    
            return res.json(response);
        } catch (error) {
            console.error("Erro no postAuthFuncionarioUpdateVoucher.createAuthFuncionarioUpdateVoucher:", error);
            return res.status(400).json({ error: error.message });
        }
    }

    async putCliente(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            // const { MATRICULA, SENHA, IDGRUPOEMPRESARIAL, IDEMPRESALOGADA, IDVOUCHER, DTINVOUCHER } = dados[0] || {};
   
            const response = await updateCliente(dados);
    
            return res.json(response);
        } catch (error) {
            console.error("Erro no ResumoVoucherControllers.putCliente:", error);
            return res.status(400).json({ error: error.message });
        }
    }
    async postCliente(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            // const { MATRICULA, SENHA, IDGRUPOEMPRESARIAL, IDEMPRESALOGADA, IDVOUCHER, DTINVOUCHER } = dados[0] || {};
   
            const response = await createCliente(dados);
    
            return res.json(response);
        } catch (error) {
            console.error("Erro no ResumoVoucherControllers.postCliente:", error);
            return res.status(400).json({ error: error.message });
        }
    }
    async postResumoVoucher(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            // const { MATRICULA, SENHA, IDGRUPOEMPRESARIAL, IDEMPRESALOGADA, IDVOUCHER, DTINVOUCHER } = dados[0] || {};
   
            const response = await createResumoVoucher(dados);
    
            return res.json(response);
        } catch (error) {
            console.error("Erro no ResumoVoucherControllers.postResumoVoucher:", error);
            return res.status(400).json({ error: error.message });
        }
    }
    async putResumoVoucher(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            // const { MATRICULA, SENHA, IDGRUPOEMPRESARIAL, IDEMPRESALOGADA, IDVOUCHER, DTINVOUCHER } = dados[0] || {};
   
            const response = await updateResumoVoucher(dados);
    
            return res.json(response);
        } catch (error) {
            console.error("Erro no ResumoVoucherControllers.putResumoVoucher:", error);
            return res.status(400).json({ error: error.message });
        }
    }
}


export default new ResumoVoucherControllers();
