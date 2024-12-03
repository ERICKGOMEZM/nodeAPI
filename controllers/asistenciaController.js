import { verificarAsistenciaExistente, guardarAsistencia } from '../models/asistenciaModel.js';

export const registrarAsistencia = async (req, res) => {
    const { id_alumno, id_taller, fecha, asistencia, justificacion } = req.body;

    try {
        // Verificamos si la asistencia ya está registrada
        const existeAsistencia = await verificarAsistenciaExistente(id_alumno, id_taller, fecha);

        if (existeAsistencia) {
            return res.status(400).json({ message: 'La asistencia ya ha sido registrada para esta fecha y taller.' });
        }

        // Si no existe, guardamos la nueva asistencia
        const nuevaAsistencia = await guardarAsistencia(id_alumno, id_taller, fecha, asistencia, justificacion);
        res.status(201).json({ message: 'Asistencia registrada correctamente.', data: nuevaAsistencia });
    } catch (error) {
        console.error('Error al registrar la asistencia:', error);
        res.status(500).json({ message: 'Error al registrar la asistencia.' });
    }
};

