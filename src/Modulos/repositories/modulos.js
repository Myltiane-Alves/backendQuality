

import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;


export const getMenuPai = async (idModulo) => {
    let query = `
        SELECT 
            IDMENU, 
            STATIVO, 
            IDMODULO, 
            DSMENU 
        FROM "${databaseSchema}".MENUPAI
            WHERE IDMODULO = ?
    `;

    const params = [idModulo];

    const statement = await conn.prepare(query);
    const result = await statement.exec(params);
    if (!Array.isArray(result) || result.length === 0) return [];

    const data = result.map((item, index) => ({
        IDMENU: item.IDMENU,
        STATIVO: item.STATIVO,
        IDMODULO: item.IDMODULO,
        DSMENU: item.DSMENU
    }))

    return data;
}

export const getMenuFilho = async (idMenuPai, idMenuFilho) => {

    let query = `
       SELECT 
            ID, 
            DSNOME, 
            IDMENUPAI, 
            URL, 
            ALTERAR, 
            CRIAR, 
            VISUALIZAR, 
            N1,
            N2,
            N3,
            N4,
            ADMINISTRADOR
        FROM ${databaseSchema}.MENUFILHO
        WHERE 1 = 1
    `;


    const params = [];

    if(idMenuPai) {
        query += ` AND IDMENUPAI = ?`;
        params.push(idMenuPai);
    }

    if (idMenuFilho) {
        query += ` AND ID IN (?)`;
        params.push(idMenuFilho);
    }

    query += ` ORDER BY ID ASC`;
    query += ` LIMIT ? OFFSET ?`;
    params.push(1000, 0);
  
    const statement = await conn.prepare(query);
    const result = await statement.exec(params);
    
    if (!Array.isArray(result) || result.length === 0) return [];

    const data = result.map((item, index) => ({
        ID: item.ID,
        DSNOME: item.DSNOME,
        IDMENUPAI: item.IDMENUPAI,
        URL: item.URL,
        ALTERAR: item.ALTERAR,
        CRIAR: item.CRIAR,
        VISUALIZAR: item.VISUALIZAR,
        N1: item.N1,
        N2: item.N2,
        N3: item.N3,
        N4: item.N4,
        ADMINISTRADOR: item.ADMINISTRADOR
    }))

    return data;
}


export const getModuloPrincipal = async (idModulo) => {
    const query = `SELECT * FROM ${databaseSchema}.MODULOPRINCIPAL WHERE ID = ?`;
    const params = [idModulo];
    const statement = await conn.prepare(query);
    
    const result = await statement.exec(params);

    return Array.isArray(result) ? result : [];
};

