import { Router } from 'express';
import MarketingControllers from '../controllers/Marketing.js';


const routes = new Router();

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

export default routes;