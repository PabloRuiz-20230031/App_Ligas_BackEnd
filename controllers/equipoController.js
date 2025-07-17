const Equipo = require('../models/equipo');

const crearEquipo = async (req, res) => {
  try {
    const { nombre, categoria, imagen, descrpcion } = req.body;

    const nuevoEquipo = new Equipo({ nombre, categoria, imagen, descrpcion });
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

const editarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, imagen, descrpcion } = req.body;

    const equipoActualizado = await Equipo.findByIdAndUpdate(
      id,
      { nombre, categoria, image, descrpcion },
      { new: true, runValidators: true }
    );

    if (!equipoActualizado) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    res.json(equipoActualizado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ya existe un equipo con ese nombre en esta categoría' });
    }
    res.status(500).json({ mensaje: 'Error al actualizar el equipo', error });
  }
};

const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Equipo.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    res.json({ mensaje: 'Equipo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el equipo', error });
  }
};


module.exports = {
  crearEquipo,
  obtenerEquipos,
  editarEquipo,
  eliminarEquipo,
};
