const Liga = require('../models/liga');

// Crear liga 
const crearLiga = async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin, imagen } = req.body;

    // Validar duplicado
    const existe = await Liga.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe una liga con ese nombre' });
    }

    const nuevaLiga = new Liga({ nombre, fechaInicio, fechaFin, imagen });
    const ligaGuardada = await nuevaLiga.save();
    res.status(201).json(ligaGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la liga', error });
  }
};

// Obtener todas las ligas
const obtenerLigas = async (req, res) => {
  try {
    const ligas = await Liga.find().sort({ createdAt: -1 });
    res.json(ligas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ligas', error });
  }
};

module.exports = {
  crearLiga,
  obtenerLigas
};
