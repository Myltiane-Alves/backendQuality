import { DataTypes, Model } from "sequelize";

class Perfil extends Model  {
    static init(sequelize) {
        super.init({
            IDPERFIL: DataTypes.INTEGER,
            DSPERFIL: DataTypes.STRING,
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'PERFIL'
        })
        return this;
    }
}

export default Perfil;
