import { obtenerDatosRegisterTaller } from '../models/datosTallerModel.js'; // Importamos el modelo

export const obtenerDatos = async (req, res) => {
  try {
    const datos = await obtenerDatosRegisterTaller(); // Llamamos a la función del modelo para obtener los datos
    res.json(datos); // Enviamos los datos al cliente como respuesta JSON
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error al obtener los datos');
  }
};
