import  conn  from '../config/dbConnection.js';

export const getFuncionariosAtivoPorCPF = async (req, res) => {
  try {
    const { numeroCfp, page = 1, pageSize = 500 } = req.query;

    if (!numeroCfp) {
      return res.status(400).json({ message: 'O Campo Número do CPF é um parâmetro obrigatório!' });
    }

    let query = `
      SELECT 
          tbf.ID,
          tbf.IDFUNCIONARIO,
          tbf.IDGRUPOEMPRESARIAL,
          tbf.IDSUBGRUPOEMPRESARIAL,
          tbf.IDEMPRESA,
          tbf.NOFUNCIONARIO,
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
          AND tbf.DSTIPO = 'FUNCIONARIO'
          AND tbf.NUCPF = ?
    `;

    const offset = (page - 1) * pageSize;
    query += ` ORDER BY tbf.NOFUNCIONARIO OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;

    const [rows] = await conn.execute(query, [numeroCfp]);

    return res.json(rows);
  } catch (error) {
    console.error('Erro ao executar a consulta Funcionarios:', error);
    return res.status(500).json({ message: 'Erro ao executar a consulta Funcionarios', error });
  }
};
