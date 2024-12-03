// routes/talleresRoutes.js
import express from 'express';
import { getTalleres } from '../controllers/tallerController.js';

const router = express.Router();

router.get('/talleres', getTalleres);

export default router;




