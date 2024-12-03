// routes/carreraRoutes.js
import express from 'express';
import { obtenerDatos } from '../controllers/carreraController.js';

const router = express.Router();

router.get('/carrera', obtenerDatos);

export default router;
