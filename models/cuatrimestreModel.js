// models/cuatrimestreModel.js
import pool from '../config/db.js';

export const obtenerDatos = async () => {
    const result = await pool.query('SELECT * FROM cuatrimestre');
    return result.rows;  
};