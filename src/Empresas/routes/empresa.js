import { Router } from 'express';
import EmpresaControllers from '../controllers/Empresas.js';


const routes = new Router();


routes.get('/empresas', EmpresaControllers.getAllEmpresas);
routes.get('/grupoEmpresarial', EmpresaControllers.getAllGrupoEmpresarial);
routes.get('/subGrupoEmpresarial', EmpresaControllers.getSelectLojaVouchers);
routes.get('/listaEmpresas', EmpresaControllers.getListaEmpresas)
routes.put('/empresas', EmpresaControllers.putListaEmpresas)

export default routes;