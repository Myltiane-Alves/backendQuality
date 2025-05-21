import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getVendasProduto } from "../Vendas/repositories/vendaProduto.js";
import { getVendasContigencia } from "../Vendas/repositories/vendaContigencia.js";
import { getVendasDetalhe } from "../Vendas/repositories/vendaDetalhe.js";
import { getVendasPagamento } from "../Vendas/repositories/vendaPagamento.js";
import { getBuscarProduto } from "../Produtos/buscarProdutos.js";
import { getVendasProdutoConsolidado } from "../Vendas/repositories/vendaProdutoConsolidado.js";
import { getVendasEstoqueProduto } from "../Vendas/repositories/vendaEstoqueProduto.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class ContabilidadeControllers {
  async getListaVendasContigencia(req, res) {
    let { idMarca, idEmpresa, idVenda, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
    idMarca = idMarca ? idMarca : '';
    idEmpresa = idEmpresa ? idEmpresa : '';
    idVenda = idVenda ? idVenda : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      // const apiUrl = `${url}/api/contabilidade/lista-venda-contingencia.xsjs?idGrupoEmpresarial=${idGrupo}&idEmpresa=${idEmpresa}&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}`
      // const response = await axios.get(apiUrl)
      const response = await getVendasContigencia(idMarca,idEmpresa, idVenda, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
        
  }

  async getListaDetalheVendasContigencia(req, res) {
    let { idVenda, idVendaDetalhe,  page, pageSize  } = req.query;

    idVenda = idVenda ? idVenda : '';
    idVendaDetalhe = idVendaDetalhe ? idVendaDetalhe : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      // const apiUrl = `${url}/api/contabilidade/venda-detalhe.xsjs?idVenda=${idVenda}`
      // const response = await axios.get(apiUrl)
      const response = await getVendasDetalhe(idVenda, idVendaDetalhe,  page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
        
  }

  async getListaPagamentoVendasContigencia(req, res) {
    let { idVenda,  page, pageSize  } = req.query;

    idVenda = idVenda ? idVenda : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      // const apiUrl = `${url}/api/contabilidade/venda-pagamento.xsjs?idVenda=${idVenda}`
      // const response = await axios.get(apiUrl)
      const response = await getVendasPagamento(idVenda,  page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
        
  }
  
  async getListaVendasEstoqueComercial(req, res) {
    let { idMarca, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize  } = req.query;
      idMarca = idMarca ? idMarca : '';
      idFornecedor = idFornecedor ? idFornecedor : '';
      descProduto = descProduto ? descProduto : '';
      idGrupoGrade = idGrupoGrade ? idGrupoGrade : '';
      idGrade = idGrade ? idGrade : '';    
      dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
      dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
      page = page ? page : '';
      pageSize = pageSize ? pageSize : '';

    try {        
    // ajaxGet('api/contabilidade/venda-estoque-produto.xsjs?page='+numPage+'&dataInicio=' + datapesqinicio + '&dataFim=' + datapesqfim + '&idGrupoEmpresarial=' + IDMarcaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade)

      // const apiUrl = `${url}/api/contabilidade/venda-estoque-produto.xsjs?dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idGrupoEmpresarial=${idMarca}&descricaoProduto=${descProduto}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupoGrade}&idGrade=${idGrade}`
      // const response = await axios.get(apiUrl)
      const response = await getVendasEstoqueProduto(idMarca, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("erro no controller ContabilidadeControllers.getListaVendasEstoqueComercial:", error);
      throw error;
    }
        
  }

  async getListaVendasPeriodo(req, res) {
    let { idMarca, idEmpresa, uf, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize  } = req.query;

      idMarca = idMarca ? idMarca : '';
      idEmpresa = idEmpresa ? idEmpresa : '';
      uf = uf ? uf : '';
      idFornecedor = idFornecedor ? idFornecedor : '';
      descProduto = descProduto ? descProduto : '';
      idGrupoGrade = idGrupoGrade ? idGrupoGrade : '';
      idGrade = idGrade ? idGrade : '';
      dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
      dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
      page = page ? page : '';
      pageSize = pageSize ? pageSize : '';

    try {        
      const response = await getVendasProduto(idMarca,idEmpresa, uf, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("erro no controller ContabilidadeControllers.getListaVendasPeriodo:", error);
      throw error;
    }
        
  }

  async getListaVendasPeriodoConsolidado(req, res) {
    let { idMarca, idEmpresa, uf, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize  } = req.query;
      
      idMarca = idMarca ? idMarca : '';
      idEmpresa = idEmpresa ? idEmpresa : '';
      uf = uf ? uf : '';
      idFornecedor = idFornecedor ? idFornecedor : '';
      descProduto = descProduto ? descProduto : '';
      idGrupoGrade = idGrupoGrade ? idGrupoGrade : '';
      idGrade = idGrade ? idGrade : '';
      dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataPesquisaInicio : '';
      dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataPesquisaFim : '';
      page = page ? page : '';
      pageSize = pageSize ? pageSize : '';
    
    try {        

      // ajaxGet('api/contabilidade/venda-produto-consolidado.xsjs?page='+numPage+'&dataInicio=' + datapesqinicio + '&dataFim=' + datapesqfim + '&idGrupoEmpresarial=' + IDMarcaPesqVenda + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&uf=' + UFPesquisa+ '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade)
      // const apiUrl = `${url}/api/contabilidade/venda-produto-consolidado.xsjs?page=&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idGrupoEmpresarial=${idGrupoEmpresarial}&idEmpresa=${idEmpresa}&descricaoProduto=${produtoPesquisado}&uf=${ufPesquisa}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupoGrade}&idGrade=${idGrade}`
      // const response = await axios.get(apiUrl)
      const response = await getVendasProdutoConsolidado(idMarca, idEmpresa, uf, idFornecedor, descProduto, idGrupoGrade, idGrade, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
  
      return res.json(response);
    } catch (error) {
      console.error("erro no controller ContabilidadeControllers.getListaVendasPeriodoConsolidado:", error);
      throw error;
    }
        
  }

  async getListaBuscarProduto(req, res) {
    let { idProduto, codBarras, descProduto, dataPesquisa, page, pageSize } = req.query;
      idProduto = idProduto ? idProduto : '';
      codBarras = codBarras ? codBarras : '';
      descProduto = descProduto ? descProduto : '';
      dataPesquisa = dataPesquisa ? dataPesquisa : '';
      page = page ? page : '';
      pageSize = pageSize ? pageSize : '';
    try {        

      const apiUrl = `${url}/api/contabilidade/buscar-produtos.xsjs?descProd=${descProduto}`
      // const apiUrl = getBuscarProduto(idProduto, codBarras, descProduto, dataPesquisa, page, pageSize)
      const response = await axios.get(apiUrl)
      
      return res.json(response.data);
    } catch (error) {
      console.error("erro no controller ContabilidadeControllers.getListaBuscarProduto:", error);
      throw error;
    }
        
  }
  
}

export default new ContabilidadeControllers();