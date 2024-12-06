import { Router } from 'express';
import DetalheFaturasControllers from '../controllers/Detalhes.js';


const routes = new Router();

routes.get('/detalheFaturaGerencia', DetalheFaturasControllers.getDetalheFatura)

routes.get('/detalhe-Fatura-id', DetalheFaturasControllers.getDetalheFaturaById)
routes.put('/atualizar-fatura', DetalheFaturasControllers.updateFatura) 

// routes.put('/atualizar-detalhe-fatura-loja', FaturasControllers.putListaDetalheFaturaLoja) 
routes.post('/criar-detalhe-fatura', DetalheFaturasControllers.postDetalheFaturaLoja) 

export default routes;