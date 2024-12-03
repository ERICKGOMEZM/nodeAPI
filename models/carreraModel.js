// models/carreraModel.js
import pool from '../config/db.js';

export const obtenerDatos = async () => {
    const result = await pool.query('SELECT * FROM carrera');
    return result.rows;  
};