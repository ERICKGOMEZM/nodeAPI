// models/userModel.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
  // Crear un nuevo usuario
  create: async (nombre, correo, matricula, contraseña, edad, genero, apellido_paterno, apellido_materno) => {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
      `INSERT INTO alumnos 
        (nombre, correo, matricula, contraseña, edad, genero, apellido_paterno, apellido_materno, id_rol) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nombre, correo, matricula, hashedPassword, edad, genero, apellido_paterno, apellido_materno, 1]
    );

    return result.rows[0];
  },

  // Buscar un usuario por correo
  findByEmail: async (correo) => {
    const result = await pool.query('SELECT * FROM alumnos WHERE correo = $1', [correo]);
    return result.rows[0];
  },

  // Buscar un usuario por ID
  findById: async (id_alumno) => {
    const result = await pool.query('SELECT * FROM alumnos WHERE id_alumno = $1', [id_alumno]);
    return result.rows[0];
  },

  // Obtener los datos de los talleres relacionados con un alumno
  findAlumnoWithTalleres: async (id_alumno) => {
    const result = await pool.query(
      `SELECT 
        rt.id_register,
        rt.id_taller,
        t.nombre_taller AS taller,
        rt.id_cuatrimestre,
        c.nombre_cuatrimestre AS cuatrimestre,
        rt.id_carrera,
        ca.nombre_carrera AS carrera
      FROM 
        register_taller rt
      JOIN 
        talleres t ON rt.id_taller = t.id_taller
      JOIN 
        cuatrimestre c ON rt.id_cuatrimestre = c.id_cuatrimestre
      JOIN 
        carrera ca ON rt.id_carrera = ca.id_carrera
      WHERE 
        rt.id_alumno = $1`,
      [id_alumno]
    );

    return result.rows; // Retorna todos los registros relacionados al alumno
  },
};

export default User;
