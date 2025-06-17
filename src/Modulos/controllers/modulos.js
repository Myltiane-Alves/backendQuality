import axios from "axios";
import { createModulo, getModulos, getPerfilMenuFilho, updateModulo } from "../repositories/modulos.js";
import { getMenuUsuario } from "../Menus/repositories/menu.js";
import {  getSubMenuUsuario } from "../Menus/repositories/subMenu.js";
import 'dotenv/config';
const url = process.env.API_URL;

class ModulosControllers  {
     
     async getListaPerfilUsuario(req, res) {
        let { idUsuario, page, pageSize } = req.query;
            idUsuario = idUsuario ? idUsuario : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            // const response = await getPerfilUsuarioMenu(idUsuario, idModulo)
            const apiUrl = `${url}/api/perfilUsuario/perfilUsuarioMenu.xsjs?idUsuario=${idUsuario}&page=${page}&pageSize=${pageSize}`;
            const response = await axios.get(apiUrl);
            //  console.log(response.data); // Retorna
            return res.json(response.data); // Retorna
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
            // const response = await getPerfilMenuFilho(idUsuario, idMenuFilho)
            const apiUrl = `${url}/api/perfilUsuario/menus-usuario-exececao.xsjs?idUsuario=${idUsuario}&idMenuFilho=${idMenuFilho}`;
            const response = await axios.get(apiUrl);
        //    return console.log(response.data);
            
            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

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
            const response = await axios.get(`http://164.152.245.77:8000/quality/concentrador_homologacao/api/perfilUsuario/perfilUsuarioMenu.xsjs?idMenu=${idMenu}&idModulo=${idModulo}&dsModulo=${dsModulo}`)

            // const response = await getMenuUsuario(idMenu, idModulo, dsModulo);
            return res.json(response.data); // Retorna
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
