const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiKey = require('../models/apiKey');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';
const EXPIRACION_NORMAL = '30d';
const EXPIRACION_ADMIN = '60m';

// Registro
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña: hash,
      rol: rol || 'usuario'
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error });
  }
};

// Login
exports.iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const valida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valida) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: usuario.rol === 'admin' ? EXPIRACION_ADMIN : EXPIRACION_NORMAL }
    );

    // Buscar o generar API Key activa
    let apiKeyDoc = await ApiKey.findOne({ userId: usuario._id, isActive: true });
    if (!apiKeyDoc) {
      const nuevaKey = `key_${usuario._id}_${Date.now()}`;
      apiKeyDoc = new ApiKey({ userId: usuario._id, apiKey: nuevaKey });
      await apiKeyDoc.save();
    }

    res.status(200).json({
    mensaje: 'Inicio de sesión exitoso',
    token,
    usuario: {
      _id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      foto: usuario.foto || ''  // ✅ agregado aquí
    },
    apiKey: apiKeyDoc.apiKey
  });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
};

// Perfil
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-contraseña');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
};

exports.buscarUsuarioPorCorreo = async (req, res) => {
  try {
    const { correo } = req.query;

    if (!correo) {
      return res.status(400).json({ mensaje: 'El correo es requerido' });
    }

    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() }).select('-contraseña');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar usuario', error });
  }
};

exports.cambiarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['usuario', 'admin'].includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol no válido' });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.rol = rol;
    await usuario.save();

    res.json({ mensaje: `Rol actualizado a ${rol}` });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar rol', error });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const { nombre, correo, contraseña, foto } = req.body;

    if (correo) {
      usuario.correo = correo.trim().toLowerCase();
    }
    if (nombre) {
      usuario.nombre = nombre.trim();
    }

    if (foto) usuario.foto = foto;

    if (contraseña) {
      const hash = await bcrypt.hash(contraseña, 10);
      usuario.contraseña = hash;
    }

    await usuario.save();
    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
};

exports.recuperarContrasena = async (req, res) => {
  try {
    const { correo } = req.body;

    // Verificar que el correo exista
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'El correo no está registrado' });
    }

    // Generar nueva contraseña temporal
    const nuevaContrasena = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    usuario.contraseña = hash;
    await usuario.save();

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // puedes usar otro: outlook, mailtrap, etc.
      auth: {
        user: process.env.EMAIL_USER,      // tu correo (usa variables de entorno)
        pass: process.env.EMAIL_PASSWORD,  // tu contraseña o app password
      },
    });

    // Contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Recuperación de contraseña - App Ligas',
      text: `Hola ${usuario.nombre},\n\nTu nueva contraseña temporal es: ${nuevaContrasena}\n\nPor favor cámbiala después de iniciar sesión.`,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    res.json({ mensaje: 'Se ha enviado una nueva contraseña al correo registrado' });

  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al recuperar contraseña', error });
  }
};

