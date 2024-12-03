// models/tallerModel.js
import pool from '../config/db.js';

export const obtenerTalleres = async () => {
    const result = await pool.query('SELECT * FROM talleres');
    return result.rows;
};

