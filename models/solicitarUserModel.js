
import  pool from '../config/db.js';

findById: async (id) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
}