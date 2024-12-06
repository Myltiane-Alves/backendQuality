import { Router } from 'express';
import ResumoVoucherControllers from '../controllers/index.js';


const routes = new Router();


routes.get('/detalheVoucherDados', ResumoVoucherControllers.getListaDetalheVoucherDados)
routes.get('/detalheNumeroVoucherDados', ResumoVoucherControllers.getDetalheNumeroVoucherDados)
routes.get('/detalhesVouchersId', ResumoVoucherControllers.getDetalheIDVoucherDadosModal)
routes.get('/detalheIDVoucherDados', ResumoVoucherControllers.getDetalheIDVoucherDados)
routes.get('/resumoDetalheVoucher', ResumoVoucherControllers.getResumoDetalheVoucher)
routes.get('/detalhe-voucher', ResumoVoucherControllers.getListaVoucherGerencia)
routes.get('/empresasVoucher', ResumoVoucherControllers.getListaEmpresasVoucher)


routes.post('/auth-funcionario-status', ResumoVoucherControllers.autorizacaoEditarStatusVoucher)
routes.post('/auth-funcionario-create-voucher', ResumoVoucherControllers.postAuthFuncionarioCreateVoucher)
routes.post('/auth-funcionario-print-voucher', ResumoVoucherControllers.postAuthFuncionarioPrintVoucher)
routes.post('/auth-funcionario-update-voucher', ResumoVoucherControllers.postAuthFuncionarioUpdateVoucher)


export default routes;