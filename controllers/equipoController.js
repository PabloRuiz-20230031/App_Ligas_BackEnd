const Equipo = require('../models/equipo');
const Representante = require('../models/representante');
const Jugador = require('../models/jugador');
const Temporada = require('../models/temporada');
const Partido = require('../models/partido');
const { obtenerCategoriaPorId } = require('./categoriaController');

const hayTemporadaActiva = async (categoriaId) => {
  const hoy = new Date();
  const temporadaActiva = await Temporada.findOne({
    categoria: categoriaId,
    fechaInicio: { $lte: hoy },
    fechaFin: { $gte: hoy }
  });
  return !!temporadaActiva;
};

const crearEquipo = async (req, res) => {
  try {
    const { nombre, categoria, imagen, descripcion, fechaCreacion } = req.body;

    if (await hayTemporadaActiva(categoria)) {
      return res.status(403).json({ mensaje: 'No se puede crear un equipo durante una temporada activa' });
    }

    const nuevoEquipo = new Equipo({
      nombre,
      categoria,
      imagen,
      descripcion,
      fechaCreacion
    });

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
    const { nombre, categoria, imagen, descripcion, fechaCreacion } = req.body;

    const equipo = await Equipo.findById(id);
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    if (equipo.nombre.toLowerCase() === 'descanso') {
      return res.status(403).json({ mensaje: 'No se puede editar el equipo "Descanso"' });
    }

    if (await hayTemporadaActiva(categoria)) {
      return res.status(403).json({ mensaje: 'No se puede editar un equipo durante una temporada activa' });
    }

    equipo.nombre = nombre;
    equipo.categoria = categoria;
    equipo.imagen = imagen;
    equipo.descripcion = descripcion;
    equipo.fechaCreacion = fechaCreacion;

    const actualizado = await equipo.save();
    res.json(actualizado);
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

    const equipo = await Equipo.findById(id);
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    if (equipo.nombre.toLowerCase() === 'descanso') {
      return res.status(403).json({ mensaje: 'No se puede eliminar el equipo "Descanso"' });
    }

    if (await hayTemporadaActiva(equipo.categoria)) {
      return res.status(403).json({ mensaje: 'No se puede eliminar un equipo durante una temporada activa' });
    }

    await Equipo.findByIdAndDelete(id);
    res.json({ mensaje: 'Equipo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el equipo', error });
  }
};

const obtenerEquiposPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const equipos = await Equipo.find({ categoria: categoriaId });
    res.json(equipos);
  } catch (error) {
    console.error('Error al obtener equipos por categoría:', error);
    res.status(500).json({ mensaje: 'Error al obtener equipos por categoría', error });
  }
};

const obtenerEquipoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findById(id)
      .populate('representantes', 'nombre')
      .populate('jugadores', 'nombre dorsal');

    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    res.json(equipo);
  } catch (error) {
    console.error('Error al obtener equipo por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener equipo', error });
  }
};

const obtenerEquipoConInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findById(id);
    if (!equipo) return res.status(404).json({ mensaje: 'Equipo no encontrado' });

    const representantes = await Representante.find({ equipo: id });
    const jugadores = await Jugador.find({ equipo: id }).sort({ dorsal: 1 });

    res.json({
      ...equipo.toObject(),
      representantes,
      jugadores
    });
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ mensaje: 'Error al obtener equipo', error });
  }
};

module.exports = {
  crearEquipo,
  obtenerEquipos,
  editarEquipo,
  eliminarEquipo,
  obtenerEquiposPorCategoria,
  obtenerEquipoPorId,
  obtenerEquipoConInfo
};
