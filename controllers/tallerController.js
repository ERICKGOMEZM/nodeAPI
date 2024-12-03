// controllers/talleresController.js

import { obtenerTalleres } from '../models/tallerModel.js';

export const getTalleres = async (req, res) => {
    try {
        const talleres = await obtenerTalleres();
        res.json(talleres);
    } catch (error) {
        console.error('Error al obtener talleres:', error);
        res.status(500).send('Error al obtener talleres');
    }
};


