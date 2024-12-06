import { Router } from 'express';
import DespesasLojaControllers from '../controllers/DespesasLoja.js';


const routes = new Router();


routes.get('/despesas-loja-empresa', DespesasLojaControllers.getListaDespesasLojaEmpresa)
routes.get('/despesa-Loja-todos', DespesasLojaControllers.getListaTodasDespesasLojas)
routes.get('/despesa-lojas-dash', DespesasLojaControllers.getListaDespesasLojaDashBoard)
// routes.get('/despesasEmpresas', DespesasLojaControllers.getListaDespesasEmpresaGerencia)

routes.post('/cadastrar-despesa-loja', DespesasLojaControllers.postCadastrarDespesasLoja)

export default routes;