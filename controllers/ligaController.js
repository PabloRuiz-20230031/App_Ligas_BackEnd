const Liga = require('../models/liga');

// Crear liga 
const crearLiga = async (req, res) => {
  try {
    console.log('📩 Body recibido:', req.body); // 👈 esto imprime lo que llega
    const { nombre, fechaInicio, fechaFin, imagen, creador, descripcion } = req.body;

    const existe = await Liga.findOne({
    nombre: { $regex: `^${nombre}$`, $options: 'i' } // comparación insensible a mayúsculas
    });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe una liga con ese nombre' });
    }

    const nuevaLiga = new Liga({ nombre, fechaInicio, fechaFin, imagen, creador, descripcion});
    const ligaGuardada = await nuevaLiga.save();

    res.status(201).json(ligaGuardada);
  } catch (error) {
    console.error('❌ Error al crear liga:', error); // 👈 esto es clave
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

// Actualizar liga por ID
const actualizarLiga = async (req, res) => {
  try {
    const { id } = req.params;
    const ligaActualizada = await Liga.findByIdAndUpdate(id, req.body, { new: true });
    if (!ligaActualizada) {
      return res.status(404).json({ mensaje: 'Liga no encontrada' });
    }
    res.json(ligaActualizada);
  } catch (error) {
    console.error('❌ Error al actualizar liga:', error);
    res.status(500).json({ mensaje: 'Error al actualizar liga', error });
  }
};

// Eliminar liga por ID
const eliminarLiga = async (req, res) => {
  try {
    const { id } = req.params;
    const ligaEliminada = await Liga.findByIdAndDelete(id);
    if (!ligaEliminada) {
      return res.status(404).json({ mensaje: 'Liga no encontrada' });
    }
    res.json({ mensaje: 'Liga eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar liga:', error);
    res.status(500).json({ mensaje: 'Error al eliminar liga', error });
  }
};

const buscarLigas = async (req, res) => {
  try {
    const { nombre } = req.query;

    const ligas = await Liga.find({
      nombre: { $regex: nombre, $options: 'i' }
    }).limit(10);

    res.json(ligas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar ligas', error });
  }
};

const obtenerLigaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const liga = await Liga.findById(id).populate('creador', 'nombre');
    if (!liga) {
      return res.status(404).json({ mensaje: 'Liga no encontrada' });
    }
    res.json(liga);
  } catch (error) {
    console.error('❌ Error al obtener liga por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener la liga', error });
  }
};

module.exports = {
  crearLiga,
  obtenerLigas,
  actualizarLiga,
  eliminarLiga,
  buscarLigas,
  obtenerLigaPorId
};
