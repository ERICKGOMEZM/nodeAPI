
//models/listaFutbolModel.js
import pool from '../config/db.js';

export const obtenerDatosRegisterTallerPorTallerFutbol = async (idTaller) => {
    const query = `
  SELECT 
    a.nombre AS alumno_name,
    a.apellido_paterno AS alumno_apellido_paterno,
    a.apellido_materno AS alumno_apellido_materno,
    c.nombre_carrera AS carrera_name,
    cu.nombre_cuatrimestre AS cuatrimestre_name,
    t.nombre_taller AS taller_name,
    ip.descripcion AS padecimiento_descripcion,  -- Agregamos el campo descripcion
    p.tipo_padecimiento AS padecimiento_name   -- Usamos tipo_padecimiento en lugar de nombre
  FROM 
    register_taller rt
  JOIN 
    alumnos a ON rt.id_alumno = a.id_alumno
  JOIN 
    carrera c ON rt.id_carrera = c.id_carrera
  JOIN 
    cuatrimestre cu ON rt.id_cuatrimestre = cu.id_cuatrimestre
  JOIN 
    talleres t ON rt.id_taller = t.id_taller
  LEFT JOIN 
    informacion_padecimiento ip ON a.id_alumno = ip.id_alumno
  LEFT JOIN 
    padecimientos p ON ip.id_padecimiento = p.id_padecimiento
  WHERE 
    rt.id_taller = $1;
`;
    const result = await pool.query(query, [idTaller]);
    return result.rows;
  };
  