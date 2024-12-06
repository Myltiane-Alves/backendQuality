import { Router } from 'express';
import AdmBalancoControllers from '../controllers/balanco.js';


const admBalancoRoutes = new Router();


admBalancoRoutes.get('/detalheBalancoAvulso', AdmBalancoControllers.getListaDetalheBalancoAvulso)
admBalancoRoutes.get('/coletor-balanco', AdmBalancoControllers.getListaColetorBalanco)
admBalancoRoutes.get('/balanco-loja', AdmBalancoControllers.getListaBalancoLoja)
admBalancoRoutes.get('/detalhe-balanco', AdmBalancoControllers.getListaDetalheBalancoLoja)
admBalancoRoutes.get('/preparar-primeiro-balanco-loja', AdmBalancoControllers.getListaPrepararPrimeiroBalancoLoja)
admBalancoRoutes.get('/prestacao-contas-balanco', AdmBalancoControllers.getListaPrestacaoContasBalanco)

admBalancoRoutes.put('/consolidar-balanco', AdmBalancoControllers.putConsolidarBalanco)
admBalancoRoutes.put('/preparar-primeiro-balanco-loja/:id', AdmBalancoControllers.putListaPrepararPrimeiroBalancoLoja)
admBalancoRoutes.put('/detalhe-balanco/:id', AdmBalancoControllers.putListaDetalheBalanco)
admBalancoRoutes.put('/detalhe-balanco-avulso/:id', AdmBalancoControllers.putListaDetalheBalancoAvulso)
admBalancoRoutes.put('/criar-detalhe-balanco-avulso', AdmBalancoControllers.postDetalheBalancoAvulso)

export default admBalancoRoutes;