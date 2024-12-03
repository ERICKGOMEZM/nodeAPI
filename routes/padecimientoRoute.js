import express from 'express';
import { obtenerPadecimientosController, registrarPadecimientoController } from '../controllers/informacionPadecimientoController.js';
import { requireAuth } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Obtener los tipos de padecimientos
router.get('/padecimientos', obtenerPadecimientosController);

// Registrar un padecimiento
router.post('/registrar-padecimiento', requireAuth, registrarPadecimientoController);

export default router;

