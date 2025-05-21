// filepath: c:\quality\react_node\producao\api\testPerformance.js
import  ResumoVoucherControllers from './ResumoVoucher/controllers/index.js';

const runPerformanceTest = async () => {
    console.time('Performance Test');
    try {
        const result = await ResumoVoucherControllers.getListaDetalheVoucherDados(); // Passe os parâmetros necessários
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
    console.timeEnd('Performance Test');
};

runPerformanceTest();