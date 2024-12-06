import { createAuthFuncionarioCreateVoucher } from '../repositories/authFuncionarioCreateVoucher.js';
import conn from '../src/config/dbConnection';

jest.mock('../src/config/dbConnection');

describe('createAuthFuncionarioCreateVoucher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar um erro se a matrícula não for fornecida', async () => {
    const data = [{}];
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('A MATRICULA é uma informação obrigatória');
  });

  it('deve lançar um erro se a senha não for fornecida', async () => {
    const data = [{ MATRICULA: '12345' }];
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('A SENHA é uma informação obrigatória');
  });

  it('deve lançar um erro se a empresa logada não for fornecida', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha' }];
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('A identificação de Empresa Logada é uma informação obrigatória');
  });

  it('deve lançar um erro se o grupo empresarial não for fornecido', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1' }];
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('A identificação do Grupo Empresarial é uma informação obrigatória');
  });

  it('deve lançar um erro se a venda não for fornecida', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1' }];
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('A identificação da Venda é uma informação obrigatória');
  });

  it('deve lançar um erro se a empresa do usuário não for encontrada', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([]),
    });
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('Empresa do Usuario Não Encontrada!');
  });

  it('deve lançar um erro se a venda não for localizada', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ IDFUNCIONARIO: '1' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([]),
    });
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('Venda Não Localizada');
  });

  it('deve lançar um erro se a matrícula ou senha forem inválidos', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([]),
    });
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('Matricula ou senha inválidos!');
  });

  it('deve lançar um erro se o usuário não tiver permissão', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ DSFUNCAO: 'FUNCIONARIO' }]),
    });
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('ACESSO NEGADO! Usuário Sem Permissão!');
  });

  it('deve lançar um erro se a venda não pertencer ao grupo empresarial', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ DSFUNCAO: 'GERENTE' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ IDGRUPOEMPRESARIAL: '2' }]),
    });
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('ACESSO NEGADO! Esta Venda Não Pertence a Nenhuma Loja do Grupo!');
  });

  it('deve lançar um erro se o grupo empresarial da loja for divergente', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ DSFUNCAO: 'GERENTE' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ IDGRUPOEMPRESARIAL: '1' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ IDGRUPOEMPRESARIAL: '2' }]),
    });
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('ACESSO NEGADO! Grupo Empresarial da Loja Divergente, Entre Em Contato Com o Suporte!');
  });

  it('deve lançar um erro se a venda estiver fora do prazo de troca', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    const dataHoraVenda = new Date();
    dataHoraVenda.setDate(dataHoraVenda.getDate() - 181);
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ DSFUNCAO: 'GERENTE' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ IDGRUPOEMPRESARIAL: '1' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ DTHORAFECHAMENTO: dataHoraVenda }]),
    });
    await expect(createAuthFuncionarioCreateVoucher(data)).rejects.toThrow('ACESSO NEGADO! Venda fora do Prazo de Troca! DIAS PASSADOS APÓS A VENDA: 181 Dias');
  });

  it('deve retornar os dados do funcionário se todas as verificações passarem', async () => {
    const data = [{ MATRICULA: '12345', SENHA: 'senha', IDEMPRESALOGADA: '1', IDGRUPOEMPRESARIAL: '1', IDVENDA: '1' }];
    const dataHoraVenda = new Date();
    dataHoraVenda.setDate(dataHoraVenda.getDate() - 30);
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ DSFUNCAO: 'GERENTE' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ IDGRUPOEMPRESARIAL: '1' }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ DTHORAFECHAMENTO: dataHoraVenda }]),
    });
    conn.prepare.mockResolvedValueOnce({
      exec: jest.fn().mockResolvedValueOnce([{ IDGRUPOEMPRESARIAL: '1' }]),
    });
    const result = await createAuthFuncionarioCreateVoucher(data);
    expect(result).toEqual({ data: [{ DSFUNCAO: 'GERENTE' }] });
  });
});