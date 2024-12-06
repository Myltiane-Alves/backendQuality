import { Router } from 'express';
import ComercialControllers from '../controllers/Comercial.js';


const comercialRoutes = new Router();

comercialRoutes.get('/listaProdutoSap', ComercialControllers.getListaProdutoSap)
comercialRoutes.get('/listaEmpresaComercial', ComercialControllers.getListaEmpresaComercial)
// comercialRoutes.get('/listaVendasPorProduto', ComercialControllers.getListaVendasEstruturaProdutos)
comercialRoutes.get('/vendaMarcaPeriodoFinanceiro', ComercialControllers.getListaVendasMarcaPorPeriodoComercial)
comercialRoutes.get('/vendasEstoqueGrupoSubGrupo', ComercialControllers.getListaVendasEstoqueGrupoSubGrupoComercial)
comercialRoutes.get('/produtosPrecosEstoquesLojas', ComercialControllers.getListaProdutosEstoquePrecoLoja)
comercialRoutes.get('/vendasEstoqueProduto', ComercialControllers.getListaVendasPosicionamentoEstoquePeriodos)
comercialRoutes.get('/funcionarioRelatorio', ComercialControllers.getListaColaboradorRelatorio)
comercialRoutes.get('/custoPorLoja', ComercialControllers.getListaVendasCustoLojas)
comercialRoutes.get('/vendasPosicionamentoEstoque', ComercialControllers.getListaVendasPosicionamentoEstoque)
comercialRoutes.get('/colaboradorProdutosVendidos', ComercialControllers.getListaColaboradorProdutosVendidos)
comercialRoutes.get('/listaMetaVendas', ComercialControllers.getListaMetasGrupo)
comercialRoutes.get('/listaPremiacoes', ComercialControllers.getListaPremiacoesPeriodo)

// comercialRoutes.get('/listaGrupoProduto', ComercialControllers.getListaGrupoProduto)
// comercialRoutes.get('/listaSubGrupoProduto', ComercialControllers.getListaSubGrupoProduto)

// comercialRoutes.get('/lista-marca-produto', ComercialProdutoControllers.getListaMarcaProduto)
// comercialRoutes.get('/lista-fornecedor-produto', ComercialProdutoControllers.getListaFornecedorProduto)
// comercialRoutes.get('/grupo-produto', ComercialProdutoControllers.getListaGrupoProduto)
// comercialRoutes.get('/subgrupo-produto', ComercialProdutoControllers.getListaSubGrupoProduto)
// comercialRoutes.get('/vendas-por-produtos', ComercialProdutoControllers.getListaVendasPorProduto)
// comercialRoutes.get('/vendas-vendedor-estrutura', ComercialProdutoControllers.getListaVendasVendedorEstrutura)
// comercialRoutes.get('/produtos-mais-vendidos', ComercialProdutoControllers.getListaProdutosMaisVendidosEstrutura)
// comercialRoutes.get('/vendas-por-estrutura', ComercialProdutoControllers.getListaVendasIndicadoresEstrutura)

export default comercialRoutes;