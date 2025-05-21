import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getFornecedores } from "../repositories/fornecedor.js";
import { getPedidos } from "../repositories/listaPedidos.js";
import {  getDetalhePedidoGrade } from "../repositories/listaDetalhePedidosGrade.js";
import { createEstilo, getEstilos, updateEstilo } from "../repositories/estilos.js";
import { getPedidosDetalhados } from "../repositories/listaPedidosDetalhado.js";
import { createCondicaoPagamento, getCondicaoPagamento, updateCondicaoPagamento } from "../repositories/condicaoPagamento.js";
import { getFornecedorProduto } from "../repositories/fornecedorProduto.js";
import { getDetalhePedidos } from "../repositories/listaDetalhePedidos.js";
import { getUnidadeMedida } from "../repositories/unidadeMedida.js";
import { createCor, getCores, updateCor } from "../repositories/cores.js";
import { createTipoTecido, getTipoTecido, updateTipoTecido } from "../repositories/tipoTecido.js";
import { getLocalExposicao } from "../repositories/localExposicao.js";
import { createUnidadesDeMedidas, getUnidadesDeMedidas, updateUnidadesDeMedidas } from "../repositories/unidadesDeMedidas.js";
import { createSubGrupoEstrutura, getSubGrupoEstrutura, updateSubGrupoEstrutura } from "../repositories/subGrupoEstrutura.js";
import { createGrupoEstrutura, getGrupoEstrutura, updateGrupoEstrutura } from "../repositories/grupoExtrutura.js";
import { createTamanhosPedidos, getTamanhosPedidos, updateTamanhosPedidos } from "../repositories/tamanhoPedidos.js";
import { createCategoriasPedidos, getCategoriasPedidos, updateCategoriasPedidos } from "../repositories/categoriaPedidos.js";
import { deleteVinculoCategoriaTamanhoPedido, getVinculoCategoriaTamanhoPedido } from "../repositories/vinculoCategoriaTamanhoPedido.js";
import { createFabricanteFornecedor, getFabricanteFornecedor, updateFabricanteFornecedor } from "../repositories/fabricanteFornecedor.js";
import { createTransportador, getTransportador, updateTransportador } from "../repositories/transportador.js";
import { getFornecedorFabricante } from "../repositories/fornecedorFabricante.js";
import { createFabricante, getFabricante, updateFabricante } from "../repositories/fabricante.js";
import { deletarVinculoFabricanteFornecedor } from "../repositories/deletarVinculoFornecedorFabricante.js";
import { getImagemProduto } from "../repositories/imagemProduto.js";
import { updateImagem } from "../repositories/atualizaImagem.js";
import { getListaProdutosImagem } from "../repositories/listaProdutosImagem.js";
import { updateProdutosImagem } from "../repositories/atualizaProdutosImagem.js";
import { createPromocao, getPromocoes, updatePromocao } from "../repositories/listaPromocoes.js";
import { getDistribuicaoHistorico } from "../repositories/distribuicaoComprasHistorico.js";
import { getDetalheDistribuicao } from "../repositories/detalheDistribuicaoCompras.js";
import { getDistribuicaoSugestoesHistorico } from "../repositories/distribuicaoComprasSugestoesHistorico.js";
import { updateAndamentoPedido } from "../repositories/atualizacaoAndamentoPedido.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;
class ComprasControllers {

