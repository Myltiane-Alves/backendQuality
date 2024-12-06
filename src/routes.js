import { Router } from 'express';
import authMiddleware  from './middlewares/authMiddleware.js';

import FuncionariosControllers from "./Funcionarios/controllers/index.js";
import EmpresaControllers from "./Empresas/controllers/Empresas.js"
import ApiPing from './controllers/ApiPing.js';
import AuthentiCationController from './Auth/controllers/Auth.js';
import AdministrativoControllers from './Administrativo/controllers/Administrativo.js';
import FinanceiroControllers from './Financeiro/controllers/Financeiro.js';
import InformaticaControllers from './Informatica/controllers/Informatica.js';
import ExpedicaoControllers from './Expedicao/controllers/index.js';
import DashBoardControllers from './DashBoard/controllers/DashBoard.js';
import VendasControllers from './Vendas/controllers/Vendas.js';
import ResumoVoucherControllers from './ResumoVoucher/controllers/index.js';
import ComercialControllers from './Comercial/controllers/Comercial.js';
import ComprasControllers from './Compras/controllers/Compras.js';
import CadastroControllers from './Cadastro/controllers/Cadastro.js';
import ProdutoControllers from './Produtos/controllers/Produtos.js';
import DepositosLojaControllers from './DepositoLoja/controllers/DepositosLoja.js';
import ContaBancoControllers from './ContaBanco/controllers/ContaBanco.js';
import DespesasLojaControllers from './Despesas/controllers/DespesasLoja.js';
import CategoriaReceitaDespesasControllers from './CategoriaReceita/controllers/CategoriaReceitaDespesa.js';
import MovimentoCaixaControllers from './Gerencia/MovimentoCaixa/controllers/MovimentoCaixa.js';
import DetalheFaturasControllers from './DetalheFaturas/controllers/Detalhes.js';
import MarketingControllers from './Marketing/controllers/Marketing.js';
import ContabilidadeControllers from './Contabilidade/controllers/Contabilidade.js';
import ConfiguracaoPixPDVControllers from './ConfiguracaoPIX/controllers/ConfiguracaoPixPDV.js';
import ConferenciaCegaControllers from './ConferenciaCega/controllers/ConferenciaCega.js';
import ListaPrecoControllers from './controllers/ListaPreco.js';
import LogsControllers from './LogsUsuario/controllers/log.js';



// Financeiro Início
import AdiantamentosControllers from './Financeiro/Adiantamentos/controllers/adiantamentos.js'
import DepositosControllers from './Financeiro/Depositos/controllers/depositos.js'
import CaixasControllers from './Financeiro/Caixas/controllers/caixas.js'
import DescontoControllers from './Financeiro/Desconto/controllers/desconto.js'
import DespesasControllers from './Financeiro/Despesas/controllers/depesas.js'
import DevolucaoControllers from './Financeiro/Devolucao/controllers/devolucao.js'
import EstabelecimentoControllers from './Financeiro/Estabelecimentos/controllers/estabelecimento.js'
import FaturasControllers from './Financeiro/Faturas/controllers/faturas.js'
import PedidosControllers from './Financeiro/Pedidos/controllers/pedidos.js'
import SaldosControllers from './Financeiro/Saldos/controllers/saldos.js'
import FinanceiroVendasControllers from './Financeiro/Vendas/controllers/vendas.js'
import VoucherControllers from './Financeiro/Voucher/controllers/voucher.js'
import ExtratosControllers from './Financeiro/Extrato/controllers/extrato.js'
// Financeiro Fim

import QuebraCaixaControllers from './DashBoard/QuebraCaixa/controllers/quebraCaixaLoja.js'
import ADMCaixasControllers from './Administrativo/Caixa/controllers/admCaixas.js'
import AdmVendasControllers from './Administrativo/Vendas/controllers/admVendas.js'
import AdmPagamentosControllers from './Administrativo/Pagamentos/controllers/pagamentos.js'
import AdmRecebimentosControllers from './Administrativo/Recebimentos/controllers/recebimentos.js'
import AdmDescontoControllers from './Administrativo/Desconto/controllers/desconto.js'
import EstoqueControllers from './Administrativo/Estoque/controllers/estoque.js'
import AdmBalancoControllers from './Administrativo/Balanco/controllers/balanco.js'
import DashBoardVendasControllers from './DashBoard/Vendas/controllers/venda.js';
import DashBoardFuncionariosControllers from './DashBoard/Funcionario/controllers/funcionarios.js';
import DashBoardAdiantamentoSalarialControllers from './DashBoard/AdiantamentoSalarial/controllers/index.js';
import GerenciaControllers from './Gerencia/controllers/index.js';


//  Gerencia
import GERAlteracaoPrecoControllers from './Gerencia/AlteracaoPreco/controllers/index.js'


//  Comercial
import ComercialProdutoControllers from './Comercial/Produto/controllers/index.js'

import ModulosControllers from './Modulos/controllers/modulos.js';

const routes = new Router();
// routes.use(authMiddleware)

routes.get('/', (req, res) => {
    res.send('Hello World! Myltiane');
});

routes.get('/ping', ApiPing.index);

routes.post('/login', AuthentiCationController.login);
// routes.post('/login2', AuthentiCationController.login2);

// routes.use(authMiddleware)

//  Funcionarios 

routes.get('/autorizarVoucher', FuncionariosControllers.getAutorizacaoVoucherFuncionarios)
// routes.get('/listaFuncionariosEmpresa', FuncionariosControllers.getListaFuncionariosEmpresa)
routes.get('/funcionarioAtivoPorEmpresa', FuncionariosControllers. getListaFuncionariosAtivos)
routes.get('/todos-funcionario', FuncionariosControllers.getListaTodosFuncionarios)

