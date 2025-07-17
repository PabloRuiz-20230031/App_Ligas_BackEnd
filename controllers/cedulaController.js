const Cedula = require('../models/cedula');

const TablaPosicion = require('../models/tablaPosicion');

const crearCedula = async (req, res) => {
  try {
    const {
      liga,
      categoria,
      jornada,
      equipoLocal,
      equipoVisitante,
      golesLocal,
      golesVisitante,
      amonestaciones,
      expulsiones,
      notas
    } = req.body;

    const nueva = new Cedula({
      liga,
      categoria,
      jornada,
      equipoLocal,
      equipoVisitante,
      golesLocal,
      golesVisitante,
      amonestaciones,
      expulsiones,
      notas
    });

    const guardada = await nueva.save();
    await actualizarTabla(categoria, equipoLocal, true, golesLocal, golesVisitante);
    await actualizarTabla(categoria, equipoVisitante, false, golesVisitante, golesLocal);
    res.status(201).json(guardada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cédula arbitral', error });
  }
};

const obtenerCedulasPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const cedulas = await Cedula.find({ categoria: categoriaId })
      .populate('equipoLocal', 'nombre')
      .populate('equipoVisitante', 'nombre')
      .populate('amonestaciones.jugador', 'nombre')
      .populate('expulsiones.jugador', 'nombre');
    res.json(cedulas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cédulas', error });
  }
};

const actualizarTabla = async (categoriaId, equipoId, esLocal, GF, GC) => {
  const update = {
    $inc: {
      PJ: 1,
      GF: GF,
      GC: GC,
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
    { categoria: categoriaId, equipo: equipoId },
    update,
    { upsert: true, new: true }
  );
};


module.exports = {
  crearCedula,
  obtenerCedulasPorCategoria,
  actualizarTabla
};
