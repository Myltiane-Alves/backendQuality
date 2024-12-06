import getEmpresa from "./empresa";
import getFuncionario from "./funcionario";
import getGrupoEmpresarial from "./grupoEmpresarial";


let expression = true;

export default function (app) {
    app.get('/funcionario', (req, res) => {
      res.send(getFuncionario);
      /* #swagger.responses[200] = {
            description: 'Listando todos os Funcionários.',
            schema: { $ref: '#/definitions/Funcionario' }
      } */
    });
    app.get('/empresas', (req, res) => {
      res.send(getEmpresa);
      /* #swagger.responses[200] = {
            description: 'Listando todas Empresas.',
            schema: { $ref: '#/definitions/Empresas' }
      } */
    });
    app.get('/marcasLista', (req, res) => {
      res.send(getGrupoEmpresarial);
      /* #swagger.responses[200] = {
            description: 'Listando as Marcas da GTO.',
            schema: { $ref: '#/definitions/GrupoEmpresarial' }
      } */
    });
  }
  