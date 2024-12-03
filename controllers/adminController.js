import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registrarAdministrador, obtenerAdminPorCorreo } from '../models/adminModel.js';
import pool from '../config/db.js';

// Registrar un nuevo administrador
export const registrarAdmin = async (req, res) => {
    const { nombre, correo, contraseña, id_rol } = req.body;

    try {
        // Verificar si el correo ya existe
        const checkEmailQuery = 'SELECT * FROM administradores WHERE correo = $1';
        const { rows } = await pool.query(checkEmailQuery, [correo]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar el nuevo administrador en la base de datos
        const nuevoAdmin = await registrarAdministrador(nombre, correo, hashedPassword, id_rol);

        // Responder con el administrador registrado
        return res.status(201).json({
            message: 'Administrador registrado exitosamente',
            admin: nuevoAdmin,
        });
    } catch (error) {
        console.error('Error al registrar administrador:', error);
        res.status(500).send('Error al registrar el administrador');
    }
};

// Login de administrador
export const loginAdmin = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar administrador por correo
        const admin = await obtenerAdminPorCorreo(correo);

        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(contraseña, admin.contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id_admin: admin.id_admin, nombre: admin.nombre, correo: admin.correo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Cambia la duración según tus necesidades
        );

        // Respuesta exitosa con token
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
};
