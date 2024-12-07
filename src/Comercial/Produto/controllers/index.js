
import axios from "axios";
import { getGrupoProduto } from "../repositories/grupoProduto.js";
import { getSubGrupoProduto } from "../repositories/subGrupoProduto.js";
import { getMarcaProduto } from "../repositories/marcaProduto.js";
import { getFornecedorProduto } from "../repositories/fornecedorProduto.js";
import { getVendasPorProdutos } from "../repositories/vendasPorProdutos.js";
import { getVendasVendedorEstrutura } from "../repositories/vendasVendedorEstrutura.js";
import { getProdutosMaisVendidos } from "../repositories/produtosMaisVendidos.js";
import { getVendasPorEstrutura } from "../repositories/vendasPorEstrutura.js";
import { dataFormatada } from "../../../utils/dataFormatada.js";

let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;


class ComercialProdutoControllers {
  async getListaGrupoProduto(req, res) {
    let { nome, page, pageSize } = req.query;
    nome = nome ? nome : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/comercial/grupo-produto.xsjs?nome=${nome}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl)
      // const response = await getGrupoProduto(nome, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaSubGrupoProduto(req, res) {
    let { idGrupo, page, pageSize } = req.query;

    idGrupo = idGrupo ? idGrupo : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const response = await getSubGrupoProduto(idGrupo, page, pageSize)

      return res.json(response);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaVendasPorProduto(req, res) {
    let { idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    idEmpresa = idEmpresa ? idEmpresa : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/comercial/vendas-por-produto.xsjs?idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl)
      // const response = await getVendasPorProdutos(idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaMarcaProduto(req, res) {
    let { idEstrutura, page, pageSize } = req.query;

    idEstrutura = idEstrutura ? idEstrutura : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/comercial/marca-produto.xsjs?idSubGrupo=${idEstrutura}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl)
      // const response = await getMarcaProduto(idEstrutura, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaFornecedorProduto(req, res) {
    let { idMarca, page, pageSize } = req.query;

    idMarca = idMarca ? idMarca : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      const apiUrl = `${url}/api/comercial/fornecedor-produto.xsjs?idMarca=${idMarca}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl)
      // const response = await getFornecedorProduto(idMarca, page, pageSize)

      return res.json(response.data);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaVendasVendedorEstrutura(req, res) {
    let { idEmpresa, idGrupoEmpresarial, idGrupo, idSubGrupo, idMarca, idFornecedor, descricaoProduto, uf, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    idEmpresa = idEmpresa ? idEmpresa : '';
    idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
    descricaoProduto = descricaoProduto ? descricaoProduto : '';
    uf = uf ? uf : '';
    idFornecedor = idFornecedor ? idFornecedor : '';
    idGrupo = idGrupo ? idGrupo : '';
    idSubGrupo = idSubGrupo ? idSubGrupo : '';
    idMarca = idMarca ? idMarca : '';
    dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
     
      const apiUrl = `${url}/api/comercial/vendas-vendedor-estrutura.xsjs?dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idGrupoEmpresarial=${idGrupoEmpresarial}&idEmpresa=${idEmpresa}&descricaoProduto=${descricaoProduto}&uf=${uf}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idSubGrupo}&idMarcaProduto=${idMarca}&uf=${uf}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl)
      // const response = await getVendasVendedorEstrutura(idEmpresa, idGrupoEmpresarial, idGrupo, idSubGrupo, idMarca, idFornecedor, descricaoProduto, uf, dataPesquisaInicio, dataPesquisaFim, page, pageSize) 


      return res.json(response.data); // Retorna
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  async getListaProdutosMaisVendidosEstrutura(req, res) {
    let { idEmpresa, idGrupoEmpresarial, idGrupo, idSubGrupo, idMarca, idFornecedor, descricaoProduto, uf, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    idEmpresa = idEmpresa ? idEmpresa : '';
    idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
    descricaoProduto = descricaoProduto ? descricaoProduto : '';
    uf = uf ? uf : '';
    idFornecedor = idFornecedor ? idFornecedor : '';
    idGrupo = idGrupo ? idGrupo : '';
    idSubGrupo = idSubGrupo ? idSubGrupo : '';
    idMarca = idMarca ? idMarca : '';
    dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';

    try {
      
      const apiUrl = `${url}/api/comercial/produtos-mais-vendidos.xsjs?dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idEmpresa=${idEmpresa}&descricaoProduto=${descricaoProduto}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idSubGrupo}&idMarcaProduto=${idMarca}&uf=${uf}&page=${page}&pageSize=${pageSize}`;
      const response = await axios.get(apiUrl)
      // const response = await getProdutosMaisVendidos(idEmpresa, idGrupoEmpresarial, idGrupo, idSubGrupo, idMarca, idFornecedor, descricaoProduto, uf, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response.data); // Retorna
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }

  }

  async getListaVendasIndicadoresEstrutura(req, res) {
    let { idEmpresa, idGrupoEmpresarial, idGrupo, idSubGrupo, idMarcaProduto, idFornecedor, descricaoProduto, uf, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;

    idEmpresa = idEmpresa ? idEmpresa : '';
    idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
    descricaoProduto = descricaoProduto ? descricaoProduto : '';
    uf = uf ? uf : '';
    idFornecedor = idFornecedor ? idFornecedor : '';
    idGrupo = idGrupo ? idGrupo : '';
    idSubGrupo = idSubGrupo ? idSubGrupo : '';
    idMarcaProduto = idMarcaProduto ? idMarcaProduto : '';
    dataPesquisaInicio = dataPesquisaInicio ? dataPesquisaInicio : '';
    dataPesquisaFim = dataPesquisaFim ? dataPesquisaFim : '';
    page = page ? page : '';
    pageSize = pageSize ? pageSize : '';
    try {
      // "http://164.152.245.77:8000/quality/concentrador/api/comercial/vendas-por-estrutura.xsjs?dataPesquisaInicio=2024-10-04&dataPesquisaFim=2024-10-04&idMarca=0&idEmpresa=1&descricaoProduto=&uf=&idFornecedor=137&idGrupoGrade=1&idGrade=&idMarcaProduto=&uf=&page=&pageSize="
      //2 http://164.152.245.77:8000/quality/concentrador/api/comercial/vendas-por-estrutura.xsjs?dataPesquisaInicio=2024-10-04&dataPesquisaFim=2024-10-04&idMarca=0&idEmpresa=1&descricaoProduto=&uf=0&idFornecedor=&idGrupoGrade=1&idGrade=137&idMarcaProduto=
      const apiUrl = `${url}/api/comercial/vendas-por-estrutura.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${idGrupoEmpresarial}&idEmpresa=${idEmpresa}&descricaoProduto=${descricaoProduto}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idSubGrupo}&idMarcaProduto=${idMarcaProduto}`;
      const response = await axios.get(apiUrl)
      // const response = await getVendasPorEstrutura(idEmpresa, idGrupoEmpresarial, idGrupo, idSubGrupo, idMarca, idFornecedor, descricaoProduto, uf, dataPesquisaInicio, dataPesquisaFim, page, pageSize)

      return res.json(response.data); // Retorna
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }

  }

}

export default new ComercialProdutoControllers();