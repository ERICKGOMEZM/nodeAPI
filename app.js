//app.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import tallerRoutes from './routes/tallerRoutes.js';
import cuatrimestreRoute from './routes/cuatrimestreRoute.js';
import carreraRoute from './routes/carreraRoute.js';
import registerTallerRoutes from './routes/registerTallerRoute.js';
import maestroRoutes from './routes/maestroRoutes.js'; 
import datosTallerRoute from './routes/datosTallerRoute.js';
import adminRoutes from './routes/adminRoute.js';
import listaFutbolRoute from './routes/listaFutbolRoute.js';  // Importa las rutas para la lista de alumnos de fútbol
import asistenciaRoutes from './routes/asistenciaRoute.js';  // Importar las rutas de asistencia

dotenv.config();

const app = express();

app.use(cors({
    origen: ' http://localhost:86 ',
}));

app.use(bodyParser.json());

// Configuración de las rutas de la API
app.use('/api/auth', authRoutes); 
app.use('/api', tallerRoutes); 
app.use('/api', cuatrimestreRoute); 
app.use('/api', carreraRoute); 
app.use('/api', registerTallerRoutes); 
app.use('/api/maestros', maestroRoutes); 
app.use('/api', datosTallerRoute); 
app.use('/api/admin', adminRoutes);
app.use('/api', listaFutbolRoute);  // Ruta que maneja los alumnos del taller de fútbol
app.use('/api', asistenciaRoutes);  // Agregar la ruta para las justificaciones

const PORT = process.env.PORT || 86;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
