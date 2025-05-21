import { console } from "inspector";
import conn from "../../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;


export const updatePerfilMenuFilho = async (dados) => {
    try {
        for (const item of dados) {
            const {
                IDUSUARIO,
                CRIAR,
                ALTERAR,
                ADMINISTRADOR,
                N4,
                N3,
                N2,
                N1,
                IDMENUPAI,
                ID,
            } = item;
           
            const menuFilhos = Array.isArray(ID) ? ID : [ID];

            for (const menuFilho of menuFilhos) {
                if (menuFilho == null) {
                    console.warn('⚠️ Dados inválidos: IDUSUARIO ou IDMENUFILHO ausente menu filho', {  menuFilho });
                    continue;
                }

                const checkQuery = `
                    SELECT COUNT(*) AS TOTAL
                    FROM ${databaseSchema}.PERFILUSUARIOMENU
                    WHERE IDUSUARIO = ? AND IDMENUFILHO = ?
                `;

                const result = await conn.exec(checkQuery, [IDUSUARIO, menuFilho]);
                const exists = result[0]?.TOTAL > 0;

                if (exists) {
                    let updateQuery = `
                    UPDATE ${databaseSchema}.MENUFILHO SET
                `;
                const params = [];


                if (CRIAR !== undefined) {
                    updateQuery += `CRIAR = ?, `;
                    params.push(CRIAR);
                }

                if (ALTERAR !== undefined) {
                    updateQuery += `ALTERAR = ?, `;
                    params.push(ALTERAR);
                }

                if (ADMINISTRADOR !== undefined) {
                    updateQuery += `ADMINISTRADOR = ?, `;
                    params.push(ADMINISTRADOR);
                }

                if (N1 !== undefined) {
                    updateQuery += `N1 = ?, `;
                    params.push(N1);
                }

                if (N2 !== undefined) {
                    updateQuery += `N2 = ?, `;
                    params.push(N2);
                }

                if (N3 !== undefined) {
                    updateQuery += `N3 = ?, `;
                    params.push(N3);
                }

                if (N4 !== undefined) {
                    updateQuery += `N4 = ?, `;
                    params.push(N4)
                }

                // Adiciona a cláusula WHERE
                // updateQuery = updateQuery.replace(/, $/, '');
                // updateQuery += `, ID IN(?)`;
                // params.push(IDUSUARIO, menuFilho);
               
                updateQuery = updateQuery.replace(/, $/, '');
                if (Array.isArray(ID)) {
                    updateQuery += ` WHERE ID IN (${ID.map(() => '?').join(',')})`;
                    params.push(...ID);
                } else {
                    updateQuery += ` WHERE ID = ?`;
                    params.push(ID);
                }
                const statement = await conn.prepare(updateQuery);
                await statement.exec(params);
              
                } else {
                    const insertQuery = `
                        INSERT INTO ${databaseSchema}.MENUFILHO (
                            ID, 
                            CRIAR, 
                            ALTERAR, 
                            ADMINISTRADOR,
                            N1, 
                            N2, 
                            N3, 
                            N4
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    await conn.exec(insertQuery, [
                        menuFilho,
                        CRIAR,
                        ALTERAR,
                        ADMINISTRADOR,
                        N1,
                        N2,
                        N3,
                        N4
                    ]);
                    console.log(`🆕 Permissão inserida para IDUSUARIO ${IDUSUARIO}, IDMENUFILHO ${menuFilho}`);
                }
            }
        }

        
        await conn.commit();
        console.log('🚀 Atualização de menus filhos concluída com sucesso.');
    } catch (error) {
        console.error('❌ Erro ao executar a atualização de menus filhos:', error);
        throw error;
    }
};

export const updatePerfil = async (dados) => {
    try {
        for (const item of dados) {
            const {
                IDPERFIL,
                IDUSERULTIMAALTERACAO,
                CRIAR,
                ALTERAR,
                ADMINISTRADOR,
                N1,
                N2,
                N3,
                N4
            } = item;

            let updateQuery = `
                UPDATE ${databaseSchema}.PERFILUSUARIOMENU SET
            `;

            const params = [];

            if (IDUSERULTIMAALTERACAO !== undefined) {
                updateQuery += ` IDUSERULTIMAALTERACAO = ?, `;
                params.push(IDUSERULTIMAALTERACAO);
            }

            if (CRIAR !== undefined) {
                updateQuery += ` CRIAR = ?, `;
                params.push(CRIAR);
            }

            if (ALTERAR !== undefined) {
                updateQuery += ` ALTERAR = ?, `;
                params.push(ALTERAR);
            }

            if (ADMINISTRADOR !== undefined) {
                updateQuery += ` ADMINISTRADOR = ?, `;
                params.push(ADMINISTRADOR);
            }

            if (N1 !== undefined) {
                updateQuery += ` N1 = ?, `;
                params.push(N1);
            }

            if (N2 !== undefined) {
                updateQuery += ` N2 = ?, `;
                params.push(N2);
            }

            if (N3 !== undefined) {
                updateQuery += ` N3 = ?, `;
                params.push(N3);
            }

            if (N4 !== undefined) {
                updateQuery += ` N4 = ?, `;
                params.push(N4);
            }

            // Remove trailing comma and add WHERE clause
            updateQuery = updateQuery.replace(/, $/, '');
            updateQuery += ` WHERE IDPERFIL = ?`;
            params.push(IDPERFIL);

            const statement = await conn.prepare(updateQuery);
            await statement.exec(params);

            // console.log(params, 'params');
            console.log(dados, 'dados');
        }

        await conn.commit();
        console.log('🚀 Atualização do Perfil do usuário concluída com sucesso.');
    } catch (error) {
        console.error('❌ Erro ao executar a atualização de perfil do usuário:', error);
        throw error;
    }
};

