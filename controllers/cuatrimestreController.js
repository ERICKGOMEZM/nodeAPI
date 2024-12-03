// controllers/cuatrimestreController.js

import { obtenerDatos as obtenerDatoscuatrimestre } from '../models/cuatrimestreModel.js';

export const obtenerDatos = async (req, res) => {
    try {
        const datos = await obtenerDatoscuatrimestre();
        res.json(datos);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).send('Error al obtener datos');
    }
};
