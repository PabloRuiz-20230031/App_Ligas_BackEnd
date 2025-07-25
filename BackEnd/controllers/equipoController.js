const Equipo = require('../models/equipo');

const crearEquipo = async (req, res) => {
  try {
    const { nombre, categoria, imagen } = req.body;

    const nuevoEquipo = new Equipo({ nombre, categoria, imagen });
    const equipoGuardado = await nuevoEquipo.save();

    res.status(201).json(equipoGuardado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ya existe un equipo con ese nombre en esta categoría' });
    }
    res.status(500).json({ mensaje: 'Error al crear el equipo', error });
  }
};

const obtenerEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.find().populate('categoria', 'nombre');
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener equipos', error });
  }
};

module.exports = {
  crearEquipo,
  obtenerEquipos
};
