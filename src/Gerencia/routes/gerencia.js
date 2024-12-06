import { Router } from 'express';
import GerenciaControllers from '../controllers/index.js';


const routes = new Router();


routes.get('/clientes', GerenciaControllers.getListaCliente)
routes.post('/clientes', GerenciaControllers.postCliente)
routes.put('/clientes/:id', GerenciaControllers.putCliente)

// routes.get('/ajusteFisicoDinheiro', MovimentoCaixaControllers.listaCaixasMovimentojuste)
// routes.get('/movimento-caixa-gerencia', MovimentoCaixaControllers.listaCaixasMovimentoGerencia)
// routes.get('/fechamento-caixa', MovimentoCaixaControllers.getListaFechamentoCaixa)
// routes.get('/ajusteMovimento', MovimentoCaixaControllers.listaAjusteMovimentoCaixa)
// routes.put('/atualizacao-status', MovimentoCaixaControllers.putListaAtualizacaoStatus)

// routes.put('/ajuste-recebimento', MovimentoCaixaControllers.putListaAjusteRecebimento)

export default routes;