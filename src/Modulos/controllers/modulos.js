import axios from "axios";
import { createModulo, getModuloPrincipal, getModulos, getPerfil, getPerfilMenuFilho, getPerfilUsuarioMenu, updateMenuFilho, updateModulo, updatePerfilUsuarioMenu } from "../repositories/modulos.js";
import {  updatePerfil } from "../Menus/repositories/menu.js";
import {  getSubMenuUsuario } from "../Menus/repositories/subMenu.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;

class ModulosControllers  {

    async getListaPerfilUsuario(req, res) {
        let { idUsuario, idModulo } = req.query;
        idUsuario = idUsuario ? idUsuario : '';
        idModulo = idModulo ? idModulo : '';
        try {
            const response = await getPerfilUsuarioMenu(idUsuario, idModulo)
            // const response = await getPerfilMenuFilho(idUsuario)
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaMenusPorUsuario(req, res) {
        let { idUsuario, idMenuFilho } = req.query;
    
        idUsuario = idUsuario ? idUsuario : '';
        idMenuFilho = idMenuFilho ? idMenuFilho : '';
        try {
            const response = await getPerfilMenuFilho(idUsuario, idMenuFilho)
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async getListaModulos(req, res) {
        let { idUsuario } = req.query;
    
        idUsuario = idUsuario ? idUsuario : '';
        try {
            const response = await getModulos(idUsuario)
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    
  

    async getListaSubMenusUsuario(req, res) {
        let { idSubMenus, idMenu, idPerfil, idModulo, dsModulo } = req.query;
        idSubMenus = idSubMenus ? idSubMenus : '';
        idMenu = idMenu ? idMenu : '';
        idPerfil = idPerfil ? idPerfil : '';
        idModulo = idModulo ? idModulo : '';
        dsModulo = dsModulo ? dsModulo : '';
        try {   

            const response = await getSubMenuUsuario(idSubMenus, idMenu, idPerfil, idModulo, dsModulo);
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }
   
    async getListaPerfilPermissoes(req, res) {
        let {idPerfil, page, pageSize } = req.query;

        idPerfil = idPerfil ? idPerfil : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        try {   

            const response = await getPerfil(idPerfil, page, pageSize);
            return res.json(response); // Retorna
        } catch(error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        } 
    }

    async putPerfilUsuarioMenu(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            // console.log("dados", dados)  
            const response = await updateMenuFilho(dados)
            // const response = await updatePerfil(dados)
            // console.log("response", response)
            return res.json(response);
        } catch (error) {
            console.error("Erro no ModulosControllers.putPerfilUsuarioMenu: ", error);
            throw error;
        }
    }
    async putPerfilPermissoes(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            // console.log("dados", dados)
            const response = await updatePerfil(dados)
            // console.log("response", response)
            return res.json(response);
        } catch (error) {
            console.error("Erro no ModulosControllers. putPerfilPermissoesu: ", error);
            throw error;
        }
    }

    // async putPerfilPermissoes(req, res) {
    //     try {
    //         const dados = Array.isArray(req.body) ? req.body : [req.body]; 
    //         console.log("dados", JSON.stringify(dados, null, 2)); // Improved logging for better readability
    //         const response = await updatePerfil(dados);
    //         if (!response) {
    //             console.error("No response received from updatePerfil");
    //             return res.status(500).json({ error: "Failed to update perfil permissions" });
    //         }
    //         console.log("response", JSON.stringify(response, null, 2)); // Improved logging for better readability
    //         return res.json(response);
    //     } catch (error) {
    //         console.error("Erro no ModulosControllers.putPerfilPermissoes: ", error);
    //         return res.status(500).json({ error: "An error occurred while updating perfil permissions" });
    //     }
    // }


    async putModulo(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await updateModulo(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }


    async postModulo(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body];   
            const response = await createModulo(dados)
        
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
}

export default new ModulosControllers();