export const getPerfilUsuarioMenu = async (idUsuario, idModulo, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 500;

        let query = `
            SELECT DISTINCT
                IDUSUARIO, 
                DSPERFIL, 
                CRIAR, 
                ALTERAR, 
                STATIVO, 
                IDPERFILUSUARIO, 
                IDMODULO, 
                IDMODULOADMINISTRATIVO, 
                IDMODULOCOMERCIAL, 
                IDMODULOCONTABILIDADE, 
                IDMODULOFINANCEIRO, 
                IDMODULOGERENCIA, 
                IDMODULOINFORMATICA, 
                IDMODULOMARKETING, 
                IDMODULOCOMPRAS, 
                IDMODULOCADASTRO, 
                IDMODULOEXPEDICAO, 
                IDMODULOCOMPRASADM, 
                IDMODULOETIQUETAGEM, 
                IDMODULOCONFERENCIACEGA, 
                IDMODULOVOUCHER, 
                IDMODULOMALOTE, 
                IDMODULORH, 
                IDUSERULTIMAALTERACAO, 
                IDPERMISSAO, 
                IDMODULORESUMOVENDAS, 
                IDMODULOPROMOCAO,
                ADMINISTRADOR, 
                N4, 
                N3, 
                N2, 
                N1,
                IDMENUFILHO,
                IDMENU
            FROM ${databaseSchema}.PERFILUSUARIOMENU 
            WHERE IDUSUARIO = ?
         
        `;

        const params = [idUsuario];
        if (idModulo) {
        
            query += `
                AND (
                    IDMODULO = ?
                    OR IDMODULOADMINISTRATIVO = ?
                    OR IDMODULOCOMERCIAL = ?
                    OR IDMODULOCONTABILIDADE = ?
                    OR IDMODULOFINANCEIRO = ?
                    OR IDMODULOGERENCIA = ?
                    OR IDMODULOINFORMATICA = ?
                    OR IDMODULOMARKETING = ?
                    OR IDMODULOCOMPRAS = ?
                    OR IDMODULOCADASTRO = ?
                    OR IDMODULOEXPEDICAO = ?
                    OR IDMODULOCOMPRASADM = ?
                    OR IDMODULOETIQUETAGEM = ?
                    OR IDMODULOCONFERENCIACEGA = ?
                    OR IDMODULOVOUCHER = ?
                    OR IDMODULOMALOTE = ?
                    OR IDMODULORH = ?
                    OR IDPERMISSAO = ?
                    OR IDMODULORESUMOVENDAS = ?
                    OR IDMODULOPROMOCAO = ?
                )
            `;
          
            for (let i = 0; i < 20; i++) {
                params.push(idModulo);
            }
        }    
        query += ` ORDER BY IDUSUARIO, IDMENUFILHO`;
        query += ` LIMIT ? OFFSET ?`;
        params.push(pageSize, (page - 1) * pageSize);
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        if (!Array.isArray(result) || result.length === 0) return [];

 
        const usuariosAgrupados = new Map();

        for (const item of result) {
            if (!usuariosAgrupados.has(item.IDUSUARIO)) {
                usuariosAgrupados.set(item.IDUSUARIO, {
                    ...item,
                    modulos: new Map() // Evita duplicação de módulos
                });
            }

            const usuario = usuariosAgrupados.get(item.IDUSUARIO);
            const modulosAcesso = [
                item.IDMODULOADMINISTRATIVO,
                item.IDMODULOGERENCIA,
                item.IDMODULOINFORMATICA,
                item.IDMODULOFINANCEIRO,
                item.IDMODULOMARKETING,
                item.IDMODULORH,
                item.IDMODULOCOMERCIAL,
                item.IDMODULOCOMPRAS,
                item.IDMODULOCONTABILIDADE,
                item.IDMODULOCOMPRASADM,
                item.IDMODULOEXPEDICAO,
                item.IDMODULOCONFERENCIACEGA,
                item.IDMODULOCADASTRO,
                item.IDMODULOETIQUETAGEM,
                item.IDMODULORESUMOVENDAS,
                item.IDMODULOVOUCHER,
                item.IDMODULOMALOTE,
                item.IDPERMISSAO,
                item.IDMODULOPROMOCAO
            ].filter(Boolean);

            for (const idModulo of modulosAcesso) {
                if (!usuario.modulos.has(idModulo)) {
                    const modulo = await getModuloPrincipal(idModulo);
                    if (!modulo[0]) continue;

                    const menuPai = await getMenuPai(modulo[0].IDMENU);
                    if (!menuPai[0]) continue;

                    usuario.modulos.set(idModulo, {
                        ...modulo[0],
                        menuPai: {
                            ...menuPai[0],
                            menuFilho: [] 
                        }
                    });
                }

              
                if (item.IDMENUFILHO) {
                    const modulo = usuario.modulos.get(idModulo);
                    const menuFilho = await getMenuFilho(modulo.menuPai.IDMENU, item.IDMENUFILHO);
                    if (menuFilho.length > 0) {
                        modulo.menuPai.menuFilho.push(...menuFilho);
                    }
                }
            }
        }

  

        const data = Array.from(usuariosAgrupados.values()).map(usuario => ({
            ...usuario,
            modulos: Array.from(usuario.modulos.values())
        }));

        return {
            rows: data.length,
            data
        };
    } catch (error) {
        console.error('Erro ao executar a consulta de perfil de usuário:', error);
        throw error;
    }
};

export const getMenuFilhos = async (idMenuPai, idMenuFilho) => {
    let query = `
       SELECT 
            ID, 
            DSNOME, 
            IDMENUPAI, 
            URL, 
            ALTERAR, 
            CRIAR, 
            VISUALIZAR, 
            N1,
            N2,
            N3,
            N4,
            ADMINISTRADOR
        FROM ${databaseSchema}.MENUFILHO
        WHERE 1 = ?
     
    `;

    
    const params = [1];
    
    if (idMenuPai) {
        query += ` AND IDMENUPAI = ?`;
        params.push(idMenuPai);
    }

    if(idMenuFilho) {
        query += ` AND ID IN (?)`;
        params.push(idMenuFilho);
    }

    const statement = await conn.prepare(query);
    const result = await statement.exec(params);
    
    if (!Array.isArray(result) || result.length === 0) return [];

    const data = result.map((item, index) => ({
        ID: item.ID,
        DSNOME: item.DSNOME,
        IDMENUPAI: item.IDMENUPAI,
        URL: item.URL,
        ALTERAR: item.ALTERAR,
        CRIAR: item.CRIAR,
        VISUALIZAR: item.VISUALIZAR,
        N1: item.N1,
        N2: item.N2,
        N3: item.N3,
        N4: item.N4,
        ADMINISTRADOR: item.ADMINISTRADOR
    }))

    return data;
}

