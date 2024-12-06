import { DataTypes, Model } from "sequelize";

class Empresa extends Model {
    static init(sequelize) {
        super.init({
            IDEMPRESA: DataTypes.INTEGER,
            STGRUPOEMPRESARIAL: DataTypes.INTEGER,
            IDGRUPOEMPRESARIAL: DataTypes.INTEGER,
            IDSUBGRUPOEMPRESARIAL: DataTypes.INTEGER,
            NORAZAOSOCIAL: DataTypes.STRING,
            NOFANTASIA: DataTypes.STRING,
            NUCNPJ: DataTypes.STRING,
            NUINSCESTADUAL: DataTypes.STRING,
            NUINSCMUNICIPAL: DataTypes.STRING,
            CNAE: DataTypes.STRING,
            EENDERECO: DataTypes.STRING,
            ECOMPLEMENTO: DataTypes.STRING,
            EBAIRRO: DataTypes.STRING,
            ECIDADE: DataTypes.STRING,
            SGUF: DataTypes.STRING,
            NUUF: DataTypes.INTEGER,
            NUCEP: DataTypes.STRING,
            NUIBGE: DataTypes.STRING,
            EEMAILPRINCIPAL: DataTypes.STRING,
            EEMAILCOMERCIAL: DataTypes.STRING,
            EEMAILFINANCEIRO: DataTypes.STRING,
            EEMAILCONTABILIDADE: DataTypes.STRING,
            NUTELPUBLICO: DataTypes.STRING,
            NUTELCOMERCIAL: DataTypes.STRING,
            NUTELFINANCEIRO: DataTypes.STRING,
            NUTELFINANCEIRO: DataTypes.STRING,
            NUTELGERENCIA: DataTypes.STRING,
            EURL: DataTypes.STRING,
            PATHIMG: DataTypes.STRING,
            NUCNAE: DataTypes.STRING,
            STECOMMERCE: DataTypes.STRING,
            DTULTATUALIZACAO: DataTypes.TIME,
            STATIVO: DataTypes.STRING,
            ALIQPIS: DataTypes.DECIMAL,
            ALIQCOFINS: DataTypes.DECIMAL,
            CODPARCEIRO: DataTypes.STRING,
            ESTOQUECODIGO: DataTypes.STRING,
            BRANCHID: DataTypes.INTEGER,
            WAREHOUSECODE: DataTypes.STRING,
            ID_LISTA_LOJA: DataTypes.INTEGER,
            STATUALIZADIARIO: DataTypes.STRING,
            HORAATUALIZA: DataTypes.TIME,
            IDFUNCIONARIOSUPERVISOR: DataTypes.INTEGER,

        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'EMPRESA'
        });
            return this;
    }
    static associate(models) {

    }

}

export default Empresa;