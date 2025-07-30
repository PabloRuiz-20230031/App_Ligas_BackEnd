const Jugador = require('../models/jugador');

// Crear jugador
const crearJugador = async (req, res) => {
  try {
    const { nombre, curp, dorsal, fechaNacimiento, foto, equipo } = req.body;

    // Validar si el equipo ya tiene 30 jugadores
    const totalJugadores = await Jugador.countDocuments({ equipo });
    if (totalJugadores >= 30) {
      return res.status(400).json({ mensaje: 'El equipo ya tiene el máximo de 30 jugadores' });
    }

    const nuevoJugador = new Jugador({
      nombre,
      curp,
      dorsal,
      fechaNacimiento,
      foto,
      equipo
    });

    const guardado = await nuevoJugador.save();
    res.status(201).json(guardado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'CURP o dorsal duplicado para este equipo' });
    }
    res.status(500).json({ mensaje: 'Error al registrar jugador', error });
  }
};

// Obtener jugadores por equipo
const obtenerJugadoresPorEquipo = async (req, res) => {
  try {
    const { equipoId } = req.params;
    const jugadores = await Jugador.find({ equipo: equipoId }).sort({ dorsal: 1 });
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores', error });
  }
};

const actualizarJugador = async (req, res) => {
  try {
    const jugador = await Jugador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(jugador);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar jugador', error });
  }
};

// DELETE /jugadores/:id
const eliminarJugador = async (req, res) => {
  try {
    await Jugador.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Jugador eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar jugador', error });
  }
};

// Obtener un jugador por su ID
const obtenerJugadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const jugador = await Jugador.findById(id);
    if (!jugador) return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    res.json(jugador);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener jugador', error });
  }
};

module.exports = {
  crearJugador,
  obtenerJugadoresPorEquipo,
  actualizarJugador,
  eliminarJugador,
  obtenerJugadorPorId,
};
