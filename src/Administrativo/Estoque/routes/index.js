import { Router } from 'express';
import EstoqueControllers from '../controllers/estoque.js'


const admEstoqueRoutes = new Router();

admEstoqueRoutes.get('/ultimaPosicaoEstoque', EstoqueControllers.getListaEstoqueUltimaPosicao)
admEstoqueRoutes.get('/inventariomovimento', EstoqueControllers. getListaEstoqueAtual)

export default admEstoqueRoutes;