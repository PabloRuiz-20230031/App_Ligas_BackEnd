const ApiKey = require('../models/apiKey');

const verificarApiKey = async (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({ mensaje: 'API Key requerida' });
  }

  try {
    const claveValida = await ApiKey.findOne({ apiKey, isActive: true });

    if (!claveValida) {
      return res.status(401).json({ mensaje: 'API Key inválida o inactiva' });
    }

    req.usuarioId = claveValida.userId; // útil para registrar logs si lo necesitas
    next();
  } catch (error) {
    console.error('❌ Error al verificar API Key:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = verificarApiKey;
