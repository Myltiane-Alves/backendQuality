import { Router } from 'express';
import AdmVendasControllers from '../controllers/admVendas.js';


const admVendasRoutes = new Router();

admVendasRoutes.get('/lista-venda-cliente', AdmVendasControllers.getListaVendaCliente);
admVendasRoutes.get('/lista-venda/:id', AdmVendasControllers.getListaVendasById)
admVendasRoutes.get('/alterar-venda-pagamento', AdmVendasControllers.getListaAlterarVendasPagamento);
admVendasRoutes.get('/venda-ativa', AdmVendasControllers.getListaVendaAtiva);
admVendasRoutes.get('/venda-vendedor-adm', AdmVendasControllers.getVendaVendedorAction);
admVendasRoutes.get('/venda-total-forma-pagamento', AdmVendasControllers.getRecebimentosFormaPagamento)
admVendasRoutes.get('/venda-total-recebido-periodo-adm', AdmVendasControllers.getListaVendaTotalRecebido)

admVendasRoutes.put('/alterar-venda-pagamento/:id', AdmVendasControllers.putAlterarVendasPagamento);
admVendasRoutes.put('/atualiza-recebimento-venda/:id', AdmVendasControllers.putAlterarVendaRecebimento);
admVendasRoutes.put('/venda-vendedor/:id', AdmVendasControllers.putVendaVendedor);

admVendasRoutes.post('/alterar-venda-pagamento', AdmVendasControllers.postAlterarVendasPagamento);

export default admVendasRoutes;