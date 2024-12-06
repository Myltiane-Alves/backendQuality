import { Router } from 'express';
import ConfiguracaoPixPDVControllers from '../controllers/ConfiguracaoPixPDV.js';

const routes = new Router();

routes.get('/configuracao-pix-pdv', ConfiguracaoPixPDVControllers.getListaConfiguracaoPixPDV)
// routes.put('/configuracao-pix-pdv', ConfiguracaoPixPDVControllers.updateConfiguracaoPixPDV)
routes.put('/atualizarConfiguracaoPixPDV', ConfiguracaoPixPDVControllers.updateConfiguracaoPixPDV)

export default routes;