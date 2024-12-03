//routes/listaFutbolRoute

import express from 'express';
import { obtenerDatosPorTaller } from '../controllers/listaFutbolController.js'; // Importa el controlador

const router = express.Router();

router.get('/datos-register-taller/:idTaller', obtenerDatosPorTaller); // Ruta que usa el parámetro idTaller

export default router;
