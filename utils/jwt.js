// utils/jwt.js

import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    // Verificar si es un alumno o un maestro
    const payload = user.id_alumno ? { // Si el usuario es un alumno
        id_alumno: user.id_alumno,
        correo: user.correo,
    } : { // Si el usuario es un maestro
        id_maestro: user.id_maestro,
        correo: user.correo,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Función para verificar el token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET); // Verificación del token
    } catch (error) {
        throw new Error('Token inválido');
    }
}


