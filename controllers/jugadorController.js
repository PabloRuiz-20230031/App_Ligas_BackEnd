const Jugador = require('../models/jugador');
const TablaGoleo = require('../models/tablaGoleo');
const Tarjeta = require('../models/tablaTarjeta');

// Crear jugador
const crearJugador = async (req, res) => {
  try {
    const { nombre, curp, dorsal, fechaNacimiento, foto, equipo } = req.body;

    // Validar si el equipo ya tiene 30 jugadores
    const totalJugadores = await Jugador.countDocuments({ equipo });
    if (totalJugadores >= 30) {
      return res.status(400).json({ mensaje: 'El equipo ya tiene el máximo de 30 jugadores' });
    }

    const nuevoJugadorData = {
      nombre,
      dorsal,
      fechaNacimiento,
      foto,
      equipo
    };

    // Agregar CURP si se proporciona
    if (curp && curp.trim() !== '') {
      nuevoJugadorData.curp = curp.trim().toUpperCase();
    }

    const nuevoJugador = new Jugador(nuevoJugadorData);
    const guardado = await nuevoJugador.save();
    res.status(201).json(guardado);
  } catch (error) {
    if (error.code === 11000) {
      const campoDuplicado = Object.keys(error.keyPattern)[0];
      if (campoDuplicado === 'dorsal') {
        return res.status(400).json({ mensaje: 'Dorsal duplicado para este equipo' });
      }
      return res.status(400).json({ mensaje: 'Error por campo duplicado', campo: campoDuplicado });
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

// Obtener jugador por ID
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

// Actualizar jugador
const actualizarJugador = async (req, res) => {
  try {
    const jugador = await Jugador.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    res.json(jugador);
  } catch (error) {
    if (error.code === 11000) {
      const campoDuplicado = Object.keys(error.keyPattern)[0];
      if (campoDuplicado === 'dorsal') {
        return res.status(400).json({ mensaje: 'Dorsal duplicado para este equipo' });
      }
      return res.status(400).json({ mensaje: 'Error por campo duplicado', campo: campoDuplicado });
    }
    res.status(500).json({ mensaje: 'Error al actualizar jugador', error });
  }
};

// Eliminar jugador
const eliminarJugador = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Eliminar el jugador
    const jugadorEliminado = await Jugador.findByIdAndDelete(id);
    if (!jugadorEliminado) {
      return res.status(404).json({ mensaje: 'Jugador no encontrado' });
    }

    // 2. Eliminar sus registros en la tabla de goleo
    await TablaGoleo.deleteMany({ jugador: id });

    // 3. Eliminar sus registros en la tabla de tarjetas
    await TablaTarjetas.deleteMany({ jugador: id });

    res.json({ mensaje: 'Jugador y registros asociados eliminados correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar jugador:', error);
    res.status(500).json({ mensaje: 'Error al eliminar jugador', error });
  }
};

module.exports = {
  crearJugador,
  obtenerJugadoresPorEquipo,
  obtenerJugadorPorId,
  actualizarJugador,
  eliminarJugador
};
