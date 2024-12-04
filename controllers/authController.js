// controllers/authController.js
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
    const { nombre, correo, matricula, contraseña, edad, genero, apellido_paterno, apellido_materno } = req.body;

    // Validación del correo
    const emailRegex = /^[a-zA-Z0-9._%+-]+@utvtol\.edu\.mx$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ message: 'El correo debe ser del dominio @utvtol.edu.mx' });
    }

    // Validación de la contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(contraseña)) {
        return res.status(400).json({
            message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un carácter especial.',
        });
    }

    // Validación de la matrícula
    const matriculaRegex = /^\d{10}$/;
    if (!matriculaRegex.test(matricula)) {
        return res.status(400).json({
            message: 'La matrícula debe tener exactamente 10 dígitos numéricos.',
        });
    }

    // Validación del género
    const generoMap = {
        female: 'mujer',
        male: 'hombre',
        other: 'otro',
    };
    const generoTransformado = generoMap[genero];
    if (!generoTransformado) {
        return res.status(400).json({ message: 'Género no válido' });
    }

    try {
        const userExists = await User.findByEmail(correo);
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const newUser = await User.create(
            nombre,
            correo,
            matricula,
            contraseña,
            edad,
            generoTransformado,
            apellido_paterno,
            apellido_materno
        );

        res.status(201).json({ message: 'Usuario creado', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};


export const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    // Validación del correo
    const emailRegex = /^[a-zA-Z0-9._%+-]+@utvtol\.edu\.mx$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ message: 'El correo debe ser del dominio @utvtol.edu.mx' });
    }

    // Validación de la contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(contraseña)) {
        return res.status(400).json({
            message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un carácter especial.',
        });
    }

    try {
        const user = await User.findByEmail(correo);
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = generateToken({ id_alumno: user.id_alumno, email: user.correo });

        const { contraseña: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};


export const getUserProfile = async (req, res) => {
    const { id_alumno } = req.params; // El ID se pasará como parámetro en la URL
    console.log('ID recibido en la solicitud:', id_alumno);

    try {
        // Obtener los datos del usuario
        const user = await User.findById(id_alumno);
        console.log('Resultado de la consulta del usuario:', user);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { contraseña, ...userWithoutPassword } = user;

        // Obtener los talleres asociados al usuario
        const talleres = await User.findAlumnoWithTalleres(id_alumno);
        console.log('Talleres asociados al usuario:', talleres);

        res.status(200).json({ 
            message: 'Datos del usuario obtenidos', 
            user: userWithoutPassword, 
            talleres 
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error.message);
        res.status(500).json({ message: 'Error al obtener datos del usuario', error: error.message });
    }
};
