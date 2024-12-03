import express from 'express';
import { registrarAdmin, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Ruta para registrar un administrador
router.post('/register-admin', registrarAdmin);

// Ruta para el login del administrador
router.post('/login-admin', loginAdmin);

export default router;
