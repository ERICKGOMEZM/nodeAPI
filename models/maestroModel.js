//model/maestroModel.js

import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const Maestro = {
  create: async (nombre, apellido_paterno, apellido_materno, edad, matricula, correo, contraseña) => {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar en la base de datos
    const result = await pool.query(
      'INSERT INTO maestros (nombre, apellido_paterno, apellido_materno, edad, matricula, correo, contraseña, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [nombre, apellido_paterno, apellido_materno, edad, matricula, correo, hashedPassword, 2]
    );

    return result.rows[0];
  },

  findByEmail: async (correo) => {
    const result = await pool.query('SELECT * FROM maestros WHERE correo = $1', [correo]);
    return result.rows[0];
  },

  authenticate: async (correo, contraseña) => {
    const result = await pool.query('SELECT * FROM maestros WHERE correo = $1', [correo]);
    const maestro = result.rows[0];

    // Comparar contraseña
    if (maestro && await bcrypt.compare(contraseña, maestro.contraseña)) {
      delete maestro.contraseña; // No devolver la contraseña
      return maestro;
    }
    return null;
  },

   // Método para asignar un taller a un maestro
   assignTaller: async (id_maestro, id_taller) => {
    const result = await pool.query(
      'INSERT INTO maestro_taller (id_maestro, id_taller) VALUES ($1, $2) RETURNING *',
      [id_maestro, id_taller]
    );
    return result.rows[0];
  },
  // (El resto del modelo ya está incluido en tu código actual)
};

const MaestroTaller = {
  // Verificar si el taller ya está asignado
  findByTallerId: async (id_taller) => {
    const result = await pool.query('SELECT * FROM maestro_taller WHERE id_taller = $1', [id_taller]);
    return result.rows[0]; // Si existe un maestro asignado, se retorna el primer resultado
  },
};

export { Maestro, MaestroTaller };
