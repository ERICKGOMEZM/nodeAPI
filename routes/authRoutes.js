
// routes/authRoutes.js
import express from 'express';
import { register, login, getUserProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Ruta protegida para enviar los datos al perfil
router.get('/profile/:id_alumno', requireAuth, getUserProfile); // Acceso solo con token válido

export default router;

