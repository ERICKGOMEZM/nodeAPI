import express from 'express';
import { obtenerDatos } from '../controllers/datosTallerController.js'; // Importamos el controlador

const router = express.Router();

router.get('/datos-register-taller', obtenerDatos); // Ruta para obtener los datos de register_taller

export default router;
