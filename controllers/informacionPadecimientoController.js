//controllers/informacionPadecimientoController.js

import { obtenerPadecimientos, obtenerPadecimientoPorTipo } from '../models/informacionPadecimientoModel.js';
import { registrarInformacionPadecimiento } from '../models/informacionPadecimientoModel.js';

// Obtener todos los padecimientos
export const obtenerPadecimientosController = async (req, res) => {
    try {
        const padecimientos = await obtenerPadecimientos();
        res.json(padecimientos);
    } catch (error) {
        console.error('Error al obtener los padecimientos:', error);
        res.status(500).send('Error al obtener los padecimientos');
    }
};

// Registrar el padecimiento del alumno
export const registrarPadecimientoController = async (req, res) => {
    try {
        // Obtener el id_alumno desde el token (req.user contiene la información del usuario)
        const { id_alumno } = req.user;

        // Mostrar los datos recibidos
        console.log('Datos recibidos en la solicitud:', req.body);

        const { tipo_padecimiento, descripcion } = req.body;

        // Validar que los campos no estén vacíos
        if (!id_alumno) {
            console.log('Falta el id_alumno');
            return res.status(400).json({ message: 'Falta el id_alumno' });
        }

        if (!tipo_padecimiento) {
            console.log('Falta el tipo de padecimiento');
            return res.status(400).json({ message: 'Falta el tipo de padecimiento' });
        }

        if (!descripcion) {
            console.log('Falta la descripción del padecimiento');
            return res.status(400).json({ message: 'Falta la descripción del padecimiento' });
        }

        // Mostrar los datos después de la validación
        console.log('id_alumno:', id_alumno);
        console.log('Tipo de padecimiento:', tipo_padecimiento);
        console.log('Descripción del padecimiento:', descripcion);

        // Verificar que el tipo de padecimiento exista
        const padecimiento = await obtenerPadecimientoPorTipo(tipo_padecimiento);

        if (!padecimiento) {
            console.log(`El tipo de padecimiento no existe: ${tipo_padecimiento}`);
            return res.status(400).json({ message: 'El tipo de padecimiento no existe' });
        }

        // Mostrar el id del padecimiento encontrado
        console.log('ID del padecimiento encontrado:', padecimiento.id_padecimiento);

        // Registrar la información del padecimiento en la base de datos
        const result = await registrarInformacionPadecimiento(id_alumno, padecimiento.id_padecimiento, descripcion);

        // Mostrar el resultado del registro
        console.log('Padecimiento registrado con éxito:', result);

        res.status(201).json({
            success: true,
            message: 'Padecimiento registrado con éxito',
            data: result,
        });
    } catch (error) {
        console.error('Error al registrar el padecimiento:', error);
        res.status(500).send('Error al registrar el padecimiento');
    }
};
