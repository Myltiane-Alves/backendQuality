import { Router } from 'express';
import DashBoardVendasControllers from '../controllers/venda.js';


const routes = new Router();

routes.get('/resumo-venda-convenio-desconto', DashBoardVendasControllers.getVendasConvenioDescontoFuncionario)
routes.get('/detalhe-venda', DashBoardVendasControllers.getRetornoVendasAtivasDetalheProduto)
routes.get('/resumo-venda-caixa-detalhado', DashBoardVendasControllers.getListaVendaDetalhe)
routes.get('/venda-resumido', DashBoardVendasControllers.getListaVendasLojaResumidoGerencia)
routes.get('/vendasVendedorPeriodoLojaGerencia', DashBoardVendasControllers.getListaVendasVendedorPeriodoGerencia)
routes.get('/vendas-recebimentos', DashBoardVendasControllers.getListaRecebimento)
routes.get('/lista-caixas-movimento-gerencia', DashBoardVendasControllers.getListaCaixaMovimentosGerencia)

export default routes;