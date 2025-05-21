import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import express from 'express';
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import EmpresaControllers from './Empresas/controllers/Empresas.js';

const app = express();
const routes = new Router();
const PORT = 3000;

// Definindo __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho do arquivo JSON gerado pelo swaggerAutogen
const swaggerFile = join(__dirname, 'swagger-output.json');

app.use(bodyParser.json());

// Servir o arquivo JSON gerado pelo swaggerAutogen
app.use('/swagger-output.json', express.static(swaggerFile));

// Configurar o Swagger UI para usar o arquivo JSON gerado
app.use('/api', routes);

// Configurar o Swagger UI para usar o arquivo JSON gerado
app.use('/doc', swaggerUi.serve, swaggerUi.setup(null, { swaggerOptions: { url: "/swagger-output.json" } }));

app.listen(PORT, () => {
    console.log(`Server is running!\nAPI documentation: http://localhost:${PORT}/doc`);
});


/**
 * @swagger
 * /api/empresas:
 *   get:
 *     summary: Retorna a lista de empresas
 *     description: Obtém todas as empresas cadastradas no sistema.
 *     responses:
 *       200:
 *         description: Lista de empresas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresas'
 */
routes.get("/empresas", EmpresaControllers.getAllEmpresas);

/**
 * @swagger
 * /api/empresas/{idEmpresa}:
 *   get:
 *     summary: Busca uma empresa pelo ID
 *     description: Retorna os detalhes de uma empresa com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: idEmpresa
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da empresa a ser buscada
 *     responses:
 *       200:
 *         description: Empresa encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresas'
 *       404:
 *         description: Empresa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

routes.get("/api/empresas/:idEmpresa", EmpresaControllers.getAllEmpresas);
export default app;