export const getPerfilMenuFilho = async (idUsuario, idMenuFilho, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 500;
        const offset = (page - 1) * pageSize;

        let query = `
              SELECT 
                IDPERFIL,
                IDUSUARIO,
                IDMENU,
                DSPERFIL, 
                CRIAR, 
                ALTERAR, 
                STATIVO, 
                IDPERFILUSUARIO, 
                IDMODULO, 
                IDMODULOADMINISTRATIVO, 
                IDMODULOCOMERCIAL, 
                IDMODULOCONTABILIDADE, 
                IDMODULOFINANCEIRO, 
                IDMODULOGERENCIA, 
                IDMODULOINFORMATICA, 
                IDMODULOMARKETING, 
                IDMODULOCOMPRAS, 
                IDMODULOCADASTRO, 
                IDMODULOEXPEDICAO, 
                IDMODULOCOMPRASADM, 
                IDMODULOETIQUETAGEM, 
                IDMODULOCONFERENCIACEGA, 
                IDMODULOVOUCHER, 
                IDMODULOMALOTE, 
                IDMODULORH, 
                IDUSERULTIMAALTERACAO, 
                IDPERMISSAO, 
                IDMODULORESUMOVENDAS, 
                ADMINISTRADOR, 
                N4, 
                N3, 
                N2, 
                N1,
                IDMENUFILHO
            FROM ${databaseSchema}.PERFILUSUARIOMENU 
            WHERE 1 = ?
             
        `;

        const params = [1];

        if(idUsuario) {
            query += ` AND IDUSUARIO = ?`;
            params.push(idUsuario);
        }

        if(idMenuFilho) {
            query += ` AND IDMENUFILHO = ?`;
            params.push(idMenuFilho);
        }

        query += ` ORDER BY IDUSUARIO, IDMENUFILHO`;
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        if (!Array.isArray(result) || result.length === 0) return [];

        const data = await Promise.all(result.map(async (item) => {
            const modulosAcesso = [ 
                item.IDMODULOADMINISTRATIVO,
                item.IDMODULOGERENCIA,
                item.IDMODULOINFORMATICA,
                item.IDMODULOFINANCEIRO,
                item.IDMODULOMARKETING,
                item.IDMODULORH,
                item.IDMODULOCOMERCIAL,
                item.IDMODULOCOMPRAS,
                item.IDMODULOCONTABILIDADE,
                item.IDMODULOCOMPRASADM,
                item.IDMODULOEXPEDICAO,
                item.IDMODULOCONFERENCIACEGA,
                item.IDMODULOCADASTRO,
                item.IDMODULOETIQUETAGEM,
                item.IDOMODULORESUMOVENDAS,
                item.IDMODULOVOUCHER,
                item.IDMODULOMALOTE,
                item.IDPERMISSAO
            ].filter(Boolean)

            const modulosPrincipais = await Promise.all(
                modulosAcesso.map(async (idModulo) => {
                    const modulo = await getModuloPrincipal(idModulo)

                    if(!modulo[0]) return null;

                    const menuPai = await getMenuPai(modulo[0].IDMENU)
   
                    if(!menuPai[0]) return {...modulo[0], menuPai: null};
                    const menuFilho = menuPai[0] ? await getMenuFilhos(menuPai[0].IDMENU, idMenuFilho) : [];

                    return {
                        ...modulo[0],
                        menuPai: {
                            ...menuPai[0],
                            menuFilho: menuFilho || [],
                        }
                    }
                })
            )
            
            return {
                ...item,
                modulos: modulosPrincipais.filter(Boolean)
            };
        }));
        
        return {
            rows: result.length,
            data: data
        };
    } catch (error) {
        console.error('Erro ao executar a consulta de perfil de menu filho 2:', error);
        throw error;
    }
};

export const getPerfil = async (idPerfil, page, pageSize) => {
    try {
        page = page && !isNaN(page) ? parseInt(page) : 1;
        pageSize = pageSize && !isNaN(pageSize) ? parseInt(pageSize) : 500;
        const offset = (page - 1) * pageSize;

        let query = `
              SELECT 
                IDPERFIL,
                IDUSUARIO,
                IDMENU,
                DSPERFIL, 
                CRIAR, 
                ALTERAR, 
                STATIVO, 
                IDPERFILUSUARIO, 
                IDMODULO, 
                IDMODULOADMINISTRATIVO, 
                IDMODULOCOMERCIAL, 
                IDMODULOCONTABILIDADE, 
                IDMODULOFINANCEIRO, 
                IDMODULOGERENCIA, 
                IDMODULOINFORMATICA, 
                IDMODULOMARKETING, 
                IDMODULOCOMPRAS, 
                IDMODULOCADASTRO, 
                IDMODULOEXPEDICAO, 
                IDMODULOCOMPRASADM, 
                IDMODULOETIQUETAGEM, 
                IDMODULOCONFERENCIACEGA, 
                IDMODULOVOUCHER, 
                IDMODULOMALOTE, 
                IDMODULORH, 
                IDUSERULTIMAALTERACAO, 
                IDPERMISSAO, 
                IDMODULORESUMOVENDAS, 
                ADMINISTRADOR, 
                N4, 
                N3, 
                N2, 
                N1,
                IDMENUFILHO
            FROM ${databaseSchema}.PERFILUSUARIOMENU 
            WHERE 1 = ?
             
        `;

        const params = [1];

        if(idPerfil) {
            query += ` AND IDPERFIL = ?`;
            params.push(idPerfil);
        }

        query += ` ORDER BY IDUSUARIO, IDMENUFILHO`;
        query += ` LIMIT ? OFFSET ?`;
        params.push(pageSize, offset);
        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        if (!Array.isArray(result) || result.length === 0) return [];

        return {
            rows: result.length,
            data: result
        };
    } catch (error) {
        console.error('Erro ao executar a consulta de perfil:', error);
        throw error;
    }
};


