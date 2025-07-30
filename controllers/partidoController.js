const Partido = require('../models/partido');
const Jugador = require('../models/jugador');

// Crear partido manual (por si no usas generación automática)
const crearPartido = async (req, res) => {
  try {
    const { temporada, liga, categoria, jornada, equipoLocal, equipoVisitante, fecha, hora } = req.body;

    const nuevo = new Partido({
      temporada,
      liga,
      categoria,
      jornada,
      equipoLocal,
      equipoVisitante,
      fecha,
      hora
    });

    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear partido', error });
  }
};

// Obtener todos los partidos de una categoría (puede filtrar por jornada o temporada si deseas)
const obtenerPartidosPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const partidos = await Partido.find({ categoria: categoriaId })
      .populate('equipoLocal', 'nombre imagen')
      .populate('equipoVisitante', 'nombre imagen')
      .populate('cedula') // para saber si ya fue jugado
      .sort({ jornada: 1 });

    res.json(partidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener partidos', error });
  }
};

// Eliminar partido (opcional)
const eliminarPartido = async (req, res) => {
  try {
    const { id } = req.params;
    await Partido.findByIdAndDelete(id);
    res.json({ mensaje: 'Partido eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar partido', error });
  }
};

const obtenerPartidosPorTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    const partidos = await Partido.find({ temporada: temporadaId })
      .populate('equipoLocal', 'nombre imagen')
      .populate('equipoVisitante', 'nombre imagen')
      .populate('cedula');

    res.json(partidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener partidos', error });
  }
};

const obtenerJugadoresDePartido = async (req, res) => {
  try {
    const { partidoId } = req.params;

    const partido = await Partido.findById(partidoId)
      .populate('equipoLocal equipoVisitante');

    if (!partido) {
      return res.status(404).json({ mensaje: 'Partido no encontrado' });
    }

    const jugadoresLocal = await Jugador.find({ equipo: partido.equipoLocal._id });
    const jugadoresVisitante = await Jugador.find({ equipo: partido.equipoVisitante._id });

    const jugadores = [...jugadoresLocal, ...jugadoresVisitante];

    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener jugadores', error });
  }
};

const obtenerJornadasPorEquipo = async (req, res) => {
  try {
    const { equipoId } = req.params;

    const partidos = await Partido.find({
      $or: [
        { equipoLocal: equipoId },
        { equipoVisitante: equipoId }
      ]
    })
      .populate('jornada')
      .populate('equipoLocal', 'nombre imagen')
      .populate('equipoVisitante', 'nombre imagen')
      .sort({ 'jornada.numero': 1 });

    res.json(partidos);
  } catch (error) {
    console.error('Error al obtener jornadas del equipo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  crearPartido,
  obtenerPartidosPorCategoria,
  eliminarPartido,
  obtenerPartidosPorTemporada,
  obtenerJugadoresDePartido,
  obtenerJornadasPorEquipo
};