routes.get('/empresas', EmpresaControllers.getAllEmpresas);
routes.get('/grupoEmpresarial', EmpresaControllers.getAllGrupoEmpresarial);
routes.get('/subGrupoEmpresarial', EmpresaControllers.getSelectLojaVouchers);
routes.get('/listaEmpresas', EmpresaControllers.getListaEmpresas)
routes.put('/empresas', EmpresaControllers.putListaEmpresas)

routes.get('/modulos', ModulosControllers.getListaModulos)
routes.put('/modulos/:id', ModulosControllers.putModulo)
routes.post('/criar-modulos', ModulosControllers.postModulo)

routes.get('/menus-usuario', ModulosControllers.getListaMenusUsuario)
routes.get('/menus', ModulosControllers.getListaSubMenusUsuario)


// routes.get('/listaCaixasMovimento', AdministrativoControllers.getListaCaixasMovimento);
//Início Administrativo
routes.get('/listaCaixasMovimento', AdministrativoControllers.retornoListaCaixasMovimento);

routes.get('/listaCaixasFechados', AdministrativoControllers.retornoListaCaixasFechados);
routes.get('/vendaVendedor', AdministrativoControllers.getVendaVendedor);
routes.get('/vendaAtivaAction', AdministrativoControllers.getVendaAtivaAction);
routes.get('/vendaAtivaResumo', AdministrativoControllers.getVendaAtivaResumo)
routes.get('/vendaCancelada', AdministrativoControllers.getVendaCancelada);
routes.get('/vendaCanceladaResumo', AdministrativoControllers.getVendaCanceladaResumo);
routes.get('/resumoVenda', AdministrativoControllers.getResumoVenda);
routes.get('/detalheFatura', AdministrativoControllers.getDetalheFatura);
routes.get('/detalheDespesas', AdministrativoControllers.getDetalheDespesas);
routes.get('/resumoVendaConvenio', AdministrativoControllers.getResumoVendaConvenio)
routes.get('/resumoVendaConveniodesconto', AdministrativoControllers.getResumoVendaConvenioDesconto)
routes.get('/detalheVoucher', AdministrativoControllers.getDetalheVoucher)
routes.get('/detalhe-voucher-dados-adm', AdministrativoControllers.getListaDetalheVoucherDados)
routes.get('/extratoDaLojaDia', AdministrativoControllers.getListaExtratoDaLojaDia)
routes.get('/listaDetalheVenda', AdministrativoControllers.getListaVendasDetalheAlterar)
routes.get('/detalheProdutoVoucher', AdministrativoControllers.getDetalheProdutoVoucher)
routes.get('/pagamentoTef', AdministrativoControllers.getRetornoListaPagamentoTEFSelect)
routes.get('/pagamentoPos', AdministrativoControllers.getRetornoListaPagamentoPOSSelect)
// routes.get('/vendaTotalFormaPagamento', AdministrativoControllers.getRetornoListaRecebimentosFormaPagamento)
routes.get('/listaAlteracaoPreco', AdministrativoControllers.getListaAlteracaoPreco)
routes.get('/vendaAtivaCliente', AdministrativoControllers.getListaClientesVendas)
routes.get('/prestacaoContasBalanco', AdministrativoControllers.getListaPrestacaoDeContas)
routes.get('/novoPreviaBalanco', AdministrativoControllers.getListaPreviaBalanco)
routes.get('/vendaCanceladaEmpresa', AdministrativoControllers.getVendaCancelada30Minutos)
routes.get('/vendaCanceladaWeb', AdministrativoControllers.getVendaCanceladaWeb)
routes.get('/vendaCanceladaEmitidaPDV', AdministrativoControllers.getVendaCanceladaEmitidaPDV)
// routes.get('/vendaContigencia', AdministrativoControllers.getListaVendasContigenciaPorEmpresa)
routes.get('/formaPagamentos', AdministrativoControllers.getListaFormaPagamento)
// routes.get('/vendaTotalRecebidoPeriodoADM', AdministrativoControllers.getListaVendaTotalRecebido)
// routes.get('/ultimaPosicaoEstoque', AdministrativoControllers.getListaEstoqueUltimaPosicao)

// routes.get('/pesqBalanco', AdministrativoControllers.getPesqBalanco)
// routes.get('/coletorBalanco', AdministrativoControllers.getListaColetorBalanco)
// routes.get('/detalheBalancoAvulso', AdministrativoControllers.getDetalheBalancoAvulso)
routes.get('/detalheBalancoAvulso', AdmBalancoControllers.getListaDetalheBalancoAvulso)
routes.get('/coletor-balanco', AdmBalancoControllers.getListaColetorBalanco)
routes.get('/balanco-loja', AdmBalancoControllers.getListaBalancoLoja)
routes.get('/detalhe-balanco', AdmBalancoControllers.getListaDetalheBalancoLoja)
routes.get('/preparar-primeiro-balanco-loja', AdmBalancoControllers.getListaPrepararPrimeiroBalancoLoja)
routes.get('/prestacao-contas-balanco', AdmBalancoControllers.getListaPrestacaoContasBalanco)

routes.put('/consolidar-balanco', AdmBalancoControllers.putConsolidarBalanco)
routes.put('/preparar-primeiro-balanco-loja/:id', AdmBalancoControllers.putListaPrepararPrimeiroBalancoLoja)
routes.put('/detalhe-balanco/:id', AdmBalancoControllers.putListaDetalheBalanco)
routes.put('/detalhe-balanco-avulso/:id', AdmBalancoControllers.putListaDetalheBalancoAvulso)
routes.put('/criar-detalhe-balanco-avulso', AdmBalancoControllers.postDetalheBalancoAvulso)

