const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

exports.verificarToken = (req, res, next) => {
  console.log('Token headers:', req.headers);
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error('❌ Token inválido:', error.message);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

exports.verificarTokenOpcional = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    // No hay token → acceso público
    req.usuario = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.warn('⚠️ Token inválido u expirado, continuando como público');
    req.usuario = null;
    next(); // No bloquea el acceso
  }
};

exports.soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'No tienes permisos de administrador' });
  }
  next();
};
