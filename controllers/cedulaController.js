const Cedula = require('../models/cedula');
const Partido = require('../models/partido');
const TablaPosicion = require('../models/tablaPosicion');
const TablaGoleo = require('../models/tablaGoleo');
const Jugador = require('../models/jugador');

const { agregarTarjetas } = require('./tablaTarjetasController');

// Crear cédula arbitral para un partido específico
const crearCedula = async (req, res) => {
  try {
    const {
      partidoId,
      temporadaId,
      anotadoresLocal = [],
      anotadoresVisitante = [],
      autogoles = [],
      amonestaciones = [],
      expulsiones = [],
      notas = ''
    } = req.body;

    // Obtener el partido
    const partido = await Partido.findById(partidoId);
    if (!partido) return res.status(404).json({ error: 'Partido no encontrado' });

    // Calcular goles
    const golesLocal =
      anotadoresLocal.length +
      autogoles.filter((a) => String(a.equipo) === String(partido.equipoVisitante)).length;

    const golesVisitante =
      anotadoresVisitante.length +
      autogoles.filter((a) => String(a.equipo) === String(partido.equipoLocal)).length;

    // Validación: asegurar que los goles coinciden con la suma de anotadores y autogoles
    const totalGolesCalculados =
      anotadoresLocal.length + anotadoresVisitante.length + autogoles.length;
    const totalGolesReportados = golesLocal + golesVisitante;

    if (totalGolesCalculados !== totalGolesReportados) {
      return res.status(400).json({
        error: 'La suma de goles no coincide con anotadores + autogoles'
      });
    }

    // Crear cédula
    const cedula = new Cedula({
      partido: partidoId,
      temporada: temporadaId,
      liga: partido.liga,
      categoria: partido.categoria,
      jornada: partido.jornada,
      equipoLocal: partido.equipoLocal,
      equipoVisitante: partido.equipoVisitante,
      golesLocal,
      golesVisitante,
      anotadoresLocal,
      anotadoresVisitante,
      autogoles,
      amonestaciones,
      expulsiones,
      notas
    });

    const cedulaGuardada = await cedula.save();

    // Vincular cédula al partido
    partido.cedula = cedulaGuardada._id;
    await partido.save();

    // Actualizar tabla de posiciones
    await actualizarTabla(temporadaId, partido.equipoLocal, true, golesLocal, golesVisitante);
    await actualizarTabla(temporadaId, partido.equipoVisitante, false, golesVisitante, golesLocal);
    await actualizarTablaGoleo(temporadaId, anotadoresLocal);
    await actualizarTablaGoleo(temporadaId, anotadoresVisitante);

    // Actualizar tabla de tarjetas
    for (const amonestacion of amonestaciones) {
      const jugador = await Jugador.findById(amonestacion.jugador).populate('equipo');
      if (jugador && jugador.equipo) {
        await agregarTarjetas(jugador._id, jugador.equipo._id, temporadaId, 1, 0);
      }
    }

    for (const expulsion of expulsiones) {
      const jugador = await Jugador.findById(expulsion.jugador).populate('equipo');
      if (jugador && jugador.equipo) {
        await agregarTarjetas(jugador._id, jugador.equipo._id, temporadaId, 0, 1);
      }
    }

    res.status(201).json(cedulaGuardada);
  } catch (error) {
    console.error('❌ Error al crear la cédula:', error);
    res.status(500).json({ error: 'Error interno al crear la cédula' });
  }
};

const actualizarTablaGoleo = async (temporadaId, anotadores) => {
  const golesPorJugador = {};

  for (const { jugador } of anotadores) {
    if (!jugador) continue;
    golesPorJugador[jugador] = (golesPorJugador[jugador] || 0) + 1;
  }

  for (const jugadorId in golesPorJugador) {
    const jugadorDoc = await Jugador.findById(jugadorId).populate('equipo');
    if (!jugadorDoc || !jugadorDoc.equipo) continue;

    await TablaGoleo.findOneAndUpdate(
      { temporada: temporadaId, jugador: jugadorId },
      {
        $inc: { goles: golesPorJugador[jugadorId] },
        $setOnInsert: {
          equipo: jugadorDoc.equipo._id,
          dorsal: jugadorDoc.dorsal
        }
      },
      { upsert: true, new: true }
    );
  }
};

// Obtener cédulas registradas por temporada
const obtenerCedulasPorTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    const cedulas = await Cedula.find({ temporada: temporadaId })
      .populate('equipoLocal', 'nombre')
      .populate('equipoVisitante', 'nombre')
      .populate('amonestaciones.jugador', 'nombre')
      .populate('expulsiones.jugador', 'nombre');

    res.json(cedulas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cédulas', error });
  }
};

// Actualizar tabla de posiciones
const actualizarTabla = async (temporadaId, equipoId, esLocal, GF, GC) => {
  const update = {
    $inc: {
      PJ: 1,
      GF,
      GC,
      DIF: GF - GC
    }
  };

  if (GF > GC) {
    update.$inc.PG = 1;
    update.$inc.PTS = 3;
  } else if (GF === GC) {
    update.$inc.PE = 1;
    update.$inc.PTS = 1;
  } else {
    update.$inc.PP = 1;
  }

  await TablaPosicion.findOneAndUpdate(
    { temporada: temporadaId, equipo: equipoId },
    update,
    { upsert: true, new: true }
  );
};

const obtenerCedulaPorPartido = async (req, res) => {
  try {
    const { id } = req.params;

    const cedula = await Cedula.findOne({ partido: id })
      .populate('equipoLocal', 'nombre imagen') // ✅ Agregado "imagen"
      .populate('equipoVisitante', 'nombre imagen') // ✅ Agregado "imagen"
      .populate('anotadoresLocal.jugador', 'nombre dorsal')
      .populate('anotadoresVisitante.jugador', 'nombre dorsal')
      .populate('amonestaciones.jugador', 'nombre dorsal')
      .populate('expulsiones.jugador', 'nombre dorsal');

    if (!cedula) {
      return res.status(404).json({ mensaje: 'No se encontró una cédula para este partido' });
    }

    res.json(cedula);
  } catch (error) {
    console.error('❌ Error al obtener cédula:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener cédula' });
  }
};

module.exports = {
  crearCedula,
  obtenerCedulasPorTemporada,
  actualizarTabla,
  obtenerCedulaPorPartido,
  actualizarTablaGoleo
};