routes.get('/despesasLojaADM', AdministrativoControllers.getListaDespesasLojaADM)

routes.put('/alterarVendaVendedor', AdministrativoControllers.updateAlterarVendaVendedor)

// routes.get('/estoqueAtual', AdministrativoControllers.getEstoqueAtual)
routes.get('/ultimaPosicaoEstoque', EstoqueControllers.getListaEstoqueUltimaPosicao)
routes.get('/inventariomovimento', EstoqueControllers. getListaEstoqueAtual)


// routes.get('/recebimento', AdministrativoControllers.getRetornoListaPagamentoVenda)
routes.get('/lista-venda-cliente', AdmVendasControllers.getListaVendaCliente);
routes.get('/lista-venda/:id', AdmVendasControllers.getListaVendasById)
routes.get('/alterar-venda-pagamento', AdmVendasControllers.getListaAlterarVendasPagamento);
routes.get('/venda-ativa', AdmVendasControllers.getListaVendaAtiva);
routes.get('/venda-vendedor-adm', AdmVendasControllers.getVendaVendedorAction);
routes.get('/venda-total-forma-pagamento', AdmVendasControllers.getRecebimentosFormaPagamento)
routes.get('/venda-total-recebido-periodo-adm', AdmVendasControllers.getListaVendaTotalRecebido)

routes.put('/alterar-venda-pagamento/:id', AdmVendasControllers.putAlterarVendasPagamento);
routes.put('/atualiza-recebimento-venda/:id', AdmVendasControllers.putAlterarVendaRecebimento);
routes.put('/venda-vendedor/:id', AdmVendasControllers.putVendaVendedor);

routes.post('/alterar-venda-pagamento', AdmVendasControllers.postAlterarVendasPagamento);

// Desconto
// routes.get('/vendaConvenio', AdministrativoControllers.getVendaConvenio)
routes.get('/vendaConvenio', AdmDescontoControllers.getListaDescontoMotivoVendas)


//  Recebimentos
routes.get('/recebimento', AdmRecebimentosControllers.getListaPagamentoVenda)
routes.get('/funcionario-recebimento', AdmRecebimentosControllers.getListaFuncionarioRecebimento)


// Forma de Pagamento

routes.get('/forma-pagamentos', AdmPagamentosControllers.getListaFormaPagamento)
routes.get('/pagamento-tef', AdmPagamentosControllers.getListaPagamentoTef)
routes.get('/pagamento-pos', AdmPagamentosControllers.getListaPagamentoPos)
// Fim Administrativo

// Início GERENCIA
routes.get('/clientes', GerenciaControllers.getListaCliente)

routes.get('/alteracaoPreco', GERAlteracaoPrecoControllers.getListaAlteracaoPreco)


// FIM GERENCIA

// Início Quebra Caixa 
routes.get('/quebra-caixa-loja-resumo', QuebraCaixaControllers.getListaQuebraCaixaResumoADM)
routes.get('/quebra-caixa-loja', QuebraCaixaControllers.getListaQuebraCaixa)
routes.get('/quebra-caixa-loja/:id', QuebraCaixaControllers.getQuebraCaixaID)
routes.put('/atualizar-status-quebra', QuebraCaixaControllers.putListaStatusQuebraCaixa)
routes.put('/quebra-caixa-todos/:id', QuebraCaixaControllers.putQuebraCaixa)
routes.post('/quebra-caixa-todos', QuebraCaixaControllers.postQuebraCaixa)

// Início Financeiro

routes.get('/listaExtratoDaLojaPeriodo', FinanceiroControllers.getListaExtratoDaLojaPeriodoFinan)
// routes.get('/listaVendasMarca', FinanceiroControllers.getListaVendasMarca)
routes.get('/resumoVendaFinanceiro', FinanceiroControllers.getListaVendasResumidaFinanceiro)

routes.get('/vendaPagamento', FinanceiroControllers.getListaVendasTransacoesEmpresa)
routes.get('/vendaTotalEmpresa', FinanceiroControllers.getListaVendasEmpresa)
routes.get('/detalheFechamento', FinanceiroControllers.getListaDetalheFechamento)
routes.get('/listaCaixasMovimentoFinanceiro', FinanceiroControllers.getListaCaixasMovmentoFinanceiro)
routes.get('/vendaMarcaPeriodoFinanceiro', FinanceiroControllers.getListaVendasMarcaFinanceiro)
routes.get('/vendaMarcaRob', FinanceiroControllers.getListaVendasMarcaROB)
routes.get('/vendaMarcaMarckup', FinanceiroControllers.getListaVendasMarcaMarckup)
routes.get('/vendaDigitalFinanceiro', FinanceiroControllers.getListaVendasDigital)
routes.get('/vendaPixPeriodo', FinanceiroControllers.getListaVendasPixPeriodo)
routes.get('/vendaPixConsolidadoLoja', FinanceiroControllers.getListaVendasPixConsolidadoLojas)
routes.get('/vendaPixConsolidado', FinanceiroControllers.getListaVendasPixConsolidado)

// routes.get('/faturaPixPeriodoConsolidado', FinanceiroControllers.getListaFaturasPixConsolidado)
routes.get('/faturaPixConsolidadoLoja', FinanceiroControllers.getListaFaturaPixConsolidadoLoja)
// routes.get('/vendaConciliar', FinanceiroControllers.getListaVendasConciliar)
routes.get('/vendaDetalheRecebimentoEletronico', FinanceiroControllers.getListaDetalheRecebimentosEletronico)
// routes.get('/deposito-loja', FinanceiroControllers.getListaConciliarBanco)
routes.get('/depositoLojaConsolidado', FinanceiroControllers.getListaConciliarBancoConsolidado)
// routes.get('/saldoLojaPorGrupo', FinanceiroControllers.getListaSaldoExtratoLoja)
routes.post('/motivoDevolucao', FinanceiroControllers.createMotivoDevolucao)
// routes.get('/detalheFaturaFinanceiro', FinanceiroControllers.getListaDetalheFaturaFinanceiro)

