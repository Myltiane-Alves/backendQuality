import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;
import { v4 as uuidv4 } from 'uuid';


export const postLogin = async (usuario, senha) => {
    try {
        if (!usuario || !senha) {
            throw new Error('Usuário ou senha não informados!');
        }

        const query = `
            SELECT 
                tbf.IDFUNCIONARIO, 
                tbf.IDGRUPOEMPRESARIAL, 
                tbf.IDSUBGRUPOEMPRESARIAL, 
                tbf.IDEMPRESA, 
                tbf.NOFUNCIONARIO, 
                tbf.IDPERFIL, 
                tbf.DSFUNCAO, 
                tbe.NOFANTASIA, 
                tbe.ID_LISTA_LOJA, 
                TO_VARCHAR(CURRENT_UTCTIMESTAMP, 'DD/MM/YYYY HH24:MI:SS') AS DATAHORASESSAO
            FROM "${databaseSchema}".FUNCIONARIO tbf
            INNER JOIN "${databaseSchema}".EMPRESA tbe 
            ON tbf.IDEMPRESA = tbe.IDEMPRESA
            WHERE 
                tbf.NOLOGIN = ? 
                AND tbf.PWSENHA = ? 
                AND tbf.STATIVO = 'True'
        `;

        const statement = await conn.prepare(query);
        const result = await statement.exec([usuario, senha]);

        if (!result || result.length === 0) {
            return {
                error: true,
                msg: "Usuário ou Senha não são válidos"
            };
        }

        const user = result[0];

        const token = `${uuidv4()}.${uuidv4()}`;

        const userToken = {
            token,
            id: user.IDFUNCIONARIO,
            IDGRUPOEMPRESARIAL: user.IDGRUPOEMPRESARIAL,
            IDSUBGRUPOEMPRESARIAL: user.IDSUBGRUPOEMPRESARIAL,
            IDEMPRESA: user.IDEMPRESA,
            NOFUNCIONARIO: user.NOFUNCIONARIO,
            IDPERFIL: user.IDPERFIL,
            DSFUNCAO: user.DSFUNCAO,
            NOFANTASIA: user.NOFANTASIA,
            ID_LISTA_LOJA: user.ID_LISTA_LOJA,
            DATA_HORA_SESSAO: user.DATAHORASESSAO,
        };

        return userToken;

    } catch (error) {
        throw new Error(`Erro ao autenticar: ${error.message}`);
    }
};