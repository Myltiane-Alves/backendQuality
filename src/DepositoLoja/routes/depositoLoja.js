import { Router } from 'express';
import DepositosLojaControllers from '../controllers/DepositosLoja.js';

const routes = new Router();

routes.get('/depositosLoja', DepositosLojaControllers.getListaDepositosLojaEmpresa)
routes.get('/deposito-loja-empresa', DepositosLojaControllers.getListaDepositosLojaEmpresa)

// routes.post('/cadastrar-deposito-loja', DepositosLojaControllers.cadastroDepositoLoja)
routes.post('/cadastrar-deposito-loja', DepositosLojaControllers.postListaDepositosLoja)
routes.put('/atualizar-deposito-loja', DepositosLojaControllers.putListaDepositosLoja)

export default routes;