routes.get('/primeira-venda', ExtratosControllers.getPrimeiraVenda)
routes.get('/lista-extrato', ExtratosControllers.getListaExtratoDaLojaPeriodoFinanceiro)
routes.put('/ajuste-extrato', ExtratosControllers.putListaAjusteExtrato)

routes.get('/resumo-voucher', VoucherControllers.getListaResumoVoucherFinanceiro)
// routes.put('/atualizacaoAdiantamentoStatus', FinanceiroControllers.updateAdiantamentoStatus)
routes.put('/atualizarFatura', FinanceiroControllers.updateFaturaFinanceiro)


// Início Vendas 
routes.get('/vendaLojaPeriodo', FinanceiroControllers.getListaVendasLojaPeriodo)
routes.get('/venda-digital-marca', FinanceiroVendasControllers.getListaVendasDigitalMarca)

routes.get('/venda-total-recebido-periodo', FinanceiroVendasControllers.getListaRecebimentos)
routes.get('/venda-recebido-eletronico', FinanceiroVendasControllers.getListaRecebimentosEletronico)
routes.get('/remessa-vendas', FinanceiroVendasControllers.getListaRemessaVendas)
routes.get('/venda-periodo-loja', FinanceiroVendasControllers.getListaVendasLojaPeriodo)
// routes.get('/venda-periodo-lojaID', FinanceiroVendasControllers.getListaVendasLojaById)
routes.get('/venda-pagamentos', FinanceiroVendasControllers.getListaVendasPagamentos)
routes.get('/venda-total', FinanceiroVendasControllers.getListaVendasTotal)
routes.get('/venda-total-empresa', FinanceiroVendasControllers.getListaVendasEmpresa)
routes.get('/venda-digital', FinanceiroVendasControllers.getListaVendasDigital)
routes.get('/venda-pix-periodo', FinanceiroVendasControllers.getListaVendasPixPeriodo)
routes.get('/venda-pix-consolidado', FinanceiroVendasControllers.getListaVendasPixConsolidado)
routes.get('/venda-pix-consolidado-loja', FinanceiroVendasControllers.getListaVendasPixConsolidadoLojas)
routes.get('/venda-conciliacao', FinanceiroVendasControllers.getListaVendasConciliar)
routes.get('/vendas-marca-periodo', FinanceiroVendasControllers.getListaVendasMarca)



routes.put('/venda-pix-status-conferido', FinanceiroVendasControllers.putListaVendaPixStatusConferido)
routes.post('/cadastrarMotivoDevolucao', FinanceiroControllers.createMotivoDevolucao)

//  Saldos
routes.get('/movimento-saldo-bonificacao', SaldosControllers.getListaExtratoBonificacaoById)
routes.get('/saldo-loja-por-grupo', SaldosControllers.getListaSaldoExtratoLoja)
routes.post('/movimento-saldo-bonificacao', SaldosControllers.createMovimentoSaldoBonificacao)

//  Pedidos
routes.get('/pedido-compras', PedidosControllers.getListaPedidosCompras)


// Faturas
routes.get('/fatura-pix-periodo-consolidado', FaturasControllers.getListaFaturasPixConsolidado2)
routes.get('/fatura-pix-periodo', FaturasControllers.getListaFaturasPixPeriodo)
routes.get('/detalhe-faturas', FaturasControllers.getDetalheFaturaFinanceiro)
// routes.get('/faturaPixPeriodo', FaturasControllers.getListaVendaFaturaPixPeriodo)
routes.get('/fatura-pix-empresa', FaturasControllers.getListaVendaFaturaPixPeriodo)
routes.get('/fatura-pix-empresa-compensacao', FaturasControllers.getListaVendaFaturaPixPeriodoCompensacao)

routes.put('/atualizar-status-fatura-pix', FaturasControllers.putListaFaturaVendaPixStatusConferido)
routes.put('/atualizar-recompra', FaturasControllers.putListaAtualizarRecompra) 
routes.put('/fatura-loja-atualizar', FaturasControllers.putListaAtualizarFatura) 


//  Estabelecimento
routes.get('/estabelecimento', EstabelecimentoControllers.getListaEstabelecimentos)


// Devolução
routes.get('/motivo-devolucao', DevolucaoControllers.getListaMotivosDevolucao)
routes.put('/atualizar-motivo-devolucao', DevolucaoControllers.updateMotivoDevolucao)
routes.post('/criar-motivo-devolucao', DevolucaoControllers.createMotivoDevolucao)

// Despesas
routes.get('/despesa-loja', DespesasControllers.getListaDespesasLoja)
routes.put('/editar-despesa', DespesasControllers.putDespesasLoja)
routes.put('/editar-status-despesa/:id', DespesasControllers.putStatusDespesasLoja)

// Desconto
routes.get('/desconto-vendas', DescontoControllers.getListaDescontoVendas)
routes.get('/desconto-vendas-simplificado', DescontoControllers.getListaDescontoVendasSimplificada)
routes.get('/descontoMotivoVendas', DescontoControllers.getListaDescontoMotivoVendas)

//  Adiantamentos 
routes.get('/adiantamento-salarial', AdiantamentosControllers.getListaAdiantamentoSalarialFinanceiro)

// Caixas
routes.get('/lista-caixas-movimento', CaixasControllers.getListaCaixasMovmentoFinanceiro)
routes.get('/lista-caixas-status', CaixasControllers.getListaCaixaStatus)
routes.get('/lista-caixas-zerados', CaixasControllers.getListaCaixaZerados)
routes.put('/fechar-caixas-zerados', CaixasControllers.updateFecharCaixaZerado)


