import axios from "axios";
import { createCliente, getCliente,  updateCliente } from "../cliente/index.js";

let url = `http://164.152.245.77:8000/quality/concentrador`;

class GerenciaControllers {
    async getListaCliente(req, res) {
        let { idCliente, cpfoucnpj,  page, pageSize } = req.query;

        idCliente = idCliente ? idCliente : ''
        cpfoucnpj = cpfoucnpj ? cpfoucnpj : ''
        page = page ? page : ''
        pageSize = pageSize ? pageSize : ''
    
        try {
            const response = await getCliente(idCliente, cpfoucnpj,  page, pageSize)
    
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }

    async putListaCliente(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await putCliente(dados);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }
    async putCliente(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await updateCliente(dados);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    async postCliente(req, res) {
        try {
            const dados = Array.isArray(req.body) ? req.body : [req.body]; 
            const response = await createCliente(dados);
            return res.json(response);
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new GerenciaControllers();
