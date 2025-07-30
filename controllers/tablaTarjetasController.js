const TablaTarjetas = require('../models/tablaTarjeta');
const Jugador = require('../models/jugador');
const Equipo = require('../models/equipo');

const obtenerTarjetasPorTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    const tarjetas = await TablaTarjetas.find({
      temporada: temporadaId,
      $or: [{ amarillas: { $gt: 0 } }, { rojas: { $gt: 0 } }]
    })
      .populate('jugador', 'nombre dorsal')
      .populate('equipo', 'nombre')
      .sort({ amarillas: -1, rojas: -1 });

    res.json(tarjetas);
  } catch (error) {
    console.error('Error al obtener tarjetas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const agregarTarjetas = async (jugadorId, equipoId, temporadaId, amarillas = 0, rojas = 0) => {
  const registro = await TablaTarjetas.findOne({ jugador: jugadorId, temporada: temporadaId });

  if (registro) {
    registro.amarillas += amarillas;
    registro.rojas += rojas;
    await registro.save();
  } else {
    await TablaTarjetas.create({
      jugador: jugadorId,
      equipo: equipoId,
      temporada: temporadaId,
      amarillas,
      rojas
    });
  }
};

module.exports = {
  obtenerTarjetasPorTemporada,
  agregarTarjetas
};