    async getListaTodosPedidos(req, res) {
        let { idResumoPedido, idPedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, idComprador, stSituacaoSap, page, pageSize } = req.query;
            idResumoPedido = idResumoPedido ? idResumoPedido : '';
            idPedido = idPedido ? idPedido : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
            idMarca = idMarca ? idMarca : '';
            idFornecedor = idFornecedor ? idFornecedor : '';
            idFabricante = idFabricante ? idFabricante : '';
            idComprador = idComprador ? idComprador : '';
            stSituacaoSap = stSituacaoSap ? stSituacaoSap : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/lista_pedidos.xsjs?pageSize=1000&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
            // const response = await axios.get(apiUrl)
            const response = await getPedidos(idResumoPedido, idPedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, idComprador, stSituacaoSap, page, pageSize)
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaPedidosDetalhado(req, res) {
        let {idResumoPedido, idDetalhePedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante,  page, pageSize} = req.query;
            idResumoPedido = idResumoPedido ? idResumoPedido : '';
            idDetalhePedido = idDetalhePedido ? idDetalhePedido : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
            idMarca = idMarca ? idMarca : '';
            idFornecedor = idFornecedor ? idFornecedor : '';
            idFabricante = idFabricante ? idFabricante : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {
            const apiUrl = `${url}/api/compras/lista_pedidos_detalhado.xsjs?pageSize=500&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornPesquisa=${idFornecedor}&idMarcaPesquisa=${idMarca}&idpedido=${idResumoPedido}`;
            const response = await axios.get(apiUrl)
            // const response = await getPedidosDetalhados(idResumoPedido, idDetalhePedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante,  page, pageSize)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    async getListaDetalhePedidos(req, res) {
        let { idPedido, idDetalhePedido, stTransformado, stReposicao, dataPesquisaInicio, dataPesquisaFim,  page, pageSize } = req.query;
            idPedido = idPedido ? idPedido : '';
            idDetalhePedido = idDetalhePedido ? idDetalhePedido : '';
            stTransformado = stTransformado ? stTransformado : '';
            stReposicao = stReposicao ? stReposicao : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/compras/lista_detalhepedidos.xsjs?idpedido=${idPedido}`;
            // const response = await axios.get(apiUrl)
            const response = await getDetalhePedidos(idPedido, idDetalhePedido, stTransformado, stReposicao, dataPesquisaInicio, dataPesquisaFim,  page, pageSize)
            return res.json(response); 
        } catch (error) {
            console.error("um erro ao no controller Compras getListaDetalhePedidos ", error);
            throw error;
        }
    }

    async getListaPromocoes(req, res) {
        let { idResumoPromocao, descPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
            idResumoPromocao = idResumoPromocao ? idResumoPromocao : '';
            descPromocao = descPromocao ? descPromocao : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/compras/lista_promocoes.xsjs?pageSize=1000&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
            // const response = await axios.get(apiUrl)
            const response = await getPromocoes(idResumoPromocao, descPromocao, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
            return res.json(response); // Retorna
        } catch (error) {
            console.error("um erro ao no controller Compras getListaPromocoes ", error);
            throw error;
        }

    }

    async getListaEmpresaPromocoes(req, res) {
        let { idResumoPromocoes } = req.query;
        idResumoPromocoes = idResumoPromocoes ? idResumoPromocoes : '';
        try {
            const apiUrl = `${url}/api/compras/lista_empresapromocoes.xsjs?idResPromo=${idResumoPromocoes}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaProdutoOrigemPromocoes(req, res) {
        let { idResumoPromocoes } = req.query;
        idResumoPromocoes = idResumoPromocoes ? idResumoPromocoes : '';
        try {
            const apiUrl = `${url}/api/compras/lista_produtosorigempromocoes.xsjs?idResPromo=${idResumoPromocoes}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaProdutoDestinoPromocoes(req, res) {
        let { idResumoPromocoes } = req.query;
        idResumoPromocoes = idResumoPromocoes ? idResumoPromocoes : '';
        try {
            const apiUrl = `${url}/api/compras/lista_produtosdestinopromocoes.xsjs?idResPromo=${idResumoPromocoes}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }


    async getListaPedidos(req, res) {
        let {idResumoPedido, idPedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, idComprador, stSituacaoSap, page, pageSize } = req.query;
            idResumoPedido = idResumoPedido ? idResumoPedido : '';
            idPedido = idPedido ? idPedido : '';
            dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
            dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
            idMarca = idMarca ? idMarca : '';
            idFornecedor = idFornecedor ? idFornecedor : '';
            idFabricante = idFabricante ? idFabricante : '';
            idComprador = idComprador ? idComprador : '';
            stSituacaoSap = stSituacaoSap ? stSituacaoSap : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/compras/lista_pedidos.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornPesquisa=${idFornecedor}&idMarcaPesquisa=${idMarca}&idpedido=${idPedido}&idFabPesquisa=${idFabricante}&idCompradorPesquisa=${idComprador}&stSituacaoSAP=${stSituacaoSap}`;
            // const response = await axios.get(apiUrl)
            const response = await getPedidos(idResumoPedido, idPedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, idComprador, stSituacaoSap, page, pageSize)
            return res.json(response); 
        } catch (error) {
            console.error("erro no controller Compras getListaPedidos:", error);
            throw error;
        }
    }
    async getListaDetalhePedidoGrade(req, res) {
        let {idPedido, idDetalhePedido, dataPesquisaInicio, dataPesquisaFim,  page, pageSize } = req.query;
        idPedido = idPedido ? idPedido : '';
        idDetalhePedido = idDetalhePedido ? idDetalhePedido : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/compras/lista_detalhepedidosgrade.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idpedido=${idPedido}`;
            // const response = await axios.get(apiUrl)
            const response = await getDetalhePedidoGrade(idPedido, idDetalhePedido, dataPesquisaInicio, dataPesquisaFim,  page, pageSize)
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }


    async getListaFornecedores(req, res) {
        let { idFornecedor, descFornecedor, CNPJFornecedor,  page, pageSize } = req.query;
        idFornecedor = idFornecedor ? idFornecedor : '';
        descFornecedor = descFornecedor ? descFornecedor : '';
        CNPJFornecedor = CNPJFornecedor ? CNPJFornecedor : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            const apiUrl = `${url}/api/compras/fornecedor.xsjs?idFornecedor=${idFornecedor}`
            // const response = await getFornecedores(idFornecedor, descFornecedor, CNPJFornecedor,  page, pageSize)
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaFornecedorProduto(req, res) {
        let { idMarca, idFornecedor, page, pageSize } = req.query;
        idFornecedor = idFornecedor ? idFornecedor : '';
        idMarca = idMarca ? idMarca : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        // idProduto = idProduto ? idProduto : '';

        try {
            const apiUrl = `${url}/api/compras/fornecedor-produto.xsjs?idFornecedor=${idFornecedor}&idProduto=${idProduto}`
            const response = await axios.get(apiUrl)
            // const response = await  getFornecedorProduto(idMarca, idFornecedor, page, pageSize)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("um erro de conexão no controller Compras GetListaFornecedor:", error);
            throw error;
        }
    }
    
    async getListaFabricantes(req, res) {
        let { idFabricante, descFabricante, noFabricante,  page, pageSize } = req.query;
            idFabricante = idFabricante ? idFabricante : '';
            descFabricante = descFabricante ? descFabricante : '';
            noFabricante = noFabricante ? noFabricante : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/fabricante.xsjs?idFab=${idFabricante}`
            // const response = await axios.get(apiUrl)
            const response = await getFabricante(idFabricante, descFabricante, noFabricante,  page, pageSize)

            return res.json(response); 
        } catch (error) {
            console.error("um erro de conexão no controller Compras GetListaFabricantes:", error);
            throw error;
        }

    }
    async getListaCompradores(req, res) {
        let { } = req.query;

        try {
            const apiUrl = `${url}/api/compras/comprador.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }
    async getListaFornecedorFabricante(req, res) {
        let {idFabricante, descFornecedor, idFornecedor, cnpjFornecedor, page, pageSize } = req.query;
            idFabricante = idFabricante ? idFabricante : '';
            descFornecedor = descFornecedor ? descFornecedor : '';
            idFornecedor = idFornecedor ? idFornecedor : '';
            cnpjFornecedor = cnpjFornecedor ? cnpjFornecedor : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/compras/fornecedor-fabricante.xsjs?idFab=${idFabricante}&descFornecedor=${descricaoFornecedor}&idFor=${idFornecedor}&CNPJFornecedor=${cnpjFornecedor}`
            // const response = await axios.get(apiUrl)
            const response = await getFornecedorFabricante(idFabricante, descFornecedor, idFornecedor, cnpjFornecedor,  page, pageSize)

            return res.json(response); // Retorna
        } catch (error) {
            console.error("erro no Controller Compras getListaFornecedorFabricante:", error);
            throw error;
        }

    }
    async getListaFabricanteFornecedor(req, res) {
        let { idFabricante, descFabricante, noFabricante,  page, pageSize } = req.query;
            idFabricante = idFabricante ? idFabricante : '';
            descFabricante = descFabricante ? descFabricante : '';
            noFabricante = noFabricante ? noFabricante : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';


        try {
            // const apiUrl = `${url}/api/compras/fabricante-fornecedor.xsjs?idFab=${idFabricante}&descFab=${descricaoFabricante}&idFor=${idFornecedor}`
            // const response = await axios.get(apiUrl)
            const response = await getFabricanteFornecedor(idFabricante, descFabricante, noFabricante,  page, pageSize)

            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }
    async getEditFornecedorFabricante(req, res) {
        let { idFornecedorFabricante, idFornecedorPedido } = req.query;
        idFornecedorFabricante = idFornecedorFabricante ? idFornecedorFabricante : '';
        idFornecedorPedido = idFornecedorPedido ? idFornecedorPedido : '';
        
        try {
            const apiUrl = `${url}/api/compras/vincfabforn.xsjs?idvincfornfab=${idFornecedorFabricante}&idfornpedido=${idFornecedorPedido}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaCondicoesPagamento(req, res) {
        let { idCondPagamento, dsCondPagamento, idGrupoEmpresarial, page, pageSize } = req.query;
        idCondPagamento = idCondPagamento ? idCondPagamento : '';
        dsCondPagamento =  dsCondPagamento ? dsCondPagamento : '';
        idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/condicaopagamento.xsjs?idCondPag=${idCondPagamento}&descCondPag=${dsCondPagamento}`
            // const response = await axios.get(apiUrl)
            const response = await getCondicaoPagamento(idCondPagamento, dsCondPagamento, idGrupoEmpresarial, page, pageSize)

            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaTransportadora(req, res) {
        let { idFornecedorFabricante } = req.query;
        idFornecedorFabricante = idFornecedorFabricante ? idFornecedorFabricante : '';

        try {
            const apiUrl = `${url}/api/compras/transportadora.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaTransportador(req, res) {
        let { idTransportador, descTransportador, cnpjTransportador, page, pageSize } = req.query;
            idTransportador = idTransportador ? idTransportador : '';
            descTransportador = descTransportador ? descTransportador : '';
            cnpjTransportador = cnpjTransportador ? cnpjTransportador : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/transportador.xsjs?idTransportador=${idTransportador}&descTransportador=${descTransportador}&CNPJTransportador=${cnpjTransportador}`
            // const response = await axios.get(apiUrl)
            const response = await getTransportador(idTransportador, descTransportador, cnpjTransportador, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras getListaTransportador:", error);
            throw error;
        }

    }

    // async getListaByIdTransportador(req, res) {
    //     let { idTransportador } = req.query;
    //     idTransportador = idTransportador ? idTransportador : '';

    //     try {
    //         const apiUrl = `${url}/api/compras/transportador.xsjs?idTransportador=${idTransportador}`
    //         const response = await axios.get(apiUrl)

    //         return res.json(response.data); // Retorna
    //     } catch (error) {
    //         console.error("Unable to connect to the database:", error);
    //         throw error;
    //     }

    // }

    async getListaSubGrupoEstrutura(req, res) {
        let {idSubGrupoEstrutura, descricao, page, pageSize } = req.query;
            idSubGrupoEstrutura = idSubGrupoEstrutura ? idSubGrupoEstrutura : '';
            descricao = descricao ? descricao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/compras/subgrupoestrutura.xsjs?idSubGrupoExt=${idSubGrupoEstrutura}&descSubGrupoExt=${descricao}`;
            const response = await axios.get(apiUrl)
            // const response = await getSubGrupoEstrutura(idSubGrupoEstrutura, descricao, page, pageSize)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaImagemProduto(req, res) {
        let {idImagemProduto, nuRefImagemProduto, idFabricante, idSubGrupoEstrutura, idPedido, page, pageSize } = req.query;
            idImagemProduto = idImagemProduto ? idImagemProduto : '';
            nuRefImagemProduto = nuRefImagemProduto ? nuRefImagemProduto : '';
            idFabricante = idFabricante ? idFabricante : '';
            idSubGrupoEstrutura = idSubGrupoEstrutura ? idSubGrupoEstrutura : '';
            idPedido = idPedido ? idPedido : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';


        try {
            // const apiUrl = `${url}/api/compras/imagemproduto.xsjs?page=${page}&pageSize=${pageSize}&NuRefImgProd=${nuRefImagemProduto}&IDFabImagem=${idFabricante}&IDSubEstImagem=${idSubGrupoEstrutura}&idPedido=${idPedido}`
            // const response = await axios.get(apiUrl)
            const response = await getImagemProduto(idImagemProduto, nuRefImagemProduto, idFabricante, idSubGrupoEstrutura, idPedido, page, pageSize)

            return res.json(response); // Retorna
        } catch (error) {
            console.error("erro no controller Compras getListaImagemProduto:", error);
        }
    }

    async getListaDetalheImagemProduto(req, res) {
        let { idImagem, page, pageSize} = req.query;
            idImagem = idImagem ? idImagem : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/compras/lista_produtosimagem.xsjs?IDImagens=${idImagem}`
            // const response = await axios.get(apiUrl)
            const response = await getListaProdutosImagem(idImagem, page, pageSize) 

            return res.json(response); // Retorna
        } catch (error) {
            console.error("erro no controller Compras getListaDetalheImagemProduto:", error);
            throw error;
        }
    }

    async getListaTPDocumento(req, res) {
        let { } = req.query;

        try {
            const apiUrl = `${url}/api/compras/tipodocumento.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaTPDocumento(req, res) {
        let { } = req.query;

        try {
            const apiUrl = `${url}/api/compras/tipodocumento.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaGrupoEstrutura(req, res) {
        let { idGrupoEstrutura, descricao, page, pageSize} = req.query;
        idGrupoEstrutura = idGrupoEstrutura ? idGrupoEstrutura : '';
        descricao = descricao ? descricao : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/grupoextrutura.xsjs?idGrupoExt=${idGrupoEstrutura}&descGrupoExt=${descricaoGrupoEstrutura}`
            // const response = await axios.get(apiUrl)
            const response = await getGrupoEstrutura()

            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaUnidadeMedida(req, res) {
        let {idMarca, page, pageSize} = req.query;
            idMarca = idMarca ? idMarca : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/unidademedida.xsjs?idUnidMed=${idUnidadeMedida}&descUnidMed=${descricao}`
            // const response = await axios.get(apiUrl)
            const response = await getUnidadeMedida(idMarca, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras getListaUnidadeMedida:", error);
            throw error;
        }
    }

    async getListaCores(req, res) {
        let { idGrupoCor, idCor, descricao, page, pageSize } = req.query;
            idGrupoCor = idGrupoCor ? idGrupoCor : '';
            idCor = idCor ? idCor : '';
            descricao = descricao ? descricao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/cores.xsjs?idCor=${idCor}&descCor=${descricao}`
            // const response = await axios.get(apiUrl)
            const response = await getCores(idGrupoCor, idCor, descricao, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras getListaCores:", error);
            throw error;
        }
    }

    async getListaGrupoCores(req, res) {
        let { idCor, descricao} = req.query;
        idCor = idCor ? idCor : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/grupocores.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaEstilos(req, res) {
        let { idEstilo, idGrupoEstilo, descEstilo, page, pageSize} = req.query;
        idEstilo = idEstilo ? idEstilo : '';
        idGrupoEstilo = idGrupoEstilo ? idGrupoEstilo : '';
        descEstilo = descEstilo ? descEstilo : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/compras/estilos.xsjs?idEstilo=${idEstilo}&descEstilo=${descricao}`
            // const response = await axios.get(apiUrl)
            const response = await getEstilos(idEstilo, idGrupoEstilo, descEstilo, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    // async getListaTipoTecidos(req, res) {
    //     let { idTecido, descricao} = req.query;
    //     idTecido = idTecido ? idTecido : '';
    //     descricao = descricao ? descricao : '';
    //     try {
    //         const apiUrl = `${url}/api/compras/tipotecidos.xsjs?idTecido=${idTecido}&descTecido=${descricao}`
    //         // const response = await axios.get(apiUrl)
    //         const response = await getTipoTecido(idTipoTecido, page, pageSize)
            

    //         return res.json(response.data);
    //     } catch (error) {
    //         console.error("erro nos campos do banco:", error);
    //         throw error;
    //     }
    // }

    async getListaCategoriaPedidos(req, res) {
        let { idCategoriaPedido, descricao, page, pageSize} = req.query;
            idCategoriaPedido = idCategoriaPedido ? idCategoriaPedido : '';
            descricao = descricao ? descricao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/categoriapedidos.xsjs?idCatPed=${idCategoriaPedido}&descCatPed=${descricao}`
            // const response = await axios.get(apiUrl)
            const response = await getCategoriasPedidos(idCategoriaPedido, descricao, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras getListaCategoriaPedidos:", error);
            throw error;
        }
    }

    async getListaTamanhosPedidos(req, res) {
        let { idTamanho, descricao, page, pageSize} = req.query;
            idTamanho = idTamanho ? idTamanho : '';
            descricao = descricao ? descricao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/tamanhospedidos.xsjs?idTamPed=${idTamanho}&descTamPed=${descricao}`
            // const response = await axios.get(apiUrl)
            const response = await getTamanhosPedidos(idTamanho, descricao, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaVinculoCategoriaTamanhoPedido(req, res) {
        let { idVinculoCategoriaPedido, idCategoriaPedido, descricao, idTamanho, page, pageSize} = req.query;
            idVinculoCategoriaPedido = idVinculoCategoriaPedido ? idVinculoCategoriaPedido : '';
            idCategoriaPedido = idCategoriaPedido ? idCategoriaPedido : '';
            descricao = descricao ? descricao : '';
            idTamanho = idTamanho ? idTamanho : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/vinctamcat.xsjs?idCatPeid=${idCategoriaPedido}&descCatPed=${descricao}&idTamPed=${idTamanho}`
            // const response = await axios.get(apiUrl)
            const response = await getVinculoCategoriaTamanhoPedido(idVinculoCategoriaPedido, idCategoriaPedido, descricao, idTamanho, page, pageSize)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaUnidadesDeMedidas(req, res) {
        let { idUnidadeMedida, descricao, page, pageSize} = req.query;
            idUnidadeMedida = idUnidadeMedida ? idUnidadeMedida : '';
            descricao = descricao ? descricao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/unidadesdemedidas.xsjs`
            // const response = await axios.get(apiUrl)
            const response = await getUnidadesDeMedidas(idUnidadeMedida, descricao, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras getListaUnidadesDeMedidas:", error);
            throw error;
        }
    }

    async getListaTipoTecido(req, res) {
        let { idTipoTecido,descricaoTecido, page, pageSize} = req.query;
            idTipoTecido = idTipoTecido ? idTipoTecido : '';
            descricaoTecido = descricaoTecido ? descricaoTecido : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';

        try {
            // const apiUrl = `${url}/api/compras/tipotecidos.xsjs?idTecido=${idTecido}&descTecido=${descricao}`
            // const response = await axios.get(apiUrl)
            const response = await  getTipoTecido(idTipoTecido, descricaoTecido, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro ao no controller Compras getTipoTecido:", error);
            throw error;
        }
    }

    async getListaLocalExposicao(req, res) {
        let {idLocalExposicao, descricao, page, pageSize } = req.query;
            idLocalExposicao = idLocalExposicao ? idLocalExposicao : '';
            descricao = descricao ? descricao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/localexposicao.xsjs`
            // const response = await axios.get(apiUrl)
            const response = await getLocalExposicao(idLocalExposicao, descricao, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaDistribuicaoHistorico(req, res) {
        let {idPedidoCompra, idFornecedor, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
            idPedidoCompra = idPedidoCompra ? idPedidoCompra : '';
            idFornecedor = idFornecedor ? idFornecedor : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const apiUrl = `${url}/api/compras/distribuicao-compras-historico.xsjs?id=${idPedidoCompra}&idfornecedorpedido=${idFornecedor}&datainicial=${dataPesquisaInicio}&datafinal=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`
            // const response = await axios.get(apiUrl)
            const response = await getDistribuicaoHistorico(idPedidoCompra, idFornecedor, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras getListaDistribuicaoHistorico:", error);
            throw error;
        }
    }

    async getListaDetalheDistribuicao(req, res) {
        let {idResumoPedido, page, pageSize } = req.query;
            idResumoPedido = idResumoPedido ? idResumoPedido : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/compras/detalhe-distribuicao-compras.xsjs?page=&id=${idResumoPedido}`
            const response = await axios.get(apiUrl)
            // const response = await getDetalheDistribuicao(idResumoPedido, page, pageSize)

            return res.json(response.data);
        } catch (error) {
            console.error("erro no controller Compras getListaDetalheDistribuicao:", error);
            throw error;
        }
    }
    async getListaDistribuicaoSugestoesHistorico(req, res) {
        let {idPedidoCompra } = req.query;
        
            idPedidoCompra = idPedidoCompra ? idPedidoCompra : '';
        
        try {
            // const apiUrl = `${url}/api/compras/distribuicao-compras-sugestoes-historico.xsjs?page=&id=${idPedidoCompra}`
            // const response = await axios.get(apiUrl)
            const response = await getDistribuicaoSugestoesHistorico(idPedidoCompra)

            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    //  UPDATE

    async putTamanhosPedidos(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/tamanhospedidos.xsjs`
            // const response = await axios.post(apiUrl, { dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateTamanhosPedidos(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras putTamanhosPedidos", error);
            throw error;
        }
    }

    async putCategoriasPedidos(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/tamanhospedidos.xsjs`
            // const response = await axios.post(apiUrl, { dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateCategoriasPedidos(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras putCategoriasPedidos", error);
            throw error;
        }
    }

    async postCategoriasPedidos(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/tamanhospedidos.xsjs`
            // const response = await axios.post(apiUrl, { dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createCategoriasPedidos(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras putCategoriasPedidos", error);
            throw error;
        }
    }

    async updateProdutoImagem(req, res) {
        let { IDIMAGEMPRODUTO, STATIVO } = req.body;

        try {
            const apiUrl = `${url}/api/compras/atualiza_produtosimagem.xsjs`
            const response = await axios.put(apiUrl, {
                IDIMAGEMPRODUTO,
                STATIVO
            })

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async putTransportador(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/transportador.xsjs`
            // const response = await axios.post(apiUrl, { dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateTransportador(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras putTransportador", error);
            throw error;
        }
    }
    async postTransportador(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/transportador.xsjs`
            // const response = await axios.post(apiUrl, { dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createTransportador(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras putTransportador", error);
            throw error;
        }
    }
    

    async putCondicaoPagamento(req, res) {

        try {
            // const apiUrl = `${url}/api/compras/condicaopagamento.xsjs`
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateCondicaoPagamento(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async putGrupoEstrutura(req, res) {
        try {
    
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateGrupoEstrutura(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }
    async postGrupoEstrutura(req, res) {
        try {
    
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createGrupoEstrutura(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }
    async putSubGrupoEstrutura(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/subgrupoestrutura.xsjs`
            // const response = await axios.put(apiUrl, {
            //     dados
            // });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateSubGrupoEstrutura(dados);
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async putUnidadesDeMedidas(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/unidadesdemedidas.xsjs`
            // const response = await axios.put(apiUrl, {
            //     dados
            // });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateUnidadesDeMedidas(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async putCores(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/cores.xsjs`
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateCor(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras UpdateCores", error);
            throw error;
        }
    }

    async putEstilos(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  updateEstilo(dados);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async putTipoTecidos(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateTipoTecido(dados);
            // const apiUrl = `${url}/api/compras/tipotecidos.xsjs`
            
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras UpdateTipoTecidos", error);
            throw error;
        }
    }

    async putFabricanteFornecedor(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateFabricanteFornecedor(dados);
            // const apiUrl = `${url}/api/compras/tipotecidos.xsjs`
            
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras putFabricanteFornecedor", error);
            throw error;
        }
    }

    async putFabricante(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateFabricante(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras putFabricante", error);
            throw error;
        }
    }

   

    //  este update é para excluir vinculo de tamanho com categoria
    async deleteVinculoCategoriaTamanhoPedido(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/del_vinctamcat.xsjs?IDCATPEDIDOTAMANHO=${IDCATPEDIDOTAMANHO}`
            // const response = await axios.put(apiUrl);
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await deleteVinculoCategoriaTamanhoPedido(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras DeleteVinculoCategoriaTamanhoPedido", error);
            throw error;
        }
    }

    async putDeletarVinculoFabricanteFornecedor(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await deletarVinculoFabricanteFornecedor(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras deletarVinculoFabricanteFornecedor", error);
            throw error;
        }
    }

    async putAtualizaImagem(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateImagem(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras putAtualizaImagem", error);
            throw error;
        }
    }
    async putAtualizaProdutosImagem(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updateProdutosImagem(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras putAtualizaProdutosImagem", error);
            throw error;
        }
    }
    
    async putPromocao(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await updatePromocao(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras putPromocao", error);
            throw error;
        }
    }

    async putAndamentoPedido(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
    
            // Filtra apenas os registros válidos
            const dadosValidos = dados.filter(dado => 
                dado.IDADIANTAMENTO !== null && dado.IDADIANTAMENTO !== '' &&
                dado.IDRESUMOPEDIDO !== null && dado.IDRESUMOPEDIDO !== '' 
            );
    
            if (!dadosValidos.length) {
                return res.status(400).json({
                    status: 'error',
                    message: 'IDADIANTAMENTO e IDRESUMOPEDIDO não podem ser vazios, nulos ou 0.',
                });
            }
    
            const response = await updateAndamentoPedido(dadosValidos);
            console.log(response)
            return res.json(response);
    
        } catch (error) {
            console.error("Erro no Controller Compras putAndamentoPedido:", error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar andamento do pedido',
                error: error.message,
            });
        }
    }
    
    

    // async putAndamentoPedido(req, res) {
    //     try {
    //         const dados = Array.isArray(req.body) ? req.body : [req.body];
    //         const response = await updateAndamentoPedido(dados)
        
    //         return res.json(response);
    //     } catch (error) {
    //         console.error("erro no Controller Compras putAndamentoPedido", error);
    //         throw error;
    //     }
    // }

    // CREATE

    async postPromocao(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createPromocao(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras postPromocao", error);
            throw error;
        }
    }

    async postSubGrupoEstrutura(req, res) {

        try {
            // const apiUrl = `${url}/api/compras/subgrupoestrutura.xsjs`
            // const response = await axios.post(apiUrl, {
            //     dados
            // });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createSubGrupoEstrutura(dados);
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }
    async postCondicaoPagamento(req, res) {
       

        try {
            // const apiUrl = `${url}/api/compras/condicaopagamento.xsjs`
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createCondicaoPagamento(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras CreateCondicaoPagamento", error);
            throw error;
        }
    }

    async postUnidadesDeMedidas(req, res) {

        try {

            // const apiUrl = `${url}/api/compras/unidadesdemedidas.xsjs`
            // const response = await axios.post(apiUrl, {  dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createUnidadesDeMedidas(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async postCores(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/cores.xsjs`
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createCor(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras CreateCores", error);
            throw error;
        }
    }

    async postEstilos(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await  createEstilo(dados);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }
    async postTipoTecidos(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/tipotecidos.xsjs`
            // const response = await axios.post(apiUrl, { dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createTipoTecido(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras CreateTipoTecidos", error);
            throw error;
        }
    }
    async postTamanhosPedidos(req, res) {
        try {
            // const apiUrl = `${url}/api/compras/tamanhospedidos.xsjs`
            // const response = await axios.post(apiUrl, { dados });
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createTamanhosPedidos(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no controller Compras CreateTipoTecidos", error);
            throw error;
        }
    }

    async postFabricanteFornecedor(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createFabricanteFornecedor(dados);
            // const apiUrl = `${url}/api/compras/tipotecidos.xsjs`
            
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras postFabricanteFornecedor", error);
            throw error;
        }
    }
    async postFabricante(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];
            const response = await createFabricante(dados);
            return res.json(response);
        } catch (error) {
            console.error("erro no Controller Compras postFabricante", error);
            throw error;
        }
    }
}

export default new ComprasControllers();