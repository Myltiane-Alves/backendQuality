import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getFornecedores } from "../repositories/fornecedor.js";
import { getPedidos } from "../repositories/listaPedidos.js";
import { getDetalhePedido } from "../repositories/listaDetalhePedidosGrade.js";
import { createEstilo, getEstilos, updateEstilo } from "../repositories/estilos.js";
import 'dotenv/config';
const url = process.env.API_URL;

class ComprasControllers {

    async getListaTodosPedidos(req, res) {
        let { dataPesquisaInicio, dataPesquisaFim } = req.query;
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
        try {
            const apiUrl = `${url}/api/compras/lista_pedidos.xsjs?pageSize=1000&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaPedidosDetalhado(req, res) {
        let { dataPesquisaInicio, dataPesquisaFim, idFornecedor, idMarca, idPedido } = req.query;
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
        idFornecedor = idFornecedor ? idFornecedor : '';
        idMarca = idMarca ? idMarca : '';
        idPedido = idPedido ? idPedido : '';

        try {
            const apiUrl = `${url}/api/compras/lista_pedidos_detalhado.xsjs?pageSize=500&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornPesquisa=${idFornecedor}&idMarcaPesquisa=${idMarca}&idpedido=${idPedido}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    async getListaDetalhePedidos(req, res) {
        let { idPedido } = req.query;
        idPedido = idPedido ? idPedido : '';

        try {
            const apiUrl = `${url}/api/compras/lista_detalhepedidos.xsjs?idpedido=${idPedido}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaPromocoes(req, res) {
        let { dataPesquisaInicio, dataPesquisaFim } = req.query;
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
        try {
            const apiUrl = `${url}/api/compras/lista_promocoes.xsjs?pageSize=1000&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
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
        let {idPedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, idComprador, stSituacaoSap, page, pageSize } = req.query;
        idPedido = idPedido ? idPedido : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        idMarca = idMarca ? idMarca : '';
        idFornecedor = idFornecedor ? idFornecedor : '';
        idFabricante = idFabricante ? idFabricante : '';
        idComprador = idComprador ? idComprador : '';
        stSituacaoSap = stSituacaoSap ? stSituacaoSap : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            const apiUrl = `${url}/api/compras/lista_pedidos.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornPesquisa=${idFornecedor}&idMarcaPesquisa=${idMarca}&idpedido=${idPedido}&idFabPesquisa=${idFabricante}&idCompradorPesquisa=${idComprador}&stSituacaoSAP=${stSituacaoSap}`;
            const response = await axios.get(apiUrl)
            // const response = await getPedidos(idPedido, dataPesquisaFim, dataPesquisaInicio, idMarca, idFornecedor, idFabricante, idComprador, stSituacaoSap, page, pageSize)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    async getListaDetalhePedidos(req, res) {
        let {idPedido, idDetalhePedido, dataPesquisaInicio, dataPesquisaFim,  page, pageSize } = req.query;
        idPedido = idPedido ? idPedido : '';
        idDetalhePedido = idDetalhePedido ? idDetalhePedido : '';
        dataPesquisaInicio = dataPesquisaInicio ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataPesquisaFim ? dataFormatada(dataPesquisaFim) : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';

        try {
            const apiUrl = `${url}/api/compras/lista_detalhepedidosgrade.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idpedido=${idPedido}`;
            const response = await axios.get(apiUrl)
            // const response = await getDetalhePedido(idPedido, idDetalhePedido, dataPesquisaInicio, dataPesquisaFim,  page, pageSize)
            return res.json(response.data); // Retorna
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
        let { idFornecedor, idProduto } = req.query;
        idFornecedor = idFornecedor ? idFornecedor : '';
        idProduto = idProduto ? idProduto : '';

        try {
            const apiUrl = `${url}/api/compras/fornecedor-produto.xsjs?idFornecedor=${idFornecedor}&idProduto=${idProduto}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    
    async getListaFabricantes(req, res) {
        let { idFabricante } = req.query;
        idFabricante = idFabricante ? idFabricante : '';
        try {
            const apiUrl = `${url}/api/compras/fabricante.xsjs?idFab=${idFabricante}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
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
        let { idFabricante, descricaoFornecedor, idFornecedor, cnpjFornecedor } = req.query;
        idFabricante = idFabricante ? idFabricante : '';
        descricaoFornecedor = descricaoFornecedor ? descricaoFornecedor : '';
        idFornecedor = idFornecedor ? idFornecedor : '';
        cnpjFornecedor = cnpjFornecedor ? cnpjFornecedor : '';

        try {
            const apiUrl = `${url}/api/compras/fornecedor-fabricante.xsjs?idFab=${idFabricante}&descFornecedor=${descricaoFornecedor}&idFor=${idFornecedor}&CNPJFornecedor=${cnpjFornecedor}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }
    async getListaFabricanteCadastro(req, res) {
        let { idFabricante, descricaoFabricante, idFornecedor } = req.query;
        idFabricante = idFabricante ? idFabricante : '';
        descricaoFabricante = descricaoFabricante ? descricaoFabricante : '';
        idFornecedor = idFornecedor ? idFornecedor : '';


        try {
            const apiUrl = `${url}/api/compras/fabricante-fornecedor.xsjs?idFab=${idFabricante}&descFab=${descricaoFabricante}&idFor=${idFornecedor}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
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
        let { idCondPagamentos, descricaoPagamento } = req.query;
        idCondPagamentos = idCondPagamentos ? idCondPagamentos : '';
        descricaoPagamento = descricaoPagamento ? descricaoPagamento : '';
        try {
            const apiUrl = `${url}/api/compras/condicaopagamento.xsjs?idCondPag=${idCondPagamentos}&descCondPag=${descricaoPagamento}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
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
        let { idTransportador, descricaoTransportador, cnpjTransportador } = req.query;
        idTransportador = idTransportador ? idTransportador : '';
        descricaoTransportador = descricaoTransportador ? descricaoTransportador : '';
        cnpjTransportador = cnpjTransportador ? cnpjTransportador : '';
        try {
            const apiUrl = `${url}/api/compras/transportador.xsjs?idTransportador=${idTransportador}&descTransportador=${descricaoTransportador}&CNPJTransportador=${cnpjTransportador}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }
    async getListaByIdTransportador(req, res) {
        let { idTransportador } = req.query;
        idTransportador = idTransportador ? idTransportador : '';

        try {
            const apiUrl = `${url}/api/compras/transportador.xsjs?idTransportador=${idTransportador}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaEstruturaMercadoria(req, res) {
        let {idSubGrupoEstrutura, descricao } = req.query;
        idSubGrupoEstrutura = idSubGrupoEstrutura ? idSubGrupoEstrutura : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/subgrupoestrutura.xsjs?idSubGrupoExt=${idSubGrupoEstrutura}&descSubGrupoExt=${descricao}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaImagemProduto(req, res) {
        let { numPage, numeroRefProduto, idFabricante, idSubEstrutura } = req.query;
        numPage = numPage ? numPage : '';
        numeroRefProduto = numeroRefProduto ? numeroRefProduto : '';
        idFabricante = idFabricante ? idFabricante : '';
        idSubEstrutura = idSubEstrutura ? idSubEstrutura : '';


        try {
            const apiUrl = `${url}/api/compras/imagemproduto.xsjs?page=${numPage}&NuRefImgProd=${numeroRefProduto}&IDFabImagem=${idFabricante}&IDSubEstImagem=${idSubEstrutura}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaDetalheImagemProduto(req, res) {
        let { idImagem } = req.query;
        idImagem = idImagem ? idImagem : '';


        try {
            const apiUrl = `${url}/api/compras/lista_produtosimagem.xsjs?IDImagens=${idImagem}`
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
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
        let { idGrupoEstrutura, descricaoGrupoEstrutura} = req.query;
        idGrupoEstrutura = idGrupoEstrutura ? idGrupoEstrutura : '';
        descricaoGrupoEstrutura = descricaoGrupoEstrutura ? descricaoGrupoEstrutura : '';
        try {
            const apiUrl = `${url}/api/compras/grupoextrutura.xsjs?idGrupoExt=${idGrupoEstrutura}&descGrupoExt=${descricaoGrupoEstrutura}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaUnidadeMedida(req, res) {
        let { idUnidadeMedida, descricao} = req.query;
        idUnidadeMedida = idUnidadeMedida ? idUnidadeMedida : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/unidadesdemedidas.xsjs?idUnidMed=${idUnidadeMedida}&descUnidMed=${descricao}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaCores(req, res) {
        let { idCor, descricao} = req.query;
        idCor = idCor ? idCor : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/cores.xsjs?idCor=${idCor}&descCor=${descricao}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
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

    async getListaTipoTecidos(req, res) {
        let { idTecido, descricao} = req.query;
        idTecido = idTecido ? idTecido : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/tipotecidos.xsjs?idTecido=${idTecido}&descTecido=${descricao}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaCategoriaPedidos(req, res) {
        let { idCategoriaPedido, descricao} = req.query;
        idCategoriaPedido = idCategoriaPedido ? idCategoriaPedido : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/categoriapedidos.xsjs?idCatPed=${idCategoriaPedido}&descCatPed=${descricao}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaTamanhosPedidos(req, res) {
        let { idTamanhoPedido, descricao} = req.query;
        idTamanhoPedido = idTamanhoPedido ? idTamanhoPedido : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/tamanhospedidos.xsjs?idTamPed=${idTamanhoPedido}&descTamPed=${descricao}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaTamanhosCategoriaPedidos(req, res) {
        let { idCategoriaPedido, descricao, idTamanhoPedido} = req.query;
        idCategoriaPedido = idCategoriaPedido ? idCategoriaPedido : '';
        descricao = descricao ? descricao : '';
        idTamanhoPedido = idTamanhoPedido ? idTamanhoPedido : '';
        try {
            const apiUrl = `${url}/api/compras/vinctamcat.xsjs?idCatPeid=${idCategoriaPedido}&descCatPed=${descricao}&idTamPed=${idTamanhoPedido}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaUnidadeMedida(req, res) {
        let { idUnidadeMedida, descricao} = req.query;
        idUnidadeMedida = idUnidadeMedida ? idUnidadeMedida : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/unidademedida.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaTipoTecidos(req, res) {
        let { idTecido, descricao} = req.query;
        idTecido = idTecido ? idTecido : '';
        descricao = descricao ? descricao : '';
        try {
            const apiUrl = `${url}/api/compras/tipo-tecido.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaLocalExposicao(req, res) {
        let { } = req.query;
   
        try {
            const apiUrl = `${url}/api/compras/localexposicao.xsjs`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaDistribuicaoHistorico(req, res) {
        let {idFornecedor, dataPesquisaInicio, dataPesquisaFim } = req.query;
        
        idFornecedor = idFornecedor ? idFornecedor : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
        try {
            const apiUrl = `${url}/api/compras/distribuicao-compras-historico.xsjs?page=&idfornecedorpedido=${idFornecedor}&datainicial=${dataPesquisaInicio}&datafinal=${dataPesquisaFim}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async getListaDetalheDistribuicao(req, res) {
        let {idPedido } = req.query;
        
        idPedido = idPedido ? idPedido : '';
        try {
            const apiUrl = `${url}/api/compras/detalhe-distribuicao-compras.xsjs?page=&id=${idPedido}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }
    async getListaDistribuicaoSugestoesHistorico(req, res) {
        let {idPedido } = req.query;
        
        idPedido = idPedido ? idPedido : '';
        try {
            const apiUrl = `${url}/api/compras/distribuicao-compras-sugestoes-historico.xsjs?page=&id=${idPedido}`
            const response = await axios.get(apiUrl)

            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    //  UPDATE
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

    async updateCadastroTransportador(req, res) {
        let {
            IDTRANSPORTADORA,
            IDGRUPOEMPRESARIAL,
            IDSUBGRUPOEMPRESARIAL,
            NORAZAOSOCIA,
            NOFANTASIA,
            NUCNPJ,
            NUINSCESTADUAL,
            NUINSCMUNICIPAL,
            NUIBGE,
            EENDERECO,
            ENUMERO,
            ECOMPLEMENTO,
            EBAIRRO,
            ECIDADE,
            SGUF,
            NUCEP,
            EEMAIL,
            NUTELEFONE1,
            NUTELEFONE2,
            NUTELEFONE3,
            NOREPRESENTANTE,
            DTCADASTRO,
            DTULTATUALIZACAO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/transportador.xsjs`
            const response = await axios.put(apiUrl, {
                IDTRANSPORTADORA,
                IDGRUPOEMPRESARIAL,
                IDSUBGRUPOEMPRESARIAL,
                NORAZAOSOCIA,
                NOFANTASIA,
                NUCNPJ,
                NUINSCESTADUAL,
                NUINSCMUNICIPAL,
                NUIBGE,
                EENDERECO,
                ENUMERO,
                ECOMPLEMENTO,
                EBAIRRO,
                ECIDADE,
                SGUF,
                NUCEP,
                EEMAIL,
                NUTELEFONE1,
                NUTELEFONE2,
                NUTELEFONE3,
                NOREPRESENTANTE,
                DTCADASTRO,
                DTULTATUALIZACAO,
                STATIVO
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async updateCondicaoPagamento(req, res) {
        let dados = {
            IDCONDICAOPAGAMENTO,
            IDGRUPOEMPRESARIAL,
            IDEMPRESA,
            DSCONDICAOPAG,
            STPARCELADO,
            NUPARCELAS,
            NUNDIA1PAG,
            NUNDIA2PAG,
            NUNDIA3PAG,
            NUNDIA4PAG,
            NUNDIA5PAG,
            NUNDIA6PAG,
            NUNDIA7PAG,
            NUNDIA8PAG,
            NUNDIA9PAG,
            NUNDIA10PAG,
            NUNDIA11PAG,
            NUNDIA12PAG,
            DTULTALTERACAO,
            QTDDIAS,
            DSTPDOCUMENTO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/condicaopagamento.xsjs`
            const response = await axios.put(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async updateSubGrupoEstrutura(req, res) {
        let dados = {
            IDGRUPOESTRUTURAANTIGA,
            IDGRUPOESTRUTURA,
            DSSUBGRUPOESTRUTURA,
            DSSUBGRUPOESTRUTURAFIM,
            CODSUBGRUPOESTRUTURA,
            IDSUBGRUPOESTRUTURA,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/subgrupoestrutura.xsjs`
            const response = await axios.put(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async updateUnidadeMedida(req, res) {
        let dados = {
            IDUNIDADEMEDIDA,
            DSUNIDADE,
            DSSIGLA,
            DTCADASTRO,
            DTULTATUALIZACAO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/unidadesdemedidas.xsjs`
            const response = await axios.put(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async updateCores(req, res) {
        let dados = {
            IDCOR,
            IDGRUPOCOR,
            DSCOR,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/cores.xsjs`
            const response = await axios.put(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
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

    async updateTipoTecidos(req, res) {
        let dados = {
            IDTPTECIDO,
            DSTIPOTECIDO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/tipotecidos.xsjs`
            const response = await axios.put(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async updateCategoriaPedidos(req, res) {
        let dados = {
            IDCATEGORIAPEDIDO,
            DSCATEGORIAPEDIDO,
            TIPOPEDIDO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/categoriapedidos.xsjs`
            const response = await axios.put(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    //  este update é para excluir vinculo de tamanho com categoria
    async updateVinculoTamanhoCategoria(req, res) {
        let {
            IDCATPEDIDOTAMANHO,
        } = req.query;

        try {
            const apiUrl = `${url}/api/compras/del_vinctamcat.xsjs?IDCATPEDIDOTAMANHO=${IDCATPEDIDOTAMANHO}`
            const response = await axios.put(apiUrl);
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos dados enviados:", error);
            throw error;
        }
    }

    // CREATE
    async createSubGrupoEstrutura(req, res) {
        let dados = {
            IDGRUPOESTRUTURAANTIGA,
            IDGRUPOESTRUTURA,
            DSSUBGRUPOESTRUTURA,
            DSSUBGRUPOESTRUTURAFIM,
            CODSUBGRUPOESTRUTURA,
            IDSUBGRUPOESTRUTURA,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/subgrupoestrutura.xsjs`
            const response = await axios.post(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }
    async createCondicaoPagamento(req, res) {
        let dados = {
            IDCONDICAOPAGAMENTO,
            IDGRUPOEMPRESARIAL,
            IDEMPRESA,
            DSCONDICAOPAG,
            STPARCELADO,
            NUPARCELAS,
            NUNDIA1PAG,
            NUNDIA2PAG,
            NUNDIA3PAG,
            NUNDIA4PAG,
            NUNDIA5PAG,
            NUNDIA6PAG,
            NUNDIA7PAG,
            NUNDIA8PAG,
            NUNDIA9PAG,
            NUNDIA10PAG,
            NUNDIA11PAG,
            NUNDIA12PAG,
            DTULTALTERACAO,
            QTDDIAS,
            DSTPDOCUMENTO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/condicaopagamento.xsjs`
            const response = await axios.post(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async createUnidadeMedida(req, res) {
        let dados = {
            IDUNIDADEMEDIDA,
            DSUNIDADE,
            DSSIGLA,
            DTCADASTRO,
            DTULTATUALIZACAO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/unidadesdemedidas.xsjs`
            const response = await axios.post(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async createCores(req, res) {
        let dados = {
            IDCOR,
            IDGRUPOCOR,
            DSCOR,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/cores.xsjs`
            const response = await axios.post(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
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
    async createTipoTecidos(req, res) {
        let dados = {
            IDTPTECIDO,
            DSTIPOTECIDO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/tipotecidos.xsjs`
            const response = await axios.post(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos do banco:", error);
            throw error;
        }
    }

    async createCategoriaPedidos(req, res) {
        let dados = {
            IDCATEGORIAPEDIDO,
            DSCATEGORIAPEDIDO,
            TIPOPEDIDO,
            STATIVO
        } = req.body;

        try {
            const apiUrl = `${url}/api/compras/categoriapedidos.xsjs`
            const response = await axios.post(apiUrl, {
                dados
            });
            return res.json(response.data);
        } catch (error) {
            console.error("erro nos campos preenchido:", error);
            throw error;
        }
    }
}

export default new ComprasControllers();