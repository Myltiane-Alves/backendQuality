import Sequelize, { DataTypes, Model } from 'sequelize';

class Funcionario extends Model {
    static init(sequelize) {
        super.init({
            NUCPF: DataTypes.STRING,
            NULOGIN: DataTypes.STRING,
            NOFUNCIONARIO: DataTypes.STRING,
            PWSENHA: DataTypes.STRING,
            DSFUNCAO: DataTypes.STRING,
            DATAULTIMAALTERACAO: DataTypes.TIME,
            VALORSALARIO: DataTypes.DECIMAL,
            DATA_DEMISSAO: DataTypes.TIME,
            PERC: DataTypes.DECIMAL,
            STATIVO: DataTypes.STRING,
            DSTIPO: DataTypes.STRING,
            VALORDISPONIVEL: DataTypes.DECIMAL,
            PERDESCPDV: DataTypes.DECIMAL,
            DTINICIODESC: DataTypes.DATE,
            DTFIMDESC: DataTypes.DATE,
            PERCDESCAUTORIZADO: DataTypes.DECIMAL,
            ACCESSOTOKEN: DataTypes.STRING,
            SENHAHASH: DataTypes.STRING,
            TXTMOTIVODESCONTO: DataTypes.TEXT,
            PERCTO: DataTypes.DECIMAL,
            PERCMG: DataTypes.DECIMAL,
            PERCFC: DataTypes.DECIMAL,
            PERCYO: DataTypes.DECIMAL,
            STDESCONTOFOLHA: DataTypes.STRING,
            STCONVENIO: DataTypes.STRING,
            USUARIODISTRIBUICAO: DataTypes.STRING,
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'FUNCIONARIO'
        });
        return this;
    }
    static associate(models) {
       
        
    }
}


export default Funcionario;