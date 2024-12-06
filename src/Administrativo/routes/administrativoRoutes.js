import { Router } from 'express';
import AdministrativoControllers from '../controllers/Administrativo.js';
const administrativoRoutes = new Router();


// administrativoRoutes.get('/listaCaixasMovimento', AdministrativoControllers.getListaCaixasMovimento);
//Início Administrativo
administrativoRoutes.get('/listaCaixasMovimento', AdministrativoControllers.retornoListaCaixasMovimento);

administrativoRoutes.get('/listaCaixasFechados', AdministrativoControllers.retornoListaCaixasFechados);
administrativoRoutes.get('/vendaVendedor', AdministrativoControllers.getVendaVendedor);
administrativoRoutes.get('/vendaAtivaAction', AdministrativoControllers.getVendaAtivaAction);
administrativoRoutes.get('/vendaAtivaResumo', AdministrativoControllers.getVendaAtivaResumo)
administrativoRoutes.get('/vendaCancelada', AdministrativoControllers.getVendaCancelada);
administrativoRoutes.get('/vendaCanceladaResumo', AdministrativoControllers.getVendaCanceladaResumo);
administrativoRoutes.get('/resumoVenda', AdministrativoControllers.getResumoVenda);
administrativoRoutes.get('/detalheFatura', AdministrativoControllers.getDetalheFatura);
administrativoRoutes.get('/detalheDespesas', AdministrativoControllers.getDetalheDespesas);
administrativoRoutes.get('/resumoVendaConvenio', AdministrativoControllers.getResumoVendaConvenio)
administrativoRoutes.get('/resumoVendaConveniodesconto', AdministrativoControllers.getResumoVendaConvenioDesconto)
administrativoRoutes.get('/detalheVoucher', AdministrativoControllers.getDetalheVoucher)
administrativoRoutes.get('/detalhe-voucher-dados-adm', AdministrativoControllers.getListaDetalheVoucherDados)
administrativoRoutes.get('/extratoDaLojaDia', AdministrativoControllers.getListaExtratoDaLojaDia)
administrativoRoutes.get('/listaDetalheVenda', AdministrativoControllers.getListaVendasDetalheAlterar)
administrativoRoutes.get('/detalheProdutoVoucher', AdministrativoControllers.getDetalheProdutoVoucher)
administrativoRoutes.get('/pagamentoTef', AdministrativoControllers.getRetornoListaPagamentoTEFSelect)
administrativoRoutes.get('/pagamentoPos', AdministrativoControllers.getRetornoListaPagamentoPOSSelect)
// administrativoRoutes.get('/vendaTotalFormaPagamento', AdministrativoControllers.getRetornoListaRecebimentosFormaPagamento)
administrativoRoutes.get('/listaAlteracaoPreco', AdministrativoControllers.getListaAlteracaoPreco)
administrativoRoutes.get('/vendaAtivaCliente', AdministrativoControllers.getListaClientesVendas)
administrativoRoutes.get('/prestacaoContasBalanco', AdministrativoControllers.getListaPrestacaoDeContas)
administrativoRoutes.get('/novoPreviaBalanco', AdministrativoControllers.getListaPreviaBalanco)
administrativoRoutes.get('/vendaCanceladaEmpresa', AdministrativoControllers.getVendaCancelada30Minutos)
administrativoRoutes.get('/vendaCanceladaWeb', AdministrativoControllers.getVendaCanceladaWeb)
administrativoRoutes.get('/vendaCanceladaEmitidaPDV', AdministrativoControllers.getVendaCanceladaEmitidaPDV)
// administrativoRoutes.get('/vendaContigencia', AdministrativoControllers.getListaVendasContigenciaPorEmpresa)
administrativoRoutes.get('/formaPagamentos', AdministrativoControllers.getListaFormaPagamento)
// administrativoRoutes.get('/vendaTotalRecebidoPeriodoADM', AdministrativoControllers.getListaVendaTotalRecebido)
// administrativoRoutes.get('/ultimaPosicaoEstoque', AdministrativoControllers.getListaEstoqueUltimaPosicao)

// administrativoRoutes.get('/pesqBalanco', AdministrativoControllers.getPesqBalanco)
// administrativoRoutes.get('/coletorBalanco', AdministrativoControllers.getListaColetorBalanco)
// administrativoRoutes.get('/detalheBalancoAvulso', AdministrativoControllers.getDetalheBalancoAvulso)

export default administrativoRoutes;