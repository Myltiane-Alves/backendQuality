import { Router } from 'express';
import DashBoardAdiantamentoSalarialControllers from '../AdiantamentoSalarial/controllers/index.js';
import DashBoardVendasControllers from '../Vendas/controllers/venda.js';
import DashBoardFuncionariosControllers from '../Funcionario/controllers/funcionarios.js';
import DashBoardControllers from '../controllers/DashBoard.js';

const routes = new Router();


routes.get('/lista-quebra-caixa', DashBoardControllers.getListaQuebraCaixa)
routes.get('/listaDeQuebraDeCaixaPositiva', DashBoardControllers.getListaQuebraCaixaPositiva)
routes.get('/listaDeQuebraDeCaixaNegativa', DashBoardControllers.getListaQuebraCaixaNegativa)
routes.get('/quebraCaixaQuebraCaixa', DashBoardControllers.getRetornoTableImprimeQuebra)
routes.get('/resumoVendaConvenioDesc', DashBoardControllers.getRetornoListaVendasConvenioDesconto)
routes.get('/resumoVendaGerencia', DashBoardControllers.getResumoVendaGerencia)
// routes.get('/listaCaixaMovimentoGerencia', DashBoardControllers.retornoListaCaixasMovimentoGerencia)
routes.get('/vendaVendedorGerencia', DashBoardControllers.getListaVendasVendedorGerencia)
routes.get('/vendasAtivasResumoGerencia', DashBoardControllers.getListaResumoVendasAtivaGerencia)
routes.get('/vendasCanceladasResumoGerencia', DashBoardControllers.getListaResumoVendasCanceladasGerencia)
routes.get('/adiantamentoSalarialFuncionarios', DashBoardControllers.getListAdiantamentoLoja)
routes.get('/adiantamentoSalarialFuncionariosGerencia', DashBoardControllers.getAdiantamentoSalarialFuncionario)
// routes.get('/vendasResumoLojaGerencia', DashBoardControllers.getListaVendasLojaResumidoGerencia)
// routes.get('/vendasVendedorPeriodoLojaGerencia', DashBoardControllers.getListaVendasVendedorPeriodoGerencia)
routes.get('/extratoLojaPeriodoGerencia', DashBoardControllers.getListaExtratoDaLojaPeriodoADM)
routes.get('/relatorioBI', DashBoardControllers.getListaRelatorioBIGerencia)
routes.get('/listaVendasGerencia', DashBoardControllers.getListaVendasGerencia)
routes.get('/extratoLojaPeriodo', DashBoardControllers.getListaExtratoDaLojaPeriodo)
routes.get('/adiantamentoSalarialData', DashBoardControllers.getListAdiantamentoSalarialData)
// routes.get('/detalheVenda', DashBoardControllers.getRetornoListaVendasAtivasDetalheProduto)
// routes.get('/resumoVendaCaixaDetalhado', DashBoardControllers.getRetornoListaVendaDetalhe)


// routes.get('/listaFuncionarioVendasDesconto', DashBoardControllers.getListaFuncionario)
routes.get('/funcionarios', DashBoardFuncionariosControllers.getListaFuncionarios)

routes.get('/adiantamento-loja', DashBoardAdiantamentoSalarialControllers.getListaAdiantamentoSalarialLoja)
routes.get('/adiantamento-funcionarios', DashBoardAdiantamentoSalarialControllers.getListaAdiantamentosFuncionarios)
routes.get('/adiantamentos-salarial', DashBoardAdiantamentoSalarialControllers.getListaAdiantamentosSalarialDashBoard)

routes.put('/atualizacao-adiantamento-status', DashBoardAdiantamentoSalarialControllers.updateAdiantamentoStatus)
routes.post('/adiantamento-salarial', DashBoardAdiantamentoSalarialControllers .postAdiantamentoSalarial)
routes.put('/adiantamento-salarial/:id', DashBoardAdiantamentoSalarialControllers .putAdiantamentoSalarial)

// routes.get('/resumoVendaConvenioDescontoFN', DashBoardControllers.getRetornoListaVendasConvenioDescontoFuncionario)
routes.get('/resumo-venda-convenio-desconto', DashBoardVendasControllers.getVendasConvenioDescontoFuncionario)
routes.get('/detalhe-venda', DashBoardVendasControllers.getRetornoVendasAtivasDetalheProduto)
routes.get('/resumo-venda-caixa-detalhado', DashBoardVendasControllers.getListaVendaDetalhe)
routes.get('/venda-resumido', DashBoardVendasControllers.getListaVendasLojaResumidoGerencia)
routes.get('/vendasVendedorPeriodoLojaGerencia', DashBoardVendasControllers.getListaVendasVendedorPeriodoGerencia)
routes.get('/vendas-recebimentos', DashBoardVendasControllers.getListaRecebimento)
routes.get('/lista-caixas-movimento-gerencia', DashBoardVendasControllers.getListaCaixaMovimentosGerencia)

// routes.put('/atualizacaoStatus', DashBoardControllers.updateStatusQuebraCaixaLoja)

export default routes;