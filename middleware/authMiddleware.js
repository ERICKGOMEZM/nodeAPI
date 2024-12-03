//middleware/ authMiddleware.js

import { verifyToken } from '../utils/jwt.js';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No se proporcionó un token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token no válido o ausente' });
    }

    try {
        const user = verifyToken(token); // Decodifica el token
        req.user = user; // Guarda la información del usuario (ya sea alumno o maestro)
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(401).json({ message: 'Token no válido', error: error.message });
    }
};




    