// Depositos
routes.put('/atualizar-deposito-loja', DepositosControllers.updateDepositoLoja)
routes.get('/deposito-loja', DepositosControllers.getListaDepositosLoja)




// Dashboard

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
// routes.get('/extratoLojaPeriodo', DashBoardControllers.getListaExtratoDaLojaPeriodo)
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


// Início Informática GET
routes.get('/marcasLista', InformaticaControllers.getListaMarcas)
routes.get('/listaGrupoEmpresas', InformaticaControllers.getListaGrupoEmpresas)
routes.get('/listaEmpresasControleTransferencia', InformaticaControllers.getListaEmpresas);
routes.get('/listaEmpresasIformatica', InformaticaControllers.getListaEmpresasInformatica);
routes.get('/listaProdutoPreco', InformaticaControllers.getListaProdutoPreco)
routes.get('/lista-caixas', InformaticaControllers.getListaCaixas)
// routes.get('/listaCaixasID', InformaticaControllers.getListaCaixasID)
routes.get('/atualiza-empresa-diario', InformaticaControllers.getListaAtualizaEmpresaDiario)
routes.get('/vendas-loja-informatica', InformaticaControllers.getListaVendasLojaInformatica)
routes.get('/funcionarios-loja', InformaticaControllers.getListaFuncionariosLoja)
routes.get('/atualizarFuncionario', InformaticaControllers.getListaAtualizarFuncionario)
routes.get('/pagamento-tef-informatica', InformaticaControllers.getListaPagamentoTEFInformatica)
routes.get('/pagamento-pos-informatica', InformaticaControllers.getListaPagamentoPOSInformatica)

routes.get('/vendas-alloc', InformaticaControllers.getListaVendasAlloc)
routes.get('/vendas-contigencia', InformaticaControllers.getListaVendasContigenciaIformatica)
routes.get('/lista-cliente', InformaticaControllers.getListaClienteIformatica)
// routes.get('/listaClienteID', InformaticaControllers.getListaCliente)
routes.get('/linkRelatorioBI', InformaticaControllers.getListaLinkRelatorioBI)
routes.get('/relatorioInformaticaBI', InformaticaControllers.getListaRelatorioBI)
routes.get('/lista-cliente-credsystem', InformaticaControllers.getListaCadastroClienteCredSystem)
routes.get('/lista-meio-pagamento-credsystem', InformaticaControllers.getListaMeioPagamentoCredSystem)
routes.get('/lista-parceria-credsystem', InformaticaControllers.getListaParceriaCredSystem)

// POST
routes.post('/createRelatorioInformaticaBI', InformaticaControllers.postRelatorioBI)
routes.post('/criarlinkRelatorioBI', InformaticaControllers.postLinkRelatorioBI)
routes.post('/configuracao-todos', InformaticaControllers.postCaixaLoja)
routes.post('/criar-lista-caixas', InformaticaControllers.postConfiguracao)

// PUT
routes.put('/inativar-funcionario', InformaticaControllers.putInativarFuncionario)
routes.put('/relatorioInformaticaBI/:id', InformaticaControllers.putRelatorioBI)
routes.put('/linkRelatorioBI/:id', InformaticaControllers.putLinkRelatorioBI)
routes.put('/atualiza-empresa-diario/:id', InformaticaControllers.putAtualizaEmpresaDiario)
routes.put('/atualizar-todos-caixa', InformaticaControllers.putAtualizarTodosCaixas)
// routes.put('/atualizaStatusCaixa', InformaticaControllers.updateAtualizaSTCaixasInformatica)
routes.put('/funcionarios-loja/:id', InformaticaControllers.putFuncionarioLoja)
routes.post('/funcionarios-loja', InformaticaControllers.postFuncionarioLoja)
routes.put('/lista-caixas/:id', InformaticaControllers.putCaixaLoja)
routes.put('/funcionarios-desconto/:id', InformaticaControllers.putFuncionarioDesconto)

// routes.put('/configuracao-todos/:id', InformaticaControllers.putCaixaLoja)
// FIM Informática



// Expedição
routes.get('/listaProdutos', ExpedicaoControllers.getListaProdutos)
routes.get('/resumo-ordem-transferencia', ExpedicaoControllers.getListaOrdemTransferencia)
routes.get('/resumoOrdemTransferenciaExpedicao', ExpedicaoControllers.getListaOrdemTransferenciaExpedicao)
routes.get('/detalhe-ordem-transferencia', ExpedicaoControllers.getListaDetalheOT)

routes.get('/statusDivergencia', ExpedicaoControllers.getListaSD)
routes.get('/statusOrdemTransferencia', ExpedicaoControllers.getListaStatusOT)
routes.get('/faturasOT', ExpedicaoControllers.getListaFaturasOT)
routes.get('/rotinaMovimentacao', ExpedicaoControllers.getListaRotinaMovimentacao)
routes.get('/otTransferencia', ExpedicaoControllers.getListaOTDepLoja)
routes.get('/impressao-etiqueta-ot', ExpedicaoControllers.getListaImpressaoEtiquetaOT)
routes.get('/consulta-nfe-saida-tranferencia', ExpedicaoControllers.getListaNFESaidaTransferencia)
routes.put('/updateOrdemTransferencia', ExpedicaoControllers.updateOrdemTransferencia)
routes.put('/updateStatusDivergencia', ExpedicaoControllers.updateAlterarSD)

routes.put('/inserirSD', ExpedicaoControllers.storeInserirSD)

// Vendas
// routes.get('/listaVendas', FinanceiroVendasControllers.getListaVendas)

