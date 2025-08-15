const TablaGoleo = require('../models/tablaGoleo');
const Jugador = require('../models/jugador');

const obtenerTablaGoleoPorTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    const tabla = await TablaGoleo.find({ temporada: temporadaId })
      .populate('jugador', 'nombre dorsal')
      .populate('equipo', 'nombre')
      .sort({ goles: -1 })
      .lean();

    // 🔒 Filtrar entradas con jugador o equipo nulo (eliminado)
    const tablaFiltrada = tabla.filter(g => g.jugador && g.equipo);

    res.json(tablaFiltrada);
  } catch (error) {
    console.error('❌ Error al obtener tabla de goleo:', error);
    res.status(500).json({ error: 'Error al obtener tabla de goleo' });
  }
};


const reiniciarTablaGoleo = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    const result = await TablaGoleo.deleteMany({ temporada: temporadaId });
    res.json({ mensaje: `Se reinició la tabla de goleo de la temporada ${temporadaId}`, eliminados: result.deletedCount });
  } catch (error) {
    console.error('❌ Error al reiniciar tabla de goleo:', error);
    res.status(500).json({ error: 'Error al reiniciar tabla de goleo' });
  }
};

module.exports = {
  obtenerTablaGoleoPorTemporada,
  reiniciarTablaGoleo
};
