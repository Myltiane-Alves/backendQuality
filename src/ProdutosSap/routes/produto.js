import { Router } from 'express';
import ProdutoControllers from '../controllers/Produtos.js';


const routes = new Router();


routes.get('/produtoQuality', ProdutoControllers.getListaProdutosLojaQuality)
routes.get('/produtoSap', ProdutoControllers.getListaProdutosLojaSap)
routes.get('/produto-preco', ProdutoControllers.getListaProdutosPrecoInformatica)
routes.get('/grupoProdutoSap', ProdutoControllers.getListaGrupoProdutoSap)
routes.get('/produtoInformatica', ProdutoControllers.getListaProdutosInformaticaQuality)
routes.get('/listaProdutos', ProdutoControllers.getListaProdutos)
routes.get('/listaGrade', ProdutoControllers.getListaGrade)
routes.get('/listasDePrecosSAP', ProdutoControllers.ListaProdutosEtiqueta)
routes.get('/responsaveisAlteracaoPrecos', ProdutoControllers.getListaResponsavelAlteracaoPreco)
routes.get('/listaProdutosEtiquetaSAP', ProdutoControllers.ListaProdutosEtiquetagem)

export default routes;