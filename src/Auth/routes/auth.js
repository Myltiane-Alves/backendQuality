import { Router } from 'express';
import AuthentiCationController from '../controllers/Auth.js';


const authRoutes = new Router();


authRoutes.post('/login', AuthentiCationController.login);

export default authRoutes;