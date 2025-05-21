import axios from "axios";
import { dataFormatada } from "../../utils/dataFormatada.js";
import { getEmpresas } from "../../Informatica/Empresas/empresas.js";
import { getListaMetaVendas } from "../Metas/repositories/listaMetaVendas.js";
import { getVendasMarcaPeriodo } from "../Vendas/repositories/vendaMarcaPeriodo.js";
import { getFuncionariosLoja, updateFuncionario } from "../Funcionarios/funcionarioLoja.js";
import { getFuncionarioRelatorio } from "../Funcionarios/funcionarioRelatorio.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;
class CormercialControllers {

    async getListaFornecedorProduto(req, res) {
        let { idMarca } = req.query;
        idMarca = idMarca ? idMarca : '';
        try {
            const apiUrl = `${url}/api/comercial/fornecedor-produto.xsjs?idmarca=${idMarca}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaProdutoSap(req, res) {
        let { idEmpresa } = req.query;

        try {
            const apiUrl = `${url}/api/produto-sap/grupo.xsjs`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    

    async getListaGrupoProduto(req, res) {
        let { idEmpresa } = req.query;

        try {
            const apiUrl = `${url}/api/comercial/grupo-produto.xsjs`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaSubGrupoProduto(req, res) {
        let { idGrupo } = req.query;
        idGrupo = idGrupo ? idGrupo : '';
        try {
            const apiUrl = `${url}/api/comercial/subgrupo-produto.xsjs?idGrupo=${idGrupo}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaMarcaProduto(req, res) {
        let { idSubGrupo } = req.query;
        idSubGrupo = idSubGrupo ? idSubGrupo : '';
        try {
            const apiUrl = `${url}/api/comercial/marca-produto.xsjs?idSubGrupo=${idSubGrupo}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaEmpresaComercial(req, res) {
        let { idMarca, idEmpresa, ufProd, page, pageSize } = req.query;
       
          
            try {
                const apiUrl = `${url}/api/comercial/empresa.xsjs?idmarca=${idMarca}`;
                // const response = await getEmpresas(idMarca, idEmpresa, ufProd, page, pageSize)
                const response = await axios.get(apiUrl)
                return res.json(response.data); // Retorna
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        
    }

    async getListaVendasEstruturaProdutos(req, res) {
        let { idEmpresaLogin, dataPesquisaInicio, dataPesquisaFim } = req.query;
        if (!isNaN(idEmpresaLogin)) {
            idEmpresaLogin = Number(idEmpresaLogin);
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio)
            dataPesquisaFim = dataFormatada(dataPesquisaFim)
            try {
                const apiUrl = `${url}/api/comercial/vendas-por-produto.xsjs?idEmpresa=${idEmpresaLogin}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
                const response = await axios.get(apiUrl)

                return res.json(response.data); // Retorna
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        }
    }

    // async getListaVendasVendedorEstrutura(req, res) {
    //     let { idEmpresaLogin, dataPesquisaInicio, dataPesquisaFim, idMarcaPesquisaVenda, idLojaPesquisaVenda, descricaoProduto, ufPesquisa, idFornecedor, idGrupo, idGrade, idMarca } = req.query;

    //     idEmpresaLogin = idEmpresaLogin ? idEmpresaLogin : '';
    //     idMarcaPesquisaVenda = idMarcaPesquisaVenda ? idMarcaPesquisaVenda : '';
    //     idLojaPesquisaVenda = idLojaPesquisaVenda ? idLojaPesquisaVenda : '';
    //     descricaoProduto = descricaoProduto ? descricaoProduto : '';
    //     ufPesquisa = ufPesquisa ? ufPesquisa : '';
    //     idFornecedor = idFornecedor ? idFornecedor : '';
    //     idGrupo = idGrupo ? idGrupo : '';
    //     idGrade = idGrade ? idGrade : '';
    //     idMarca = idMarca ? idMarca : '';
    //     dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    //     dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    //     try {
    //         // ajaxGet('api/comercial/vendas-vendedor-estrutura.xsjs?page='+numPage+'&dataInicio=' + datapesqinicio + '&dataFim=' + datapesqfim + '&idGrupoEmpresarial=' + IDMarcaPesqVenda + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&uf=' + UFPesquisa+ '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto='+IDMarca)
    //         const apiUrl = `${url}/api/comercial/vendas-vendedor-estrutura.xsjs?page=&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idGrupoEmpresarial=${idMarcaPesquisaVenda}&idEmpresa=${idLojaPesquisaVenda}&descricaoProduto=${descricaoProduto}&uf=${ufPesquisa}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarca}`;
    //         const response = await axios.get(apiUrl)

    //         return res.json(response.data); // Retorna
    //     } catch (error) {
    //         console.error("Unable to connect to the database:", error);
    //         throw error;
    //     }

    // }

    // async getListaVendasIndicadoresEstrutura(req, res) {
    //     let { idEmpresaLogin, dataPesquisaInicio, dataPesquisaFim, idMarcaPesquisaVenda, idLojaPesquisaVenda, descricaoProduto, ufPesquisa, idFornecedor, idGrupo, idGrade, idMarca } = req.query;

    //     idEmpresaLogin = idEmpresaLogin ? idEmpresaLogin : '';
    //     idMarcaPesquisaVenda = idMarcaPesquisaVenda ? idMarcaPesquisaVenda : '';
    //     idLojaPesquisaVenda = idLojaPesquisaVenda ? idLojaPesquisaVenda : '';
    //     descricaoProduto = descricaoProduto ? descricaoProduto : '';
    //     ufPesquisa = ufPesquisa ? ufPesquisa : '';
    //     idFornecedor = idFornecedor ? idFornecedor : '';
    //     idGrupo = idGrupo ? idGrupo : '';
    //     idGrade = idGrade ? idGrade : '';
    //     idMarca = idMarca ? idMarca : '';
    //     dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    //     dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    //     try {
    //         // ajaxGet('api/comercial/vendas-por-estrutura.xsjs?page='+numPage+'&dataPesquisaInicio=' + datapesqinicio + '&dataPesquisaFim=' + datapesqfim + '&idMarca=' + IDMarcaPesqVenda + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&uf=' + UFPesquisa+ '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto='+IDMarca)
                         
    //         const apiUrl = `${url}/api/comercial/vendas-por-estrutura.xsjs?page=&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${idMarcaPesquisaVenda}&idEmpresa=${idLojaPesquisaVenda}&descricaoProduto=${descricaoProduto}&uf=${ufPesquisa}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarca}`;
    //         const response = await axios.get(apiUrl)

    //         return res.json(response.data); // Retorna
    //     } catch (error) {
    //         console.error("Unable to connect to the database:", error);
    //         throw error;
    //     }

    // }

    // async getListaProdutosMaisVendidosEstrutura(req, res) {
    //     let { dataPesquisaInicio, dataPesquisaFim, idGrupoEmpresarial, idMarcaPesquisaVenda, idLojaPesquisaVenda, descricaoProduto, ufPesquisa, idFornecedor, idGrupo, idGrade, idMarca } = req.query;
    //     idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
    //     idMarcaPesquisaVenda = idMarcaPesquisaVenda ? idMarcaPesquisaVenda : '';
    //     idLojaPesquisaVenda = idLojaPesquisaVenda ? idLojaPesquisaVenda : '';
    //     descricaoProduto = descricaoProduto ? descricaoProduto : '';
    //     ufPesquisa = ufPesquisa ? ufPesquisa : '';
    //     idFornecedor = idFornecedor ? idFornecedor : '';
    //     idGrupo = idGrupo ? idGrupo : '';
    //     idGrade = idGrade ? idGrade : '';
    //     idMarca = idMarca ? idMarca : '';
    //     dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
    //     dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
    //     try {
    //         // ajaxGet('api/comercial/produtos-mais-vendidos.xsjs?page='+numPage+'&dataInicio=' + datapesqinicio + '&dataFim=' + datapesqfim + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto='+IDMarca)

    //         const apiUrl = `${url}/api/comercial/produtos-mais-vendidos.xsjs?page=&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idEmpresa=${idLojaPesquisaVenda}&descricaoProduto=${descricaoProduto}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarca}`;
    //         const response = await axios.get(apiUrl)

    //         return res.json(response.data); // Retorna
    //     } catch (error) {
    //         console.error("Unable to connect to the database:", error);
    //         throw error;
    //     }

    // }

    async getListaProdutosEstoquePrecoLoja(req, res) {
        let { dataPesquisaInicio, dataPesquisaFim, idMarcaProduto, idEmpresa, descricaoProduto, uf, idFornecedor, idGrupo, idGrade, idMarca, vlPrecoProduto } = req.query;
        idEmpresa = idEmpresa ? idEmpresa : '';
        descricaoProduto = descricaoProduto ? descricaoProduto : '';
        uf = uf ? uf : '';
        idFornecedor = idFornecedor ? idFornecedor : '';
        idGrupo = idGrupo ? idGrupo : '';
        idGrade = idGrade ? idGrade : '';
        idMarca = idMarca ? idMarca : '';
        idMarcaProduto = idMarcaProduto ? idMarcaProduto : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        vlPrecoProduto = vlPrecoProduto ? vlPrecoProduto : '';

        try {
            // ajaxGet('api/comercial/produtos-precos-estoques-lojas.xsjs?page='+numPage+'&dataPesquisaInicio=' + datapesqinicio + '&dataPesquisaFim=' + datapesqfim + '&idMarca=' + IDMarcaPesqVenda + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&uf=' + UFPesquisa+ '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto=' + IDMarca + '&vlPreco='+vlPrecoProduto)
            const apiUrl = `${url}/api/comercial/produtos-precos-estoques-lojas.xsjs?&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&descricaoProduto=${descricaoProduto}&uf=${uf}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarcaProduto}&vlPreco=${vlPrecoProduto}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaVendasMarcaPorPeriodoComercial(req, res) {
        let { idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize } = req.query;
        
            idMarca = idMarca ? idMarca : '';
            idEmpresa = idEmpresa ? idEmpresa : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
    
          try {
            // const apiUrl = `${url}/api/comercial/venda-marca-periodo.xsjs?pageSize=${pageSize}&idMarca=${idMarcaPesqVenda}&dataInicio=${dataPesqInicio}&dataFim=${dataPesqFim}`
            // const response = await axios.get(apiUrl)
            const response = await getVendasMarcaPeriodo(idMarca, idEmpresa, dataPesquisaInicio, dataPesquisaFim, page, pageSize)
    
            return res.json(response); // Retorna
          } catch (error) {
            console.error("erro no ComercialControllers getListaVendasMarcaPorPeriodoComercial:", error);
            throw error;
          }
        
    }

    async getListaVendasEstoqueGrupoSubGrupoComercial(req, res) {
        let { idMarca, dataPesquisaInicio, dataPesquisaFim, idGrupo, idGrade, page, pageSize } = req.query;
    
            idMarca = idMarca ? idMarca : '';
            idGrupo = idGrupo ? idGrupo : '';
            idGrade = idGrade ? idGrade : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
      
    
          try {
            // ajaxGet('api/comercial/vendas-estoque-grupo-subgrupo.xsjs?page='+numPage+'&dataPesquisaInicio=' + datapesqinicio + '&dataPesquisaFim=' + datapesqfim + '&idMarca=' + IDMarcaPesqVenda + '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade )
            const apiUrl = `${url}/api/comercial/vendas-estoque-grupo-subgrupo.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${idMarca}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
    
            return res.json(response.data); 
          } catch (error) {
            console.error("erro no ComercialControllers getListaVendasEstoqueGrupoSubGrupoComercial:", error);
            throw error;
          }
        
    }

    async getListaVendasPosicionamentoEstoquePeriodos(req, res) {
        let { 
            dataPesquisaInicio,
            dataPesquisaInicioB,
            dataPesquisaInicioC,
            dataPesquisaFim, 
            dataPesquisaFimB, 
            dataPesquisaFimC, 
            idMarcaProduto, 
            descricaoProduto, 
            ufPesquisa, 
            idFornecedor, 
            idGrupo, 
            idGrade, 
            page,
            pageSize  
         
        } = req.query;
        
            descricaoProduto = descricaoProduto ? descricaoProduto : '';
            idFornecedor = idFornecedor ? idFornecedor : '';
            idGrupo = idGrupo ? idGrupo : '';
            idGrade = idGrade ? idGrade : '';
            idMarcaProduto = idMarcaProduto ? idMarcaProduto : '';
            dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
            dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
            dataPesquisaInicioB = dataFormatada(dataPesquisaInicioB) ? dataFormatada(dataPesquisaInicioB) : '';
            dataPesquisaFimB = dataFormatada(dataPesquisaFimB) ? dataFormatada(dataPesquisaFimB) : '';
            dataPesquisaInicioC = dataFormatada(dataPesquisaInicioC) ? dataFormatada(dataPesquisaInicioC) : '';
            dataPesquisaFimC = dataFormatada(dataPesquisaFimC) ? dataFormatada(dataPesquisaFimC) : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
 
            // ajaxGet('api/comercial/vendas-estoque-produto.xsjs?page='+numPage+'&dataPesquisaInicio=' + datapesqinicio + '&dataPesquisaFim=' + datapesqfim + '&dataPesquisaInicioB=' + datapesqinicioB + '&dataPesquisaFimB=' + datapesqfimB + '&dataPesquisaInicioC=' + datapesqinicioC + '&dataPesquisaFimC=' + datapesqfimC + '&descricaoProduto=' + ProdutoPesqVenda + '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto='+IDMarca)
            const apiUrl = `${url}/api/comercial/vendas-estoque-produto.xsjs?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataPesquisaInicioB=${dataPesquisaInicioB}&dataPesquisaFimB=${dataPesquisaFimB}&dataPesquisaInicioC=${dataPesquisaInicioC}&dataPesquisaFimC=${dataPesquisaFimC}&descricaoProduto=${descricaoProduto}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarcaProduto}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl)
            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
        
    }

    async getListaColaboradorRelatorio(req, res) {
        let { idEmpresa, page, pageSize } = req.query;
            idEmpresa = idEmpresa ? idEmpresa : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/comercial/funcionariorel.xsjs?idEmpresa=${idEmpresa}`
            // const response = await axios.get(apiUrl)
            const response = await getFuncionarioRelatorio(idEmpresa, page, pageSize)
    
            return res.json(response); 
        } catch (error) {
            console.error("erro no ComercialControllers getListaColaboradorRelatorio:", error);
            throw error;
        }
    }

    async getListaVendasCustoLojas(req, res) {
        let { idEmpresaLogin, dataPesquisaInicio, dataPesquisaFim, idGrupoEmpresarial, idEmpresa, descricaoProduto, ufPesquisa, idFornecedor, idGrupo, idGrade, idMarcaProduto } = req.query;

        idEmpresaLogin = idEmpresaLogin ? idEmpresaLogin : '';
        idGrupoEmpresarial = idGrupoEmpresarial ? idGrupoEmpresarial : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        descricaoProduto = descricaoProduto ? descricaoProduto : '';
        ufPesquisa = ufPesquisa ? ufPesquisa : '';
        idFornecedor = idFornecedor ? idFornecedor : '';
        idGrupo = idGrupo ? idGrupo : '';
        idGrade = idGrade ? idGrade : '';
        idMarcaProduto = idMarcaProduto ? idMarcaProduto : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        try {
            // ajaxGet('api/comercial/vendas-vendedor-estrutura.xsjs?page='+numPage+'&dataInicio=' + datapesqinicio + '&dataFim=' + datapesqfim + '&idGrupoEmpresarial=' + IDMarcaPesqVenda + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&uf=' + UFPesquisa+ '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto='+IDMarca)
            const apiUrl = `${url}/api/comercial/custo-por-loja.xsjs?page=&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idGrupoEmpresarial=${idGrupoEmpresarial}&idEmpresa=${idEmpresa}&descricaoProduto=${descricaoProduto}&uf=${ufPesquisa}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarcaProduto}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaVendasPosicionamentoEstoque(req, res) {
        let { dataPesquisaInicio, dataPesquisaFim, idMarca, idEmpresa, descricaoProduto, ufPesquisa, idFornecedor, idGrupo, idGrade, idMarcaProduto } = req.query;

        idMarca = idMarca ? idMarca : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        descricaoProduto = descricaoProduto ? descricaoProduto : '';
        ufPesquisa = ufPesquisa ? ufPesquisa : '';
        idFornecedor = idFornecedor ? idFornecedor : '';
        idGrupo = idGrupo ? idGrupo : '';
        idGrade = idGrade ? idGrade : '';
        idMarcaProduto = idMarcaProduto ? idMarcaProduto : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        try {
            // ajaxGet('api/comercial/vendas-posicionamento-estoque.xsjs?page='+numPage+'&dataPesquisaInicio=' + datapesqinicio + '&dataPesquisaFim=' + datapesqfim + '&idMarca=' + IDMarcaPesqVenda + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&uf=' + UFPesquisa+ '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto='+IDMarca)

            const apiUrl = `${url}/api/comercial/vendas-posicionamento-estoque.xsjs?page=&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${idMarca}&idEmpresa=${idEmpresa}&descricaoProduto=${descricaoProduto}&uf=${ufPesquisa}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarcaProduto}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaColaboradorProdutosVendidos(req, res) {
        let { dataPesquisaInicio, dataPesquisaFim, idMarca, idEmpresa, descricaoProduto, ufPesquisa, idFornecedor, idGrupo, idGrade, idMarcaProduto, idFuncionario } = req.query;

        idMarca = idMarca ? idMarca : '';
        idEmpresa = idEmpresa ? idEmpresa : '';
        descricaoProduto = descricaoProduto ? descricaoProduto : '';
        ufPesquisa = ufPesquisa ? ufPesquisa : '';
        idFornecedor = idFornecedor ? idFornecedor : '';
        idGrupo = idGrupo ? idGrupo : '';
        idGrade = idGrade ? idGrade : '';
        idMarcaProduto = idMarcaProduto ? idMarcaProduto : '';
        dataPesquisaInicio = dataFormatada(dataPesquisaInicio) ? dataFormatada(dataPesquisaInicio) : '';
        dataPesquisaFim = dataFormatada(dataPesquisaFim) ? dataFormatada(dataPesquisaFim) : '';
        idFuncionario = idFuncionario ? idFuncionario : '';
        try {
            // ajaxGet('api/comercial/colaborador-produtos-vendidos.xsjs?page='+numPage+'&dataInicio=' + datapesqinicio + '&dataFim=' + datapesqfim + '&idGrupoEmpresarial=' + IDMarcaPesqVenda + '&idEmpresa=' + IDLojaPesqVenda + '&descricaoProduto=' + ProdutoPesqVenda + '&uf=' + UFPesquisa+ '&idFornecedor=' + IDForn+ '&idGrupoGrade=' + IDGrupo+ '&idGrade=' + IDGrade + '&idMarcaProduto='+IDMarca + '&IdFunc='+IDColaborador)

            const apiUrl = `${url}/api/comercial/colaborador-produtos-vendidos.xsjs?page=&dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idGrupoEmpresarial=${idMarca}&idEmpresa=${idEmpresa}&descricaoProduto=${descricaoProduto}&uf=${ufPesquisa}&idFornecedor=${idFornecedor}&idGrupoGrade=${idGrupo}&idGrade=${idGrade}&idMarcaProduto=${idMarcaProduto}&idFunc=${idFuncionario}`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }
    async getListaMetasGrupo(req, res) {
        let { page, pageSize } = req.query;
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // ajaxGetComAnimacaoDeCarregamento(`api/comercial/lista-premiacoes.xsjs?page=${numPage}`)
            const apiUrl = `${url}/api/comercial/lista-meta-vendas.xsjs?page=${page}&pageSize=${pageSize}`;
            // const response = await axios.get(apiUrl)
            const response = await getListaMetaVendas(page, pageSize)

            return res.json(response); 
        } catch (error) {
            console.error("erro no ComercialControllers getListaMetasGrupo:", error);
            throw error;
        }

    }

    async getListaPremiacoesPeriodo(req, res) {
        let {  } = req.query;
        
        try {
            // ajaxGetComAnimacaoDeCarregamento(`api/comercial/lista-premiacoes.xsjs?page=${numPage}`)
            const apiUrl = `${url}/api/comercial/lista-premiacoes.xsjs?page=1`;
            const response = await axios.get(apiUrl)

            return res.json(response.data); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async getListaFuncionariosLojaComercial(req, res) {
        let {byId, idEmpresa, cpf, noFuncionarioCPF, page, pageSize  } = req.query;

            byId = byId ? byId : '';
            idEmpresa = idEmpresa ? idEmpresa : '';
            cpf = cpf ? cpf : '';
            noFuncionarioCPF = noFuncionarioCPF ? noFuncionarioCPF : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // ajaxGetComAnimacaoDeCarregamento(`api/comercial/lista-premiacoes.xsjs?page=${numPage}`)
            // const apiUrl = `${url}/api/comercial/funcionario-loja.xsjs`;
            // const response = await axios.get(apiUrl)
            const response = getFuncionariosLoja(byId, idEmpresa, cpf, noFuncionarioCPF, page, pageSize)

            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }

    }

    async putFuncionarioLoja(req, res) {
        try {
            const detalhes = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await updateFuncionario(detalhes)
        
            return res.json(response);
        } catch (error) {
            console.error("erro no ComercialControllers putFuncionarioLoja:", error);
            throw error;
        }
    }
}

export default new CormercialControllers();