// routes.get('/listaVendaCliente', Vendas.getListaVendaCliente)
routes.get('/movimentacaoSaldo', VendasControllers.getListaVendasSaldo)
routes.get('/rotatividadeVendas', VendasControllers.getListaRotatividade)
routes.get('/listaDetalheVendaCliente', VendasControllers.getListaDetalheVendaCliente)
routes.get('/venda-xml', VendasControllers.getListaVendaXML)
routes.get('/venda-cliente', VendasControllers.getListaVendaClienteGerencia)

// Vouchers
routes.get('/detalheVoucherDados', ResumoVoucherControllers.getListaDetalheVoucherDados)
routes.get('/detalheNumeroVoucherDados', ResumoVoucherControllers.getDetalheNumeroVoucherDados)
routes.get('/detalhesVouchersId', ResumoVoucherControllers.getDetalheIDVoucherDadosModal)
routes.get('/detalheIDVoucherDados', ResumoVoucherControllers.getDetalheIDVoucherDados)
routes.get('/resumoDetalheVoucher', ResumoVoucherControllers.getResumoDetalheVoucher)
routes.get('/detalhe-voucher', ResumoVoucherControllers.getListaVoucherGerencia)
routes.get('/empresasVoucher', ResumoVoucherControllers.getListaEmpresasVoucher)


routes.post('/auth-funcionario-status', ResumoVoucherControllers.autorizacaoEditarStatusVoucher)
routes.post('/auth-funcionario-create-voucher', ResumoVoucherControllers.postAuthFuncionarioCreateVoucher)
routes.post('/auth-funcionario-print-voucher', ResumoVoucherControllers.postAuthFuncionarioPrintVoucher)
routes.post('/auth-funcionario-update-voucher', ResumoVoucherControllers.postAuthFuncionarioUpdateVoucher)

// Comercial
routes.get('/listaProdutoSap', ComercialControllers.getListaProdutoSap)
routes.get('/listaEmpresaComercial', ComercialControllers.getListaEmpresaComercial)
// routes.get('/listaVendasPorProduto', ComercialControllers.getListaVendasEstruturaProdutos)
routes.get('/vendaMarcaPeriodoFinanceiro', ComercialControllers.getListaVendasMarcaPorPeriodoComercial)
routes.get('/vendasEstoqueGrupoSubGrupo', ComercialControllers.getListaVendasEstoqueGrupoSubGrupoComercial)
routes.get('/produtosPrecosEstoquesLojas', ComercialControllers.getListaProdutosEstoquePrecoLoja)
routes.get('/vendasEstoqueProduto', ComercialControllers.getListaVendasPosicionamentoEstoquePeriodos)
routes.get('/funcionarioRelatorio', ComercialControllers.getListaColaboradorRelatorio)
routes.get('/custoPorLoja', ComercialControllers.getListaVendasCustoLojas)
routes.get('/vendasPosicionamentoEstoque', ComercialControllers.getListaVendasPosicionamentoEstoque)
routes.get('/colaboradorProdutosVendidos', ComercialControllers.getListaColaboradorProdutosVendidos)
routes.get('/listaMetaVendas', ComercialControllers.getListaMetasGrupo)
routes.get('/listaPremiacoes', ComercialControllers.getListaPremiacoesPeriodo)

// routes.get('/listaGrupoProduto', ComercialControllers.getListaGrupoProduto)
// routes.get('/listaSubGrupoProduto', ComercialControllers.getListaSubGrupoProduto)

routes.get('/lista-marca-produto', ComercialProdutoControllers.getListaMarcaProduto)
routes.get('/lista-fornecedor-produto', ComercialProdutoControllers.getListaFornecedorProduto)
routes.get('/grupo-produto', ComercialProdutoControllers.getListaGrupoProduto)
routes.get('/subgrupo-produto', ComercialProdutoControllers.getListaSubGrupoProduto)
routes.get('/vendas-por-produtos', ComercialProdutoControllers.getListaVendasPorProduto)
routes.get('/vendas-vendedor-estrutura', ComercialProdutoControllers.getListaVendasVendedorEstrutura)
routes.get('/produtos-mais-vendidos', ComercialProdutoControllers.getListaProdutosMaisVendidosEstrutura)
routes.get('/vendas-por-estrutura', ComercialProdutoControllers.getListaVendasIndicadoresEstrutura)

