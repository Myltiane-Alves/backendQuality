import { createPromocao, getPromocaoAtiva, updatePromocao } from "../repositories/promocaoAtiva.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;
import axios from "axios";
class PromocaoControllers  {


   async getListaPromocoesAtivas(req, res) {
        let { idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query; 
            idResumoPromocao = idResumoPromocao ? idResumoPromocao : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
            dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';     
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            const apiUrl = `${url}/api/promocao-ativa.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idResumoPromocao=${idResumoPromocao}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getPromocaoAtiva(idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response.data);
        } catch(error) {
            console.error("erro no PromocaoControllers  getListaPromocoesAtivas:", error);
            throw error;
        } 
    }
    async getListaDetalhesPromocoesAtivas(req, res) {
        let { idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize} = req.query; 
            idResumoPromocao = idResumoPromocao ? idResumoPromocao : '';    
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            const apiUrl = `${url}/api/detalhe-promocao-ativa.xsjs?idResumoPromocao=${idResumoPromocao}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getPromocaoAtiva(idResumoPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response.data);
        } catch(error) {
            console.error("erro no PromocaoControllers  getListaPromocoesAtivas:", error);
            throw error; 
        } 
    }

    async putPromocao(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await updatePromocao(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    
    async postPromocao(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
                  
            const response = await axios.post(`${url}/api/promocao-ativa.xsjs`, dados);

            return res.status(200).json({
                message: "Promoção(s) criada(s) com sucesso",
                data: response.data
            });
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    // async postPromocao(req, res) {
    //     try {
    //         const dados = Array.isArray(req.body) ? req.body : [req.body];
    //         const promocao = dados[0]; 

    //         if (!promocao.TPAPLICADOA) {
    //             return res.status(400).json({ error: "Selecione uma mecânica!" });
    //         }
    //         if (!promocao.IDEMPRESA) {
    //             return res.status(400).json({ error: "Selecione uma empresa!" });
    //         }
    //         if (!promocao.DSPROMOCAOMARKETING || promocao.DSPROMOCAOMARKETING.length < 20 || promocao.DSPROMOCAOMARKETING.length > 200) {
    //             return res.status(400).json({ error: "Descrição deve ter entre 20 e 200 caracteres!" });
    //         }

    //         const apiUrl = `${url}/api/promocao-ativa.xsjs?dataPesquisaFim=${promocao.DTHORAFIM.split(' ')[0]}&idEmpresa=${promocao.IDEMPRESA}`;
    //         const responseAtivas = await axios.get(apiUrl);
    //         const promocoesAtivas = responseAtivas.data || [];

    //         const existeMecanicaAplicacao = promocoesAtivas.some(p =>
    //             p.TPAPLICADOA == promocao.TPAPLICADOA &&
    //             p.TPAPARTIRDE == promocao.TPAPARTIRDE
    //         );
    //         if (existeMecanicaAplicacao) {
    //             return res.status(400).json({ error: "Já existe uma promoção ativa com esta mecânica e aplicação destino." });
    //         }

    //         const existeAplicacaoDestino = promocoesAtivas.some(p =>
    //             p.TPAPARTIRDE == promocao.TPAPARTIRDE
    //         );
    //         if (existeAplicacaoDestino) {
    //             return res.status(400).json({ error: "Já existe uma promoção ativa com a mesma aplicação de destino nesta Empresa." });
    //         }

    //         const idsResumo = promocoesAtivas.map(p => p.IDRESUMOPROMOCAOMARKETING).filter(Boolean);
    //         if (idsResumo.length > 0) {
    //             const detalhesUrl = `${url}/api/detalhe-promocao-ativa.xsjs?idResumoPromocao=${idsResumo.join(',')}`;
    //             const responseDetalhes = await axios.get(detalhesUrl);
    //             const detalhes = responseDetalhes.data?.detalhePromo || [];

    //             if (Array.isArray(promocao.IDPRODUTODESTINO)) {
    //                 const existeProduto = detalhes.some(produto =>
    //                     promocao.IDPRODUTODESTINO.includes(produto.IDPRODUTO)
    //                 );
    //                 if (existeProduto) {
    //                     return res.status(400).json({ error: "Um dos produtos destino já está vinculado a uma promoção ativa." });
    //                 }
    //             }
    //         }

    //         if (promocao.TPAPARTIRDE == 0 || promocao.TPAPARTIRDE == 3) {
    //             if (JSON.stringify(promocao.IDPRODUTOORIGEM) !== JSON.stringify(promocao.IDPRODUTODESTINO)) {
    //                 return res.status(400).json({ error: "Para Mecânica por pares ou menos na primeira, os produtos de origem e destino devem ser iguais." });
    //             }
    //         }
    //         if (promocao.TPAPARTIRDE == 4) {
            
    //             if (
    //                 !Array.isArray(promocao.IDPRODUTOORIGEM) || 
    //                 !Array.isArray(promocao.IDPRODUTODESTINO) ||
    //                 promocao.IDPRODUTOORIGEM.length !== 1 ||
    //                 promocao.IDPRODUTODESTINO.length !== 1 ||
    //                 promocao.IDPRODUTOORIGEM[0] !== promocao.IDPRODUTODESTINO[0]
    //             ) {
    //                 return res.status(400).json({ error: "Para Mecânica em um produto, apenas um produto pode ser enviado tanto na origem quanto no destino, e eles devem ser iguais." });
    //             }
    //         }

        
    //         const response = await axios.post(`${url}/api/promocao-ativa.xsjs`, dados);

    //         return res.status(200).json({
    //             message: "Promoção(s) criada(s) com sucesso",
    //             data: response.data
    //         });
    //     } catch (error) {
    //         console.error("Unable to connect to the database:", error);
    //         return res.status(500).json({ error: "Erro ao criar promoção." });
    //     }
    // }

}

export default new PromocaoControllers();
