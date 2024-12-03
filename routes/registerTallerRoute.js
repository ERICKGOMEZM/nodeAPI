// routes/registerTallerRoutes.js
import express from 'express';
import { registrarTallerYInformacionPadecimientoController } from '../controllers/registerTallerController.js';
import { obtenerPadecimientosController } from '../controllers/informacionPadecimientoController.js'; // Asegúrate de importar los controladores correctamente
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta protegida para registrar un taller
router.post('/register-taller', requireAuth, registrarTallerYInformacionPadecimientoController);

// Ruta para obtener todos los padecimientos registrados
router.get('/padecimientos', obtenerPadecimientosController);

export default router;
