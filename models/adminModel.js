import pool from '../config/db.js';

export const registrarAdministrador = async (nombre, correo, contraseña) => {
    const result = await pool.query(
        'INSERT INTO administradores (nombre, correo, contraseña, id_rol) VALUES ($1, $2, $3, $4) RETURNING id_admin, nombre, correo',
        [nombre, correo, contraseña, 3]
    );
    return result.rows[0];
};

// Función para obtener un administrador por correo
export const obtenerAdminPorCorreo = async (correo) => {
    const result = await pool.query(
        'SELECT * FROM administradores WHERE correo = $1',
        [correo]
    );
    return result.rows[0]; // Retorna el primer resultado o undefined si no encuentra
};
