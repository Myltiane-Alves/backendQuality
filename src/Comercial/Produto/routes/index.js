import { Router } from 'express';
import ComercialProdutoControllers from '../controllers/index.js';


const comercialProdutoRoutes = new Router();


comercialProdutoRoutes.get('/lista-marca-produto', ComercialProdutoControllers.getListaMarcaProduto)
comercialProdutoRoutes.get('/lista-fornecedor-produto', ComercialProdutoControllers.getListaFornecedorProduto)
comercialProdutoRoutes.get('/grupo-produto', ComercialProdutoControllers.getListaGrupoProduto)
comercialProdutoRoutes.get('/subgrupo-produto', ComercialProdutoControllers.getListaSubGrupoProduto)
comercialProdutoRoutes.get('/vendas-por-produtos', ComercialProdutoControllers.getListaVendasPorProduto)
comercialProdutoRoutes.get('/vendas-vendedor-estrutura', ComercialProdutoControllers.getListaVendasVendedorEstrutura)
comercialProdutoRoutes.get('/produtos-mais-vendidos', ComercialProdutoControllers.getListaProdutosMaisVendidosEstrutura)
comercialProdutoRoutes.get('/vendas-por-estrutura', ComercialProdutoControllers.getListaVendasIndicadoresEstrutura)

export default comercialProdutoRoutes;