import { Router } from 'express';
const routes = new Router();

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

routes.get("/empresas/:idEmpresa", EmpresaControllers.getAllEmpresas);