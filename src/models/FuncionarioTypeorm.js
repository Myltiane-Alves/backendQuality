// crie uma model para o funcionario com o typeorm e javascript

class FuncionarioTypeorm {
  constructor() {
    this.id = id;
    this.name = "";
    this.empresa = null;
  }

  async save() {
    try {
      const repository = getRepository(FuncionarioTypeorm);
      const funcionario = await repository.save(this);
      return funcionario;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update() {
    try {
      const repository = getRepository(FuncionarioTypeorm);
      const funcionario = await repository.update(this.id, this);
      return funcionario;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async delete() {
    try {
      const repository = getRepository(FuncionarioTypeorm);
      const funcionario = await repository.delete(this.id);
      return funcionario;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async get() {
    try {
      const repository = getRepository(FuncionarioTypeorm);
      const funcionario = await repository.findOne(this.id);
      return funcionario;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAll() {
    try {
      const repository = getRepository(FuncionarioTypeorm);
      const funcionarios = await repository.find();
      return funcionarios;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

}