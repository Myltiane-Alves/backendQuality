import { Router } from 'express';
import QuebraCaixaControllers from '../controllers/quebraCaixaLoja.js'


const routes = new Router();

routes.get('/quebra-caixa-loja-resumo', QuebraCaixaControllers.getListaQuebraCaixaResumoADM)
routes.get('/quebra-caixa-loja', QuebraCaixaControllers.getListaQuebraCaixa)
routes.get('/quebra-caixa-loja/:id', QuebraCaixaControllers.getQuebraCaixaID)
routes.put('/atualizar-status-quebra', QuebraCaixaControllers.putListaStatusQuebraCaixa)
routes.put('/quebra-caixa-todos/:id', QuebraCaixaControllers.putQuebraCaixa)
routes.post('/quebra-caixa-todos', QuebraCaixaControllers.postQuebraCaixa)

export default routes;