import { Router } from 'express';
import FuncionariosControllers from '../controllers/index.js';


const routes = new Router();


routes.get('/autorizarVoucher', FuncionariosControllers.getAutorizacaoVoucherFuncionarios)
// routes.get('/listaFuncionariosEmpresa', FuncionariosControllers.getListaFuncionariosEmpresa)
routes.get('/funcionarioAtivoPorEmpresa', FuncionariosControllers. getListaFuncionariosAtivos)
routes.get('/todos-funcionario', FuncionariosControllers.getListaTodosFuncionarios)

export default routes;