import { Router } from 'express';
import AdmPagamentosControllers from '../controllers/pagamentos.js'


const admPagamentosRoutes = new Router();

admPagamentosRoutes.get('/forma-pagamentos', AdmPagamentosControllers.getListaFormaPagamento)
admPagamentosRoutes.get('/pagamento-tef', AdmPagamentosControllers.getListaPagamentoTef)
admPagamentosRoutes.get('/pagamento-pos', AdmPagamentosControllers.getListaPagamentoPos)

export default admPagamentosRoutes;