export const updateMenuFilho = async (dados) => {
    try {
        for (const item of dados) {
            const {
                IDUSUARIO,
                CRIAR,
                ALTERAR,
                STATIVO,
                DATAULTIMAALTERACAO,
                DATA_CRIACAO,
                IDMODULO,
                IDMODULOADMINISTRATIVO,
                IDMODULOCOMERCIAL,
                IDMODULOCONTABILIDADE,
                IDMODULOFINANCEIRO,
                IDMODULOGERENCIA,
                IDMODULOINFORMATICA,
                IDMODULOMARKETING,
                IDMODULOCOMPRAS,
                IDMODULOCADASTRO,
                IDMODULOEXPEDICAO,
                IDMODULOCOMPRASADM,
                IDMODULOETIQUETAGEM,
                IDMODULOCONFERENCIACEGA,
                IDMODULOVOUCHER,
                IDMODULOMALOTE,
                IDMODULORH,
                IDUSERULTIMAALTERACAO,
                IDPERMISSAO,
                IDMODULORESUMOVENDAS,
                ADMINISTRADOR,
                N4,
                N3,
                N2,
                N1,
                IDMENU,
                IDMENUFILHO,
            } = item;

            const menuFilhos = Array.isArray(IDMENUFILHO) ? IDMENUFILHO : [IDMENUFILHO];

            for (const menuFilho of menuFilhos) {
                if (IDUSUARIO == null || menuFilho == null) {
                    console.warn('⚠️ Dados inválidos: IDUSUARIO ou IDMENUFILHO ausente', { IDUSUARIO, menuFilho });
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
                    UPDATE ${databaseSchema}.PERFILUSUARIOMENU SET
                `;
                const params = [];

                if (IDMODULO) {
                    updateQuery += `IDMODULO = ?, `;
                    params.push(IDMODULO);
                }

                if (IDMODULOADMINISTRATIVO) {
                    updateQuery += `IDMODULOADMINISTRATIVO = ?, `;
                    params.push(IDMODULOADMINISTRATIVO);
                }

                if (IDMODULOCOMERCIAL) {
                    updateQuery += `IDMODULOCOMERCIAL = ?, `;
                    params.push(IDMODULOCOMERCIAL);
                }

                if (IDMODULOCONTABILIDADE) {
                    updateQuery += `IDMODULOCONTABILIDADE = ?, `;
                    params.push(IDMODULOCONTABILIDADE);
                }

                if (IDMODULOFINANCEIRO) {
                    updateQuery += `IDMODULOFINANCEIRO = ?, `;
                    params.push(IDMODULOFINANCEIRO);
                }

                if (IDMODULOGERENCIA) {
                    updateQuery += `IDMODULOGERENCIA = ?, `;
                    params.push(IDMODULOGERENCIA);
                }

                if (IDMODULOINFORMATICA) {
                    updateQuery += `IDMODULOINFORMATICA = ?, `;
                    params.push(IDMODULOINFORMATICA);
                }

                if (IDMODULOMARKETING) {
                    updateQuery += `IDMODULOMARKETING = ?, `;
                    params.push(IDMODULOMARKETING);
                }

                if (IDMODULOCOMPRAS) {
                    updateQuery += `IDMODULOCOMPRAS = ?, `;
                    params.push(IDMODULOCOMPRAS);
                }

                if (IDMODULOCADASTRO) {
                    updateQuery += `IDMODULOCADASTRO = ?, `;
                    params.push(IDMODULOCADASTRO);
                }

                if (IDMODULOEXPEDICAO) {
                    updateQuery += `IDMODULOEXPEDICAO = ?, `;
                    params.push(IDMODULOEXPEDICAO);
                }

                if (IDMODULOCOMPRASADM) {
                    updateQuery += `IDMODULOCOMPRASADM = ?, `;
                    params.push(IDMODULOCOMPRASADM);
                }

                if (IDMODULOETIQUETAGEM) {
                    updateQuery += `IDMODULOETIQUETAGEM = ?, `;
                    params.push(IDMODULOETIQUETAGEM);
                }

                if (IDMODULOCONFERENCIACEGA) {
                    updateQuery += `IDMODULOCONFERENCIACEGA = ?, `;
                    params.push(IDMODULOCONFERENCIACEGA);
                }

                if (IDMODULOVOUCHER) {
                    updateQuery += `IDMODULOVOUCHER = ?, `;
                    params.push(IDMODULOVOUCHER);
                }

                if (IDMODULOMALOTE) {
                    updateQuery += `IDMODULOMALOTE = ?, `;
                    params.push(IDMODULOMALOTE);
                }

                if (IDMODULORH) {
                    updateQuery += `IDMODULORH = ?, `;
                    params.push(IDMODULORH);
                }

                if (IDPERMISSAO) {
                    updateQuery += `IDPERMISSAO = ?, `;
                    params.push(IDPERMISSAO);
                }

                if (IDMODULORESUMOVENDAS) {
                    updateQuery += `IDMODULORESUMOVENDAS = ?, `;
                    params.push(IDMODULORESUMOVENDAS);
                }

                if (IDMENU) {
                    updateQuery += `IDMENU = ?, `;
                    params.push(IDMENU);
                }

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

                if (IDUSERULTIMAALTERACAO) {
                    updateQuery += `IDUSERULTIMAALTERACAO = ?, `;
                    params.push(IDUSERULTIMAALTERACAO);
                }

                // Adiciona a cláusula WHERE
                updateQuery = updateQuery.replace(/, $/, '');
                updateQuery += `, DATAULTIMAALTERACAO = CURRENT_TIMESTAMP WHERE IDUSUARIO = ? AND IDMENUFILHO = ?`;
                params.push(IDUSUARIO, menuFilho);
               
                const statement = await conn.prepare(updateQuery);
                await statement.exec(params);
              
                } else {
                    const insertQuery = `
                        INSERT INTO ${databaseSchema}.PERFILUSUARIOMENU (
                            IDUSUARIO, 
                            IDMODULO, 
                            IDMODULOADMINISTRATIVO,
                            IDMODULOCOMERCIAL,
                            IDMODULOCONTABILIDADE,
                            IDMODULOFINANCEIRO,
                            IDMODULOGERENCIA,
                            IDMODULOINFORMATICA,
                            IDMODULOMARKETING,
                            IDMODULOCOMPRAS,
                            IDMODULOCADASTRO,
                            IDMODULOEXPEDICAO,
                            IDMODULOCOMPRASADM,
                            IDMODULOETIQUETAGEM,
                            IDMODULOCONFERENCIACEGA,
                            IDMODULOVOUCHER,
                            IDMODULOMALOTE,
                            IDMODULORH,
                            IDUSERULTIMAALTERACAO,
                            IDPERMISSAO,
                            IDMODULORESUMOVENDAS,
                            IDMENU, 
                            IDMENUFILHO,
                            CRIAR, 
                            ALTERAR, 
                            ADMINISTRADOR,
                            N1, 
                            N2, 
                            N3, 
                            N4
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    await conn.exec(insertQuery, [
                        IDUSUARIO,
                        IDMODULO,
                        IDMODULOADMINISTRATIVO,
                        IDMODULOCOMERCIAL,
                        IDMODULOCONTABILIDADE,
                        IDMODULOFINANCEIRO,
                        IDMODULOGERENCIA,
                        IDMODULOINFORMATICA,
                        IDMODULOMARKETING,
                        IDMODULOCOMPRAS,
                        IDMODULOCADASTRO,
                        IDMODULOEXPEDICAO,
                        IDMODULOCOMPRASADM,
                        IDMODULOETIQUETAGEM,
                        IDMODULOCONFERENCIACEGA,
                        IDMODULOVOUCHER,
                        IDMODULOMALOTE,
                        IDMODULORH,
                        IDUSERULTIMAALTERACAO,
                        IDPERMISSAO,
                        IDMODULORESUMOVENDAS,
                        IDMENU,
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
                if (IDUSUARIO == null || menuFilho == null) {
                    console.warn('⚠️ Dados inválidos: IDUSUARIO ou IDMENUFILHO ausente', { IDUSUARIO, menuFilho });
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
                updateQuery = updateQuery.replace(/, $/, '');
                updateQuery += `, IDMENUFILHO = ?`;
                params.push(IDUSUARIO, menuFilho);
               
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

export const updatePerfilUsuarioMenu = async (dados, idModulo, idUsuario, idMenuPai) => {

    try {

        for (const item of dados) {
            const perfil = item.perfilUsuario;
            const {
                IDMODULOADMINISTRATIVO,
                IDMODULOCOMERCIAL,
                IDMODULOCONTABILIDADE,
                IDMODULOFINANCEIRO,
                IDMODULOGERENCIA,
                IDMODULOINFORMATICA,
                IDMODULOMARKETING,
                IDMODULOCOMPRAS,
                IDMODULOCADASTRO,
                IDMODULOEXPEDICAO,
                IDMODULOCOMPRASADM,
                IDMODULOETIQUETAGEM,
                IDMODULOCONFERENCIACEGA,
                IDMODULOVOUCHER,
                IDMODULOMALOTE,
                IDMODULORH,
                IDPERMISSAO,
                IDMODULORESUMOVENDAS,
                IDUSERULTIMAALTERACAO
            } = perfil;

            let queryPerfilUsuarioMenu = `
                UPDATE ${databaseSchema}.PERFILUSUARIOMENU SET
            `;

            const params = [];

            if (IDMODULOADMINISTRATIVO) {
                queryPerfilUsuarioMenu += `IDMODULOADMINISTRATIVO = ?, `;
                params.push(IDMODULOADMINISTRATIVO);
            }

            if (IDMODULOCOMERCIAL) {
                queryPerfilUsuarioMenu += `IDMODULOCOMERCIAL = ?, `;
                params.push(IDMODULOCOMERCIAL);
            }

            if (IDMODULOCONTABILIDADE) {
                queryPerfilUsuarioMenu += `IDMODULOCONTABILIDADE = ?, `;
                params.push(IDMODULOCONTABILIDADE);
            }

            if (IDMODULOFINANCEIRO) {
                queryPerfilUsuarioMenu += `IDMODULOFINANCEIRO = ?, `;
                params.push(IDMODULOFINANCEIRO);
            }

            if (IDMODULOGERENCIA) {
                queryPerfilUsuarioMenu += `IDMODULOGERENCIA = ?, `;
                params.push(IDMODULOGERENCIA);
            }

            if (IDMODULOINFORMATICA) {
                queryPerfilUsuarioMenu += `IDMODULOINFORMATICA = ?, `;
                params.push(IDMODULOINFORMATICA);
            }

            if (IDMODULOMARKETING) {
                queryPerfilUsuarioMenu += `IDMODULOMARKETING = ?, `;
                params.push(IDMODULOMARKETING);
            }

            if (IDMODULOCOMPRAS) {
                queryPerfilUsuarioMenu += `IDMODULOCOMPRAS = ?, `;
                params.push(IDMODULOCOMPRAS);
            }

            if (IDMODULOCADASTRO) {
                queryPerfilUsuarioMenu += `IDMODULOCADASTRO = ?, `;
                params.push(IDMODULOCADASTRO);
            }

            if (IDMODULOEXPEDICAO) {
                queryPerfilUsuarioMenu += `IDMODULOEXPEDICAO = ?, `;
                params.push(IDMODULOEXPEDICAO);
            }

            if (IDMODULOCOMPRASADM) {
                queryPerfilUsuarioMenu += `IDMODULOCOMPRASADM = ?, `;
                params.push(IDMODULOCOMPRASADM);
            }

            if (IDMODULOETIQUETAGEM) {
                queryPerfilUsuarioMenu += `IDMODULOETIQUETAGEM = ?, `;
                params.push(IDMODULOETIQUETAGEM);
            }

            if (IDMODULOCONFERENCIACEGA) {
                queryPerfilUsuarioMenu += `IDMODULOCONFERENCIACEGA = ?, `;
                params.push(IDMODULOCONFERENCIACEGA);
            }

            if (IDMODULOVOUCHER) {
                queryPerfilUsuarioMenu += `IDMODULOVOUCHER = ?, `;
                params.push(IDMODULOVOUCHER);
            }

            if (IDMODULOMALOTE) {
                queryPerfilUsuarioMenu += `IDMODULOMALOTE = ?, `;
                params.push(IDMODULOMALOTE);
            }

            if (IDMODULORH) {
                queryPerfilUsuarioMenu += `IDMODULORH = ?, `;
                params.push(IDMODULORH);
            }

            if (IDPERMISSAO) {
                queryPerfilUsuarioMenu += `IDPERMISSAO = ?, `;
                params.push(IDPERMISSAO);
            }

            if (IDMODULORESUMOVENDAS) {
                queryPerfilUsuarioMenu += `IDMODULORESUMOVENDAS = ?, `;
                params.push(IDMODULORESUMOVENDAS);
            }

            queryPerfilUsuarioMenu += `
                IDUSERULTIMAALTERACAO = ?,
                DATAULTIMAALTERACAO = CURRENT_TIMESTAMP, 
                WHERE IDUSUARIO = ?
            `;

            params.push(IDUSERULTIMAALTERACAO);
            params.push(idUsuario); // IDFUNCIONARIO
            // console.log(params, 'params');
            queryPerfilUsuarioMenu = queryPerfilUsuarioMenu.replace(/,\s*WHERE/, ' WHERE');
            const statementPerfilUsuarioMenu = await conn.prepare(queryPerfilUsuarioMenu);
            await statementPerfilUsuarioMenu.exec(params);

        }


        const atualizarMenuFilho = await updateMenuFilho(dados.map(item => ({
            ...item.putMenuFilhoUsuario,
            IDUSERULTIMAALTERACAO: item.perfilUsuario.IDUSERULTIMAALTERACAO,
        })));

        if (!atualizarMenuFilho) {
            throw new Error('Erro ao atualizar o menu filho.');
        }

        await conn.commit();
        console.log('Dados salvos com sucesso nas tabelas PERFILUSUARIOMENU e MENUFILHO.');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        throw error;
    }
};

export const getModulos = async () => {
    try {


        const query = `
          SELECT ID, DSMODULO, IDPERFIL, IDMENU, NOME
            FROM ${databaseSchema}.MODULOPRINCIPAL WHERE  1 = ?
            ORDER BY ID

    `;
        const params = [1];

        // query += ' ORDER BY ID';

        const statement = await conn.prepare(query);
        const result = await statement.exec(params);

        return {
            rows: result.length,
            data: result
        };

    } catch (error) {
        console.error('Erro ao executar a consulta de módulos:', error);
        throw error;
    }
};

export const updateModulo = async (dados) => {
    try {

        const query = `
            UPDATE "${databaseSchema}"."MODULO" SET 
            "IDMODULO" = ?, 
            "DSMODULO" = ?
            WHERE "IDMODULO" = ?
        `;

        const statement = await conn.prepare(query);

        for (const registro of dados) {

            const params = [
                registro.IDMODULO,
                registro.DSMODULO,
            ]
            await statement.exec(params);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Modulo atualizado com sucesso'
        }
    } catch (error) {
        console.error('Erro ao executar a atualização do Modulo:', error);
        throw error;
    }
}

export const createModulo = async (dados) => {
    try {
        const query = `
            INSERT INTO "${databaseSchema}"."MODULO" 
            (
                "IDMODULO", 
                "DSMODULO"
            )
            VALUES (?, ?)
        `;

        const statement = await conn.prepare(query);

        for (const registro of dados) {
            // Gera o próximo IDMODULO, caso necessário
            const idQuery = `SELECT IFNULL(MAX(TO_INT("IDMODULO")), 0) + 1 AS novoId FROM "${databaseSchema}"."MODULO"`;
            const idResult = await conn.exec(idQuery);
            const novoId = idResult[0].NOVOID || registro.IDMODULO;

            const params = [
                novoId,  // IDMODULO gerado ou o fornecido em `registro.IDMODULO`
                registro.DSMODULO
            ];

            await statement.exec(params);
        }

        await conn.commit();
        return {
            status: 'success',
            message: 'Módulo(s) atualizado(s) com sucesso'
        };
    } catch (error) {
        console.error('Erro ao executar a atualização do Módulo:', error);
        throw error;
    } finally {
        conn.close();
    }
}




// SELECT DISTINCT
// mp.ID AS ID_MODULO,
// mp.DSMODULO,
// mp.IDPERFIL,
// p.IDFUNCIONARIO,
// mp.IDMENU AS ID_MENU_PAI,
// mp.DSMODULO AS MENU_PAI,
// mp.IDPERFIL AS ID_PERFIL,
// pai.DSMENU AS NOME_MENU_PAI,
// filho.ID AS ID_MENU_FILHO,
// filho.DSNOME AS NOME_MENU_FILHO,
// filho.URL AS URL_MENU_FILHO
// FROM QUALITY_CONC_TST.PERFILUSUARIOMENU p
// JOIN QUALITY_CONC_TST.MODULOPRINCIPAL mp
// ON mp.ID IN (
//     p.IDMODULO,
//     p.IDMODULOADMINISTRATIVO,
//     p.IDMODULOCOMERCIAL,
//     p.IDMODULOCONTABILIDADE,
//     p.IDMODULOFINANCEIRO,
//     p.IDMODULOGERENCIA,
//     p.IDMODULOINFORMATICA,
//     p.IDMODULOMARKETING,
//     p.IDMODULOCOMPRAS,
//     p.IDMODULOCADASTRO,
//     p.IDMODULOEXPEDICAO,
//     p.IDMODULOCOMPRASADM,
//     p.IDMODULOETIQUETAGEM,
//     p.IDMODULOCONFERENCIACEGA,
//     p.IDMODULOVOUCHER,
//     p.IDMODULOMALOTE,
//     p.IDMODULORH
// )
// JOIN QUALITY_CONC_TST.MENUPAI pai
// ON pai.IDMODULO = mp.ID
// JOIN QUALITY_CONC_TST.MENUFILHO filho
// ON filho.IDMENUPAI = pai.IDMENU
// WHERE  p.IDFUNCIONARIO = '30514'
// AND p.STATIVO = 'True'
// AND pai.STATIVO = 'True'


// QUAL A MELHOR MANEIRA DE FAZER A PERGUNTA A VOCÊ PRAA OBTER UMA MELHOR RESPOSTA E MAIS ACERTIVA
// MENUS SERÁ POR PERFIL E NIVEL DE PERFIL, QUE TERÁ 4 NIVEIS 1, 2, 3, 4
// a função gerente poderá ter nivéis diferentes
// exemplo o gerente poderá ter um lider de loja
// esse lider de loja poderá ver menus do gerente, mais não necessáriamente todos os menus do gerente
// pois a lógica não será linear
// ela poderá ser dinamica
// ignorando o perfilUsuario
// conforme a o nível de permissão dado anteriormente, conforme esta liberação aqui, e
// poderá alterar ou criar tbm conforme a liberação no menu, mesmo que o perfil deste usuário,
// não tenho o acesso, tradicional isso será tratado como exceção

// ASSIM ESTA AS TABELAS DO BANCO DE DADOS ONDE ESTAO AS INFORMAÇÕES DOS MODULOS E MENUS E PERFILUSUARIO
// SELECT ID, DSMODULO, IDPERFIL, IDMENU, NOME FROM QUALITY_CONC_TST.MODULOPRINCIPAL;

// SELECT IDMENU, STATIVO, IDMODULO, DSMENU FROM QUALITY_CONC_TST.MENUPAI;

// SELECT ID, DSNOME, IDMENUPAI, URL, ALTERAR, CRIAR, VISUALIZAR FROM QUALITY_CONC_TST.MENUFILHO;

// SELECT IDPERFIL, IDUSUARIO, DSPERFIL, CRIAR, ALTERAR, STATIVO, DATAULTIMAALTERACAO, DATA_CRIACAO, IDPERFILUSUARIO, IDMODULO, IDMODULOADMINISTRATIVO, IDMODULOCOMERCIAL, IDMODULOCONTABILIDADE, IDMODULOFINANCEIRO, IDMODULOGERENCIA, IDMODULOINFORMATICA, IDMODULOMARKETING, IDMODULOCOMPRAS, IDMODULOCADASTRO, IDMODULOEXPEDICAO, IDMODULOCOMPRASADM, IDMODULOETIQUETAGEM, IDMODULOCONFERENCIACEGA, IDMODULOVOUCHER, IDMODULOMALOTE, IDMODULORH, IDFUNCIONARIO, IDPERMISSAO, IDMODULORESUMOVENDAS FROM QUALITY_CONC_TST.PERFILUSUARIOMENU;


// eu tenho estas 4 tabelas e criei api em nodejs para consumir os dados, preciso salvar as permissoes de acesso,
// para o usuario, porém não sei como fazer isso, pois o usuario pode ter acesso a mais de um modulo e mais de um menu, e o mesmo menu pode ter mais de um nivel de permissão, como posso fazer isso?

// assim esta o meu codigo em nodejs 
// SELECT ID, DSMODULO, IDPERFIL, IDMENU, NOME FROM QUALITY_CONC_TST.MODULOPRINCIPAL;

// SELECT IDMENU, STATIVO, IDMODULO, DSMENU FROM QUALITY_CONC_TST.MENUPAI;

// SELECT ID, DSNOME, IDMENUPAI, URL, N1, N2, N3, N4, ADMINISTRADOR, VISUALIZAR, ALTERAR, CRIAR FROM QUALITY_CONC_TST.MENUFILHO;

// SELECT IDPERFIL, IDUSUARIO, DSPERFIL, CRIAR, ALTERAR, STATIVO, DATAULTIMAALTERACAO, DATA_CRIACAO, IDPERFILUSUARIO, IDMODULO, IDMODULOADMINISTRATIVO, IDMODULOCOMERCIAL, IDMODULOCONTABILIDADE, IDMODULOFINANCEIRO, IDMODULOGERENCIA, IDMODULOINFORMATICA, IDMODULOMARKETING, IDMODULOCOMPRAS, IDMODULOCADASTRO, IDMODULOEXPEDICAO, IDMODULOCOMPRASADM, IDMODULOETIQUETAGEM, IDMODULOCONFERENCIACEGA, IDMODULOVOUCHER, IDMODULOMALOTE, IDMODULORH, IDUSERULTIMAALTERACAO, IDPERMISSAO, IDMODULORESUMOVENDAS
// FROM QUALITY_CONC_TST.PERFILUSUARIOMENU;

