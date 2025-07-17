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

module.exports = {
  crearJugador,
  obtenerJugadoresPorEquipo
};
