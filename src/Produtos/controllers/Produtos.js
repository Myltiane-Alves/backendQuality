import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getProdutoQuality } from "../repositories/produtoQuality.js";
import { getAlteracoesPrecoResumo } from "../repositories/alteracoesDePrecosResumo.js";
import { getAlteracaoPrecoProduto } from "../repositories/alteracaoPrecoProduto.js";
import { getDePrecosSap } from "../repositories/listaDePrecoSAP.js";
import { getProdutos } from "../repositories/produto.js";
import { getProdutoPrecoInformatica } from "../repositories/produtoPreco.js";
import { getProdutoPrecoNovo } from "../../Informatica/Produtos/repositories/produtoPrecoNovo.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class ProdutoControllers  {

    async getListaPedidos(req,res) {
        let { dataPesquisaInicio, dataPesquisaFim, idFornPesquisa, idMarcaPesquisa, NuPedidoPesquisa, idFabPesquisa, idCompradorPesq, STSituacoPedidoPesq, pageNumber } = req.query;

        const pageSize = 100;
        const offset = (pageNumber - 1) * pageSize;
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio)
        dataPesquisaFim = dataFormatada(dataPesquisaFim)
        try {
            // ajaxGet('api/compras/lista_pedidos.xsjs?pageSize=1000&page=' + numPage + '&dataPesquisaInicio=' + dataPesqInic + '&dataPesquisaFim=' + dataPesqFim + '&idFornPesquisa=' + idFornPesq + '&idMarcaPesquisa=' + idMarcaPesq + '&idpedido=' + NuPedidoPesq + '&idFabPesquisa=' + idFabPesq + '&idCompradorPesquisa=' + idCompradorPesq + '&stSituacaoSAP=' + STSituacoPedidoPesq)
            const apiUrl = `${url}/api/compras/lista_pedidos.xsjs?pageSize=1000&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornPesquisa=${idFornPesquisa}&idMarcaPesquisa=${idMarcaPesquisa}&idpedido=${NuPedidoPesquisa}&idFabPesquisa=${idFabPesquisa}&idCompradorPesquisa=${idCompradorPesq}&stSituacaoSAP=${STSituacoPedidoPesq}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
                throw error;
        }
        
    }

    async getListaProdutosLojaQuality(req, res) {
        let { descricaoProduto, idEmpresa, idListaLoja, codBarrasOuNome, page, pageSize } = req.query;
    
    
        descricaoProduto = descricaoProduto ? descricaoProduto : ''; 
        idEmpresa = idEmpresa ? idEmpresa : ''; 
        idListaLoja = idListaLoja ? idListaLoja : '';         
        codBarrasOuNome = codBarrasOuNome ? codBarrasOuNome : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {   
            // const apiUrl = `${url}/api/produto-sap/produto-quality.xsjs?codeBarsOuNome=${descricaoProduto}&IdEmpresaLoja=${idEmpresa}&IdListaLoja=${idListaLoja}`;
            // const response = await axios.get(apiUrl)
            const response = await getProdutoQuality(idEmpresa, codBarrasOuNome, page, pageSize);
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    async getListaProdutosPrecoInformatica(req, res) {
        let { idEmpresa, dsProduto, page, pageSize } = req.query;
 
    
        dsProduto = dsProduto ? dsProduto : ''; 
        idEmpresa = idEmpresa ? idEmpresa : ''; 
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {   
            // const apiUrl = `${url}/api/informatica/produto-preco.xsjs?idEmpresa=${idEmpresa}&dsProduto=${dsProduto}`;
            // const response = await axios.get(apiUrl)
            const response = await getProdutoPrecoInformatica(idEmpresa, dsProduto, page, pageSize);
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    async getListaProdutosPrecoNovo(req, res) {
        let { idEmpresa, dsProduto, page, pageSize } = req.query;
 
    
        dsProduto = dsProduto ? dsProduto : ''; 
        idEmpresa = idEmpresa ? idEmpresa : ''; 
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {   
            // const apiUrl = `${url}/api/informatica/produto-preco.xsjs?idEmpresa=${idEmpresa}&dsProduto=${dsProduto}`;
            // const response = await axios.get(apiUrl)
            const response = await  getProdutoPrecoNovo(idEmpresa, dsProduto, page, pageSize)
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async getListaProdutosInformaticaQuality(req, res) {
        let { 
        
            descricaoProduto, 
            idEmpresa,
            idListaEmpresa,
        } = req.query;
    
    
        descricaoProduto = descricaoProduto ? descricaoProduto : ''; 
        idEmpresa = idEmpresa ? idEmpresa : ''; 
        idListaEmpresa = idListaEmpresa ? idListaEmpresa : '';         
    
        try {   
            const apiUrl = `${url}/api/produto-sap/produto-quality.xsjs?codeBarsOuNome=${descricaoProduto}&IdEmpresaLoja=${idEmpresa}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    
    async getListaProdutosLojaSap(req, res) {
        let { 
        
            descricaoProduto, 
            idEmpresaLogin,
            idListaLoja,
            pageNumber 
        } = req.query;
    
    
        descricaoProduto = descricaoProduto ? descricaoProduto : ''; 
        idEmpresaLogin = idEmpresaLogin ? idEmpresaLogin : ''; 
        idListaLoja = idListaLoja ? idListaLoja : '';         
        pageNumber = pageNumber ? pageNumber : 1; 

    
        const pageSize = 100;
        const offset = (pageNumber - 1) * pageSize;
    
        try {   
            // api/produto-sap/produto-sap.xsjs?page=' + numPage + '&codeBarsOuNome=' + DSdesc + '&IdEmpresaLoja=' + IDEmpresaLogin + '&IdListaLoja=' + IDListaEmp
            const apiUrl = `${url}/api/produto-sap/produto-sap.xsjs?codeBarsOuNome=${descricaoProduto}&IdEmpresaLoja=${idEmpresaLogin}&IdListaLoja=${idListaLoja}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async getListaProdutos(req, res) {
        let { idEmpresa, idProduto, descProduto, codBarras, ufNcm, dataPesquisa, page, pageSize } = req.query; 
            idEmpresa = idEmpresa ? String(idEmpresa) : '';        
            idProduto = idProduto ? idProduto : '';
            descProduto = descProduto ? descProduto : '';
            codBarras = codBarras ? codBarras : '';
            ufNcm = ufNcm ? ufNcm : '';
            dataPesquisa = dataPesquisa ? dataPesquisa : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {   
            // const apiUrl = `${url}/api/produto.xsjs?idEmpresa=${idEmpresa}`;
            // const response = await axios.get(apiUrl)
            const response = await getProdutos(idEmpresa, idProduto, descProduto, codBarras, ufNcm, dataPesquisa, page, pageSize)
            return res.json(response); // Retorna
        } catch(error) {
            console.error("erro no ProdutoControllers ListaProdutosEtiqueta", error);
            throw error;
        } 
    }

    async getListaGrade(req, res) {
        let { idGrupo  } = req.query; 
        idGrupo = idGrupo ? idGrupo : '';        
    
        try {   
            const apiUrl = `${url}/api/produto-sap/grade.xsjs?idgrupograde=${idGrupo}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
    
    async getListaGrupoProdutoSap(req, res) {
        let { idEmpresa } = req.query;

        try {
            const apiUrl = `${url}/api/produto-sap/grupo.xsjs`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaDePrecosSap(req, res) {
        let { idResumoLista, idEmpresa, dataPesquisaInicio, dataPesquisaFim, nomeLista, page, pageSize } = req.query;
            idResumoLista = idResumoLista ? idResumoLista : '';
            idEmpresa = idEmpresa ? idEmpresa : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
            dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
            nomeLista = nomeLista ? nomeLista : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {

            const apiUrl = `${url}/api/produtos/listas-de-precos-SAP.xsjs?page=1`;
            const response = await axios.get(apiUrl)
            // const response = await getDePrecosSap(idResumoLista, idEmpresa, dataPesquisaInicio, dataPesquisaFim, nomeLista, page, pageSize)

            return res.json(response.data);
        } catch (error) {
            console.error("erro no ProdutoControllers ListaProdutosEtiqueta", error);
            throw error;
        }
    }
    
    async getListaResponsavelAlteracaoPreco(req, res) {
        let { idEmpresa } = req.query;
        
        try {
            
            const apiUrl = `${url}/api/produtos/responsaveis-alteracoes-de-precos.xsjs`;
            const response = await axios.get(apiUrl)
            
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaAlteracaoPrecoResumo(req, res) {
        let { idResumoAlteracao, idLoja, idLista, idUsuario, idProduto, codBarras, descProduto, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
        idResumoAlteracao = idResumoAlteracao ? idResumoAlteracao : '';
        idLoja = idLoja ? idLoja : '';
        idLista = idLista ? idLista : '';
        idUsuario = idUsuario ? idUsuario : '';
        idProduto = idProduto ? idProduto : '';
        codBarras = codBarras ? codBarras : '';
        descProduto = descProduto ? descProduto : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
        dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // http://164.152.245.77:8000/quality/concentrador_homologacao/api/produtos/alteracoes-de-precos-resumo.xsjs?dtInicio=2024-12-11&dtFim=2024-12-11&id=&idLista=&idLoja=&idUser=&idProd=&descProd=&codeBars=&page=1
            const apiUrl = `${url}/api/produtos/alteracoes-de-precos-resumo.xsjs?dtIinicio=${dataPesquisaInicio}&dtFim=${dataPesquisaFim}&id=${idResumoAlteracao}&idLista=${idLista}&idLoja=${idLoja}&idUser=${idUsuario}&idProd=${idProduto}&descProd=${descProduto}&codeBars=${codBarras}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            // const response = await getAlteracoesPrecoResumo()
            
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaAlteracaoPrecoProduto(req, res) {
        let { idProduto, idEmpresa, idGrupoEmpresarial, codBarras, descricaoProduto, dataUltimaAtualizacao, horaUltimaAtualizacao, page, pageSize } = req.query;
            idProduto = idProduto ? idProduto : '';
            idEmpresa = idEmpresa ? idEmpresa : '';
            idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
            codBarras = codBarras ? codBarras : '';
            descricaoProduto = descricaoProduto ? descricaoProduto : '';
            dataUltimaAtualizacao = dataUltimaAtualizacao ? dataUltimaAtualizacao : '';
            horaUltimaAtualizacao = horaUltimaAtualizacao ? horaUltimaAtualizacao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
          
            // const apiUrl = `${url}/api/produtos/alteracoes-de-precos-resumo.xsjs?dtIinicio=${dataPesquisaInicio}&dtFim=${dataPesquisaFim}&id=${idResumoAlteracao}&idLista=${idLista}&idLoja=${idLoja}&idUser=${idUsuario}&idProd=${idProduto}&descProd=${descProduto}&codeBars=${codBarras}&page=${page}&pageSize=${pageSize}`;
            // const response = await axios.get(apiUrl)
            const response = await getAlteracaoPrecoProduto(idProduto, idEmpresa, idGrupoEmpresarial, codBarras, descricaoProduto, dataUltimaAtualizacao, horaUltimaAtualizacao, page, pageSize)
            
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }


    async getListaAlteracaoPrecoDetalhe(req, res) {
        let { idAlteracaoPreco, page, pageSize } = req.query;
        
        idAlteracaoPreco = idAlteracaoPreco ? idAlteracaoPreco : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            
            const apiUrl = `${url}/api/produtos/alteracoes-de-precos-detalhes.xsjs?idAlteracao=${idAlteracaoPreco}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async ListaProdutosEtiquetagem(req, res) {
        let { idLista, idProduto, descricao, codBarras } = req.query;

        idLista = idLista ? idLista : '';
        idProduto = idProduto ? idProduto : '';
        descricao = descricao ? descricao : '';
        codBarras = codBarras ? codBarras : '';
        
        try {

            const apiUrl = `${url}/api/produtos/lista-produtos-etiqueta-SAP.xsjs?idLista=${idLista}&id=${idProduto}&descProd=${descricao}&codeBars=${codBarras}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

}

export default new ProdutoControllers();