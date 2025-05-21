import { Router } from 'express';
import CadastroControllers from '../controllers/Cadastro.js';


const cadastroRoutes = new Router();


cadastroRoutes.get('/cadastrar-produto-Pedido', CadastroControllers.getListaProdutoCriadoPedidoCompra)
cadastroRoutes.get('/categoriasProdutos', CadastroControllers.getListaCategoriasProduto)
cadastroRoutes.get('/cadastrarProdutoAvulso', CadastroControllers.getListaProdutosAvulso)
cadastroRoutes.get('/tipoProduto', CadastroControllers.getListaTipoProdutos)
cadastroRoutes.get('/tipoFiscalProduto', CadastroControllers.getListaTipoFiscalProdutos)


cadastroRoutes.get('/produtoAvulso', CadastroControllers.getListaProdutosAvulso)
cadastroRoutes.put('/produtoAvulso/:id', CadastroControllers.getListaTipoFiscalProdutos)
cadastroRoutes.post('/produtoAvulso', CadastroControllers.postDetalheProdutoPedido)

export default cadastroRoutes;