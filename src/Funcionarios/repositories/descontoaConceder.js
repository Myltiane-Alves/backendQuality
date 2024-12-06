export const getDescontoaConcederFuncionario = async (login, senha) => {
    try {
        if (!login) {
          throw new Error("O Campo Login é um parâmetro obrigatório!");
        }
        if (!senha) {
          throw new Error("O Campo Senha é um parâmetro obrigatório!");
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
              tbf.VALORDISPONIVEL,
              tbf.STATIVO,
              IFNULL(tbf.PERCDESCPDV, 0) AS PERCDESCPDV
            FROM 
              QUALITY_CONC_HML.FUNCIONARIO tbf
            WHERE 
              tbf.DATA_DEMISSAO is null 
              AND tbf.STATIVO = 'True'
              AND tbf.NOLOGIN = ? 
              AND tbf.PWSENHA = ?
        `;
    

        const params = [login, senha];
    
        const [rows] = await conn.execute(query, params);
    
        return rows;
      } catch (error) {
        console.error('Erro ao executar a consulta Funcionário:', error);
        throw new Error('Erro ao executar a consulta Funcionário');
      }
}