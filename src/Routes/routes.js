import { Router } from 'express';
import administrativoRoutes from '../Administrativo/routes/administrativoRoutes.js';
import admBalancoRoutes from '../Administrativo/Balanco/routes/index.js';
import admEstoqueRoutes from '../Administrativo/Estoque/routes/index.js';
import admPagamentosRoutes from '../Administrativo/Pagamentos/routes/index.js';
import admRecebimentosRoutes from '../Administrativo/Recebimentos/routes/index.js';
import admVendasRoutes from '../Administrativo/Vendas/routes/index.js';
import authRoutes from '../Auth/routes/auth.js';
import cadastroRoutes from '../Cadastro/routes/cadastro.js';
import categoriaRoutes from '../CategoriaReceita/routes/index.js';
import comercialRoutes from '../Comercial/routes/comercialRoutes.js';
import comercialProdutoRoutes from '../Comercial/Produto/routes/index.js';

const routes = Router();
// Adiministrativo
    routes.use(administrativoRoutes);
    routes.use(admBalancoRoutes);
    routes.use(admEstoqueRoutes);
    routes.use(admPagamentosRoutes);
    routes.use(admRecebimentosRoutes);
    routes.use(admVendasRoutes);
    
    routes.use(authRoutes);

    routes.use(cadastroRoutes);

    routes.use(categoriaRoutes);

    routes.use(comercialRoutes);
    routes.use(comercialProdutoRoutes);
export default routes;