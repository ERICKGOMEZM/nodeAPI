import pool from '../config/db.js';

// Obtener todos los padecimientos registrados
export const obtenerPadecimientos = async () => {
    const result = await pool.query('SELECT * FROM padecimientos');
    return result.rows;
};

// Verificar si existe un tipo de padecimiento
export const obtenerPadecimientoPorTipo = async (tipoPadecimiento) => {
    const result = await pool.query('SELECT * FROM padecimientos WHERE tipo_padecimiento = $1', [tipoPadecimiento]);
    return result.rows[0];
};

export const registrarInformacionPadecimiento = async (id_alumno, id_padecimiento, descripcion) => {
    const query = `
        INSERT INTO informacion_padecimiento (id_alumno, id_padecimiento, descripcion)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [id_alumno, id_padecimiento, descripcion];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];  // Retorna el registro insertado
    } catch (error) {
        console.error('Error al registrar el padecimiento:', error);
        throw new Error('Error al registrar el padecimiento');
    }
};