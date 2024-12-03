// routes/cuatrimestreRoutes.js
import express from 'express';
import { obtenerDatos } from '../controllers/cuatrimestreController.js';

const router = express.Router();

router.get('/cuatrimestre', obtenerDatos);

export default router;