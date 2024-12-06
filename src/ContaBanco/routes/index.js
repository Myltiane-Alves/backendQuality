import { Router } from 'express';
import ContaBancoControllers from '../controllers/ContaBanco.js';


const routes = new Router();


routes.get('/contaBanco', ContaBancoControllers.getListaContaBanco)

export default routes;