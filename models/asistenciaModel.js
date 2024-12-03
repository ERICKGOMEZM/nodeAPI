import pool from '../config/db.js';

// Función para verificar si la asistencia ya está registrada
export const verificarAsistenciaExistente = async (idAlumno, idTaller, fecha) => {
    const result = await pool.query(
        'SELECT * FROM asistencia WHERE id_alumno = $1 AND id_taller = $2 AND fecha = $3',
        [idAlumno, idTaller, fecha]
    );
    return result.rows.length > 0;  // Retorna true si ya existe, false si no
};

// Función para guardar la asistencia
export const guardarAsistencia = async (idAlumno, idTaller, fecha, asistencia, justificacion) => {
    const result = await pool.query(
        'INSERT INTO asistencia (id_alumno, id_taller, fecha, asistencia, justificacion) VALUES ($1, $2, $3, $4, $5)',
        [idAlumno, idTaller, fecha, asistencia, justificacion]
    );
    return result.rows[0];
};
