const Representante = require('../models/representante');

const crearRepresentante = async (req, res) => {
  try {
    console.log('📩 Datos recibidos:', req.body);
    const { nombre, curp, telefono, correo, equipo } = req.body;

    const total = await Representante.countDocuments({ equipo });
    if (total >= 2) {
      return res.status(400).json({ mensaje: 'Este equipo ya tiene el máximo de 2 representantes' });
    }

    const nuevo = new Representante({ nombre, curp, telefono, correo, equipo });
    const guardado = await nuevo.save();

    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar representante', error });
  }
};

const obtenerRepresentantesPorEquipo = async (req, res) => {
  try {
    const { equipoId } = req.params;
    const representantes = await Representante.find({ equipo: equipoId });
    res.json(representantes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener representantes', error });
  }
};

const actualizarRepresentante = async (req, res) => {
  try {
    const representante = await Representante.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(representante);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar representante', error });
  }
};

const eliminarRepresentante = async (req, res) => {
  try {
    await Representante.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Representante eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar representante', error });
  }
};

// Obtener un representante por su ID
const obtenerRepresentantePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const representante = await Representante.findById(id);
    if (!representante) {
      return res.status(404).json({ mensaje: 'Representante no encontrado' });
    }
    res.json(representante);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener representante', error });
  }
};

module.exports = {
  crearRepresentante,
  obtenerRepresentantesPorEquipo,
  actualizarRepresentante,
  eliminarRepresentante,
  obtenerRepresentantePorId
};
