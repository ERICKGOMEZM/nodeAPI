

import pool from '../config/db.js';

// Registrar taller
export const registrarTaller = async (id_alumno, id_cuatrimestre, id_carrera, id_taller) => {
    try {
        const query = `
            INSERT INTO register_taller (id_alumno, id_cuatrimestre, id_carrera, id_taller)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [id_alumno, id_cuatrimestre, id_carrera, id_taller];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error al registrar en el taller:', error);
        throw new Error('Error al registrar en el taller');
    }
};

// Obtener todos los padecimientos registrados
export const obtenerPadecimientos = async () => {
    try {
        const result = await pool.query('SELECT * FROM padecimientos');
        return result.rows;
    } catch (error) {
        console.error('Error al obtener los padecimientos:', error);
        throw new Error('Error al obtener los padecimientos');
    }
};

// Verificar si existe un tipo de padecimiento
export const obtenerPadecimientoPorTipo = async (tipoPadecimiento) => {
    try {
        const result = await pool.query('SELECT * FROM padecimientos WHERE tipo_padecimiento = $1', [tipoPadecimiento]);
        return result.rows[0];
    } catch (error) {
        console.error(`Error al verificar tipo de padecimiento: ${tipoPadecimiento}`, error);
        console.log('ID del padecimiento:', padecimiento.id_padecimiento); // Agregar este log

        throw new Error(`Error al verificar tipo de padecimiento: ${tipoPadecimiento}`);
    }
};

// Registrar información del padecimiento
export const registrarInformacionPadecimiento = async (id_alumno, id_padecimiento, descripcion) => {
    try {
        const query = `
            INSERT INTO informacion_padecimiento (id_alumno, id_padecimiento, descripcion)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [id_alumno, id_padecimiento, descripcion];
        const result = await pool.query(query, values);
        return result.rows[0];  // Retorna el registro insertado
    } catch (error) {
        console.error('Error al registrar el padecimiento:', error);
        throw new Error('Error al registrar el padecimiento');
    }
};
