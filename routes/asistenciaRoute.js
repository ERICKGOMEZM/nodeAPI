import express from 'express';
import { registrarAsistencia } from '../controllers/asistenciaController.js';

const router = express.Router();

// Ruta para registrar la asistencia
router.post('/asistencia', registrarAsistencia);

export default router;
