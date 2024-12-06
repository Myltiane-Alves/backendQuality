import axios from "axios";
import { createModulo, getModulos, updateModulo } from "../repositories/modulos.js";
import { getMenuUsuario } from "../Menus/repositories/menu.js";
import {  getSubMenuUsuario } from "../Menus/repositories/subMenu.js";
let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;

class ModulosControllers  {

    async getListaModulos(req, res) {
        let { idPerfil } = req.query;
    
        // Converte idPerfil para número ou array de números
        idPerfil = idPerfil ? (Array.isArray(idPerfil) ? idPerfil.map(Number) : Number(idPerfil)) : '';

    
        try {
            const response = await getModulos(idPerfil);
            return res.json(response); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
    
    async getListaMenusUsuario(req, res) {
        let { idMenu, idModulo, dsModulo } = req.query;
    
        idMenu = idMenu ? idMenu : '';
        idModulo = idModulo ? idModulo : '';
        dsModulo = dsModulo ? dsModulo : '';
        try {   

            const response = await getMenuUsuario(idMenu, idModulo, dsModulo);
            return res.json(response); // Retorna
        } catch(error) {
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