import { registrarTaller } from '../models/registerTallerModel.js';
import pool from '../config/db.js';
import { obtenerPadecimientoPorTipo } from '../models/registerTallerModel.js';  // Para obtener el padecimiento por tipo

// Registrar taller y padecimiento
export const registrarTallerYInformacionPadecimientoController = async (req, res) => {
    try {
        const { cuatrimestre, carrera, taller, padecimiento, descripcion } = req.body;
        const id_alumno = req.user.id_alumno; // Tomamos el id_alumno del token (usuario autenticado)

        console.log('Datos recibidos en el backend:', req.body);

        if (!id_alumno) {
            return res.status(400).json({ message: 'Alumno no autenticado' });
        }

        // Verificar que los valores del taller estén correctamente enviados
        if (!cuatrimestre || !carrera || !taller) {
            return res.status(400).json({ message: 'Faltan datos del taller en la solicitud' });
        }

        // Consultar los ID de cuatrimestre, carrera y taller basados en los nombres
        const cuatrimestreQuery = await pool.query('SELECT id_cuatrimestre FROM cuatrimestre WHERE nombre_cuatrimestre = $1', [cuatrimestre]);
        const carreraQuery = await pool.query('SELECT id_carrera FROM carrera WHERE nombre_carrera = $1', [carrera]);
        const tallerQuery = await pool.query('SELECT id_taller FROM talleres WHERE nombre_taller = $1', [taller]);

        // Comprobar si los datos existen en las tablas
        if (cuatrimestreQuery.rows.length === 0 || carreraQuery.rows.length === 0 || tallerQuery.rows.length === 0) {
            return res.status(400).json({ message: 'Datos inválidos, uno de los valores no existe en la base de datos' });
        }

        const id_cuatrimestre = cuatrimestreQuery.rows[0].id_cuatrimestre;
        const id_carrera = carreraQuery.rows[0].id_carrera;
        const id_taller = tallerQuery.rows[0].id_taller;

        // Verificar si el alumno ya está registrado en este taller
        const checkIfAlreadyRegisteredInThisTaller = await pool.query(`
            SELECT * FROM register_taller 
            WHERE id_alumno = $1 AND id_taller = $2 AND id_cuatrimestre = $3 AND id_carrera = $4
        `, [id_alumno, id_taller, id_cuatrimestre, id_carrera]);

        if (checkIfAlreadyRegisteredInThisTaller.rows.length > 0) {
            return res.status(400).json({ message: 'El alumno ya está registrado en este taller' });
        }

        // Verificar si el alumno ya está registrado en cualquier taller (sin importar cuatrimestre ni carrera)
        const checkIfAlreadyRegistered = await pool.query(`SELECT * FROM register_taller WHERE id_alumno = $1`, [id_alumno]);

        if (checkIfAlreadyRegistered.rows.length > 0) {
            return res.status(400).json({ message: 'El alumno ya está registrado en un taller' });
        }

        // Registrar al alumno en el taller
        const resultTaller = await registrarTaller(id_alumno, id_cuatrimestre, id_carrera, id_taller);

        // Registrar el padecimiento, si se proporciona
        if (padecimiento && descripcion) {
            // Verificar que el tipo de padecimiento exista y obtener su id
            const padecimientoQuery = await pool.query('SELECT id_padecimiento FROM padecimientos WHERE tipo_padecimiento = $1', [padecimiento]);

            if (padecimientoQuery.rows.length === 0) {
                return res.status(400).json({ message: 'El tipo de padecimiento no existe' });
            }

            const id_padecimiento = padecimientoQuery.rows[0].id_padecimiento;

            console.log('ID del padecimiento encontrado:', id_padecimiento);

            // Registrar la información del padecimiento
            const resultPadecimiento = await pool.query(`
                INSERT INTO informacion_padecimiento (id_alumno, id_padecimiento, descripcion)
                VALUES ($1, $2, $3)
                RETURNING *;
            `, [id_alumno, id_padecimiento, descripcion]);

            console.log('Resultado de la inserción de padecimiento:', resultPadecimiento);

            res.status(201).json({
                success: true,
                message: 'Registrado en el taller y padecimiento con éxito',
                data: { taller: resultTaller, padecimiento: resultPadecimiento.rows[0] },
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Registrado en el taller con éxito',
                data: resultTaller,
            });
        }
    } catch (error) {
        console.error('Error al registrar en el taller o padecimiento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar en el taller o padecimiento',
            error: error.message,
        });
    }
};
