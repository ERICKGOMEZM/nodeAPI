// controllers/carreraController.js

import { obtenerDatos as obtenerDatoscarrera } from '../models/carreraModel.js';

export const obtenerDatos = async (req, res) => {
    try {
        const datos = await obtenerDatoscarrera();
        res.json(datos);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).send('Error al obtener datos');
    }
};