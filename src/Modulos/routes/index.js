import { Router } from 'express';
import ModulosControllers from '../controllers/modulos.js';


const routes = new Router();

routes.get('/modulos', ModulosControllers.getListaModulos)
routes.put('/modulos/:id', ModulosControllers.putModulo)
routes.post('/criar-modulos', ModulosControllers.postModulo)
routes.get('/menus-usuario', ModulosControllers.getListaMenusUsuario)
routes.get('/menus', ModulosControllers.getListaSubMenusUsuario)

export default routes;