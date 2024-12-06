import { Router } from 'express';
import DashBoardAdiantamentoSalarialControllers from '../controllers/index.js';

const routes = new Router();

routes.get('/funcionarios', DashBoardFuncionariosControllers.getListaFuncionarios)

routes.get('/adiantamento-loja', DashBoardAdiantamentoSalarialControllers.getListaAdiantamentoSalarialLoja)
routes.get('/adiantamento-funcionarios', DashBoardAdiantamentoSalarialControllers.getListaAdiantamentosFuncionarios)

routes.put('/atualizacao-adiantamento-status', DashBoardAdiantamentoSalarialControllers.updateAdiantamentoStatus)

routes.get('/adiantamentos-salarial', DashBoardAdiantamentoSalarialControllers.getListaAdiantamentosSalarialDashBoard)
routes.put('/adiantamento-salarial/:id', DashBoardAdiantamentoSalarialControllers .putAdiantamentoSalarial)
routes.post('/adiantamento-salarial', DashBoardAdiantamentoSalarialControllers .postAdiantamentoSalarial)

export default routes;