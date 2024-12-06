import { Router } from 'express';
import ContabilidadeControllers from '../controllers/Contabilidade.js';

const routes = new Router();

routes.get('/listaVendasContigencia', ContabilidadeControllers.getListaVendasContigencia)
routes.get('/vendasDetalheContigencia', ContabilidadeControllers.getListaDetalheVendasContigencia)
routes.get('/vendasPagamentoContigencia', ContabilidadeControllers.getListaPagamentoVendasContigencia)
routes.get('/vendasEstoqueComercial', ContabilidadeControllers.getListaVendasEstoqueComercial)
routes.get('/vendasProdutos', ContabilidadeControllers.getListaVendasPeriodo)
routes.get('/vendasProdutosConsolidado', ContabilidadeControllers.getListaVendasPeriodoConsolidado)

export default routes;