// Compras
routes.get('/listaPedidos', ComprasControllers.getListaPedidos)
routes.get('/listaDetalhePedidos', ComprasControllers.getListaDetalhePedidos)
routes.get('/listaTodosPedidos', ComprasControllers.getListaTodosPedidos)
routes.get('/fornecedores', ComprasControllers.getListaFornecedores)
routes.get('/fabricantes', ComprasControllers.getListaFabricantes)
routes.get('/compradores', ComprasControllers.getListaCompradores)
routes.get('/listaPromocoes', ComprasControllers.getListaPromocoes)
routes.get('/listaEmpresaPromocoes', ComprasControllers.getListaEmpresaPromocoes)
routes.get('/listaProdutosOrigemPromocoes', ComprasControllers.getListaProdutoOrigemPromocoes)
routes.get('/listaProdutoDestinoPromocoes', ComprasControllers.getListaProdutoDestinoPromocoes)
routes.get('/fornecedorFabricante', ComprasControllers.getListaFornecedorFabricante)
routes.get('/vincularFabricanteFornecedor', ComprasControllers.getEditFornecedorFabricante)
routes.get('/condicaoPagamento', ComprasControllers.getListaCondicoesPagamento)
routes.get('/transportadoras', ComprasControllers.getListaTransportadora)
routes.get('/listaPedidosDetalhado', ComprasControllers.getListaPedidosDetalhado)
routes.get('/fabricanteFornecedor', ComprasControllers.getListaFabricanteCadastro)
routes.get('/subGrupoEstrutura', ComprasControllers.getListaEstruturaMercadoria)
routes.get('/imagemProdutos', ComprasControllers.getListaImagemProduto)
routes.get('/listaProdutosImagem', ComprasControllers.getListaDetalheImagemProduto)
routes.get('/listaTransportador', ComprasControllers.getListaTransportador)
routes.get('/transportadorID', ComprasControllers.getListaByIdTransportador)
routes.get('/tipoDocumento', ComprasControllers.getListaTPDocumento)
routes.get('/grupoEstrutura', ComprasControllers.getListaGrupoEstrutura)
routes.get('/listaCores', ComprasControllers.getListaCores)
routes.get('/grupoCores', ComprasControllers.getListaGrupoCores)
routes.get('/listaEstilos', ComprasControllers.getListaEstilos)
routes.get('/tipoTecidos', ComprasControllers.getListaTipoTecidos)
routes.get('/categoriaPedidos', ComprasControllers.getListaCategoriaPedidos)
routes.get('/tamanhosPedidos', ComprasControllers.getListaTamanhosPedidos)
routes.get('/vinculoTamanhoCategoria', ComprasControllers.getListaTamanhosCategoriaPedidos)
routes.get('/fornecedorProduto', ComprasControllers.getListaFornecedorProduto)
routes.get('/listaDetalhePedidos', ComprasControllers.getListaDetalhePedidos)
routes.get('/unidadeMedida', ComprasControllers.getListaUnidadeMedida)

routes.get('/localExposicao', ComprasControllers.getListaLocalExposicao)
routes.get('/distribuicaoComprasHistorico', ComprasControllers.getListaDistribuicaoHistorico)
routes.get('/detalheDistribuicaoCompras', ComprasControllers.getListaDetalheDistribuicao)
routes.get('/distribuicaoSugestoesHistorico', ComprasControllers.getListaDistribuicaoSugestoesHistorico)



// UPDATE
routes.put('/atualizarCondicaoPagamento', ComprasControllers.updateCondicaoPagamento)
routes.put('/atualizarTransportador', ComprasControllers.updateCadastroTransportador)
routes.put('/atualizarProdutoImagem', ComprasControllers.updateProdutoImagem)
routes.put('/atualizarSubGrupoEstrutura', ComprasControllers.updateSubGrupoEstrutura)
routes.put('/atualizarUnidadeMedida', ComprasControllers.updateUnidadeMedida)
routes.put('/atualizarCores', ComprasControllers.updateCores)
// routes.put('/atualizarEstilos', ComprasControllers.updateEstilos)
routes.put('/listaEstilos/:id', ComprasControllers.putEstilos)
routes.put('/atualizarTipoTecidos', ComprasControllers.updateTipoTecidos)
routes.put('/atualizarCategoriaPedidos', ComprasControllers.updateCategoriaPedidos)

routes.put('/deletarVinculoTamanhoCategoria', ComprasControllers.updateVinculoTamanhoCategoria)

// POST
routes.post('/cadastrarCondicaoPagamento', ComprasControllers.createCondicaoPagamento)
routes.post('/cadastroSubGrupoEstrutura', ComprasControllers.createSubGrupoEstrutura)
routes.post('/cadastrarUnidadeMedida', ComprasControllers.createUnidadeMedida)
routes.post('/cadastrarCores', ComprasControllers.createCores)
routes.post('/criarlistaEstilos', ComprasControllers.postEstilos)
routes.post('/cadastrarTipoTecidos', ComprasControllers.createTipoTecidos)
routes.post('/cadastrarCategoriaPedidos', ComprasControllers.createCategoriaPedidos)


// Cadastro
routes.get('/listaProdutoCriadoPedidoCompra', CadastroControllers.getListaProdutoCriadoPedidoCompra)
routes.get('/categoriasProdutos', CadastroControllers.getListaCategoriasProduto)
routes.get('/tipoProduto', CadastroControllers.getListaTipoProdutos)
routes.get('/tipoFiscalProduto', CadastroControllers.getListaTipoFiscalProdutos)
routes.get('/consultaProdutos', CadastroControllers. getConsultaProdutos)
routes.get('/nfPedido', CadastroControllers.getListaNFPedido)


routes.get('/produtoAvulso', CadastroControllers.getListaProdutosAvulso)
routes.put('/produtoAvulso/:id', CadastroControllers.getListaTipoFiscalProdutos)
routes.post('/produtoAvulso', CadastroControllers.postDetalheProdutoPedido)

// Movimento Caixa

routes.get('/ajusteFisicoDinheiro', MovimentoCaixaControllers.listaCaixasMovimentojuste)
routes.get('/movimento-caixa-gerencia', MovimentoCaixaControllers.listaCaixasMovimentoGerencia)
routes.get('/fechamento-caixa', MovimentoCaixaControllers.getListaFechamentoCaixa)
routes.get('/ajusteMovimento', MovimentoCaixaControllers.listaAjusteMovimentoCaixa)
routes.put('/atualizacao-status', MovimentoCaixaControllers.putListaAtualizacaoStatus)

routes.put('/ajuste-recebimento', MovimentoCaixaControllers.putListaAjusteRecebimento)

// Produtos 
routes.get('/produtoQuality', ProdutoControllers.getListaProdutosLojaQuality)
routes.get('/produtoSap', ProdutoControllers.getListaProdutosLojaSap)
routes.get('/produto-preco', ProdutoControllers.getListaProdutosPrecoInformatica)
routes.get('/grupoProdutoSap', ProdutoControllers.getListaGrupoProdutoSap)
routes.get('/produtoInformatica', ProdutoControllers.getListaProdutosInformaticaQuality)
routes.get('/listaProdutos', ProdutoControllers.getListaProdutos)
routes.get('/listaGrade', ProdutoControllers.getListaGrade)
routes.get('/listasDePrecosSAP', ProdutoControllers.ListaProdutosEtiqueta)
routes.get('/responsaveisAlteracaoPrecos', ProdutoControllers.getListaResponsavelAlteracaoPreco)
routes.get('/listaProdutosEtiquetaSAP', ProdutoControllers.ListaProdutosEtiquetagem)

//  Depositos Loja
routes.get('/depositosLoja', DepositosLojaControllers.getListaDepositosLojaEmpresa)
routes.get('/deposito-loja-empresa', DepositosLojaControllers.getListaDepositosLojaEmpresa)

// routes.post('/cadastrar-deposito-loja', DepositosLojaControllers.cadastroDepositoLoja)
routes.post('/cadastrar-deposito-loja', DepositosLojaControllers.postListaDepositosLoja)
routes.put('/atualizar-deposito-loja', DepositosLojaControllers.putListaDepositosLoja)

// Conta Banco
routes.get('/contaBanco', ContaBancoControllers.getListaContaBanco)

// Despesas Loja
routes.get('/despesas-loja-empresa', DespesasLojaControllers.getListaDespesasLojaEmpresa)
routes.get('/despesa-Loja-todos', DespesasLojaControllers.getListaTodasDespesasLojas)
routes.get('/despesa-lojas-dash', DespesasLojaControllers.getListaDespesasLojaDashBoard)
// routes.get('/despesasEmpresas', DespesasLojaControllers.getListaDespesasEmpresaGerencia)

routes.post('/cadastrar-despesa-loja', DespesasLojaControllers.postCadastrarDespesasLoja)

//  Categoria Despesas
routes.get('/categoria-receita-despesa', CategoriaReceitaDespesasControllers.getListaCategoriaDespesas)
routes.get('/categoriaReceitaDespesaFinanceira', CategoriaReceitaDespesasControllers.getListaCategoriaDespesasFinanceira)


// Detalhes 
routes.get('/detalheFaturaGerencia', DetalheFaturasControllers.getDetalheFatura)

routes.get('/detalhe-Fatura-id', DetalheFaturasControllers.getDetalheFaturaById)
routes.put('/atualizar-fatura', DetalheFaturasControllers.updateFatura) 

// routes.put('/atualizar-detalhe-fatura-loja', FaturasControllers.putListaDetalheFaturaLoja) 
routes.post('/criar-detalhe-fatura', DetalheFaturasControllers.postDetalheFaturaLoja) 


// Marketing
routes.get('/produto-promocao', MarketingControllers.getListaProdutosPromocao)
routes.get('/listaPromocao', MarketingControllers.getListaPromocao)
routes.get('/campanha', MarketingControllers.getListaCampanha)
routes.get('/campanha-cliente', MarketingControllers.getListaCampanhaCliente)


routes.put('/campanha/:id', MarketingControllers.putCampanhaEmpresa)
routes.put('/campanha-cliente/:id', MarketingControllers.putCampanhaCliente)
routes.put('/produto-promocao/:id', MarketingControllers.putProdutoPromocao)

routes.post('/cadastrar-campanha-cliente', MarketingControllers.postCampanhaCliente)
routes.post('/cadastra-campanha', MarketingControllers.postCampanhaEmpresa)
routes.post('/cadastrar-produto-promocao', MarketingControllers.postProdutoPromocao)

// Contabilidade
routes.get('/listaVendasContigencia', ContabilidadeControllers.getListaVendasContigencia)
routes.get('/vendasDetalheContigencia', ContabilidadeControllers.getListaDetalheVendasContigencia)
routes.get('/vendasPagamentoContigencia', ContabilidadeControllers.getListaPagamentoVendasContigencia)
routes.get('/vendasEstoqueComercial', ContabilidadeControllers.getListaVendasEstoqueComercial)
routes.get('/vendasProdutos', ContabilidadeControllers.getListaVendasPeriodo)
routes.get('/vendasProdutosConsolidado', ContabilidadeControllers.getListaVendasPeriodoConsolidado)

// Configuração Pix PDV
routes.get('/configuracao-pix-pdv', ConfiguracaoPixPDVControllers.getListaConfiguracaoPixPDV)
// routes.put('/configuracao-pix-pdv', ConfiguracaoPixPDVControllers.updateConfiguracaoPixPDV)
routes.put('/atualizarConfiguracaoPixPDV', ConfiguracaoPixPDVControllers.updateConfiguracaoPixPDV)


// Conferencia Cega
routes.get('/listaOrdemTransferenciaConferenciaCega', ConferenciaCegaControllers.getListaOrdemTransferenciaConferenciaCega)
routes.get('/detalhe-ordem-transferencia-cega', ConferenciaCegaControllers.getDetalheOrdemTransferenciaConferenciaCega)
routes.get('/status-divergencia', ConferenciaCegaControllers.getListaStatusOTConfrecencia)
routes.put('/resumo-ordem-transferencia-cega/:id', ConferenciaCegaControllers.putResumoOrdemTransferencia)
routes.put('/status-divergencia/:id', ConferenciaCegaControllers.putStatusDivergencia)
routes.post('/inserir-status-divergencia', ConferenciaCegaControllers.postStatusDivergencia)

// Lista de Preço
// routes.get('/listaPreco', ListaPrecoControllers.getListaPrecoPorMarca)

// // Logs
// routes.get('/log-web', LogsControllers.getListaLogsUsuario)
routes.post('/log-web', LogsControllers.createLogsUsuario)


 
export default routes;

    