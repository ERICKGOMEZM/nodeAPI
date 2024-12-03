//controllers/listaFutbolController.js

import { obtenerDatosRegisterTallerPorTallerFutbol } from '../models/listaFutbolModel.js'; // Importa la función del modelo

export const obtenerDatosPorTaller = async (req, res) => {
  try {
    const { idTaller } = req.params;
    const datos = await obtenerDatosRegisterTallerPorTallerFutbol(idTaller);
    res.json(datos);  // Enviamos los datos que incluyen los padecimientos
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error al obtener los datos');
  }
};

  
  
