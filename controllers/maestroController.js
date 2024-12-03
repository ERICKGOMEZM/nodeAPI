//controllers/maestroController.js

import { Maestro, MaestroTaller } from '../models/maestroModel.js';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // Asegúrate de importar pool

export const registerMaestro = async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, edad, matricula, correo, contraseña, id_taller } = req.body;

  try {
    const parsedEdad = parseInt(edad, 10);
    if (isNaN(parsedEdad) || parsedEdad <= 0) {
      return res.status(400).json({ message: 'La edad debe ser un número válido y mayor a 0' });
    }

    if (!contraseña || contraseña.trim() === '') {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    const maestroExists = await Maestro.findByEmail(correo);
    if (maestroExists) {
      return res.status(400).json({ message: 'El maestro ya existe' });
    }

    // Verificar si el taller ya está asignado
    if (id_taller) {
      const tallerAsignado = await MaestroTaller.findByTallerId(id_taller);
      if (tallerAsignado) {
        return res.status(400).json({ message: 'Este taller ya está asignado a otro maestro' });
      }
    }

    const newMaestro = await Maestro.create(
      nombre,
      apellido_paterno,
      apellido_materno,
      parsedEdad,
      matricula,
      correo,
      contraseña
    );

    // Relacionar maestro con el taller
    if (id_taller) {
      await Maestro.assignTaller(newMaestro.id_maestro, id_taller);
    }

    res.status(201).json({
      message: 'Maestro registrado con éxito y asignado al taller',
      maestro: newMaestro,
    });
  } catch (error) {
    console.error('Error en el controlador registerMaestro:', error.message);
    res.status(500).json({
      message: 'Error al registrar al maestro o asignar taller',
      error: error.message,
    });
  }
};

export const loginMaestro = async (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificar que el correo y la contraseña están presentes
  if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  try {
      // Autenticación del maestro
      const maestro = await Maestro.authenticate(correo, contraseña);

      if (!maestro) {
          return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Si existe un taller asignado, obtener los detalles del taller
      let taller = null;
      if (maestro.id_maestro) {
          const tallerResult = await pool.query(
              'SELECT * FROM talleres WHERE id_taller IN (SELECT id_taller FROM maestro_taller WHERE id_maestro = $1)', 
              [maestro.id_maestro]
          );
          taller = tallerResult.rows[0];  // Detalles del taller asignado
      }

      // Crear el token JWT con los detalles necesarios
      const token = jwt.sign({ 
          id_maestro: maestro.id_maestro, 
          nombre: maestro.nombre, 
          correo: maestro.correo 
      }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
          message: 'Inicio de sesión exitoso',
          maestro: { 
              id: maestro.id_maestro, 
              nombre: maestro.nombre, 
              correo: maestro.correo,
              taller: taller ? taller.nombre_taller : null, // Si existe un taller asignado, incluirlo en la respuesta 
          },
          token,
      });
  } catch (error) {
      console.error('Error en el controlador loginMaestro:', error.message);
      return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};



// Obtener la información del maestro y su taller asignado
export const getMaestroById = async (req, res) => {
  const { id_maestro } = req.params; // Obtener el id del maestro de los parámetros de la URL

  try {
    const result = await pool.query(`
      SELECT maestros.id_maestro, maestros.nombre, maestros.apellido_paterno, maestros.apellido_materno, maestros.correo, talleres.nombre_taller
      FROM maestros
      JOIN maestro_taller ON maestros.id_maestro = maestro_taller.id_maestro
      JOIN talleres ON maestro_taller.id_taller = talleres.id_taller
      WHERE maestros.id_maestro = $1
    `, [id_maestro]);

    const maestro = result.rows[0];

    if (!maestro) {
      return res.status(404).json({ message: 'Maestro no encontrado' });
    }

    res.status(200).json(maestro); // Retornar los datos del maestro con el taller
  } catch (error) {
    console.error('Error al obtener la información del maestro:', error.message);
    res.status(500).json({ message: 'Error al obtener los datos del maestro', error: error.message });
  }
};
