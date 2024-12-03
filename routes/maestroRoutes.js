//routes/maestroRoutes.js

import express from 'express';
import { registerMaestro, loginMaestro, getMaestroById } from '../controllers/maestroController.js';

const router = express.Router();

// Ruta para registrar maestros
router.post('/register-maestro', registerMaestro);

// Ruta para el login
router.post('/login', loginMaestro);

// Agregar ruta para obtener los datos del maestro por ID
router.get('/maestro/:id_maestro', getMaestroById); // Ruta para obtener la información del maestro



export default router;

