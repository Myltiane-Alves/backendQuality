import  conn  from '../config/dbConnection.js';

export const getFuncionariosAtivoPorEmpresa = async (req, res) => {
  try {
    const { page = 1, pageSize = 500, idEmpresa } = req.query;

    let query = `
      SELECT 
          tbf.ID,
          tbf.IDFUNCIONARIO,
          tbf.IDGRUPOEMPRESARIAL,
          tbf.IDSUBGRUPOEMPRESARIAL,
          upper(tbf.NOFUNCIONARIO) AS NOFUNCIONARIO,
          tbf.IDPERFIL,
          tbf.NUCPF,
          tbf.NOLOGIN,
          tbf.PWSENHA,
          tbf.DSFUNCAO,
          tbf.DATAULTIMAALTERACAO,
          tbf.VALORSALARIO,
          tbf.DATA_DEMISSAO,
          tbf.PERC,
          tbf.STATIVO
        FROM 
          QUALITY_CONC_HML.FUNCIONARIO tbf
        WHERE 
          tbf.DATA_DEMISSAO is null 
          AND tbf.STATIVO = 'True'
          AND (tbf.DSFUNCAO = 'Assistente De Loja' 
          OR tbf.DSFUNCAO = 'Gerente' 
          OR tbf.DSFUNCAO = 'Vendedor' 
          OR tbf.DSFUNCAO = 'Vendedora' 
          OR tbf.DSFUNCAO = 'Operadora De Caixa' 
          OR tbf.DSFUNCAO = 'Operador De Caixa')
    `;
    
    if (idEmpresa) {
      query += ` AND tbf.IDEMPRESA = ?`;
    }

    query += ` ORDER BY tbf.NOFUNCIONARIO`;

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`;
    }

    const params = [];
    if (idEmpresa) {
      params.push(idEmpresa);
    }
    params.push(offset, parseInt(pageSize));

    const [rows] = await conn.execute(query, params);

    return res.json(rows);
  } catch (error) {
    console.error('Erro ao executar a consulta Funcionarios:', error);
    return res.status(500).json({ message: 'Erro ao executar a consulta Funcionarios', error });
  }
};
