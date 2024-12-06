import { Router } from 'express';
import CategoriaReceitaDespesasControllers from '../controllers/CategoriaReceitaDespesa.js';


const categoriaRoutes = new Router();


categoriaRoutes.get('/categoria-receita-despesa', CategoriaReceitaDespesasControllers.getListaCategoriaDespesas)
categoriaRoutes.get('/categoriaReceitaDespesaFinanceira', CategoriaReceitaDespesasControllers.getListaCategoriaDespesasFinanceira)


export default categoriaRoutes;