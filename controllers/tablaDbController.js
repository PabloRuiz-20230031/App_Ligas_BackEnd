const Tabla = require('../models/tablaPosicion');
const Equipo = require('../models/equipo');

const getTablaPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const tabla = await Tabla.find({ categoria: categoriaId }).populate('equipo', 'nombre');

    const ordenada = tabla.sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      if (b.DIF !== a.DIF) return b.DIF - a.DIF;
      return b.GF - a.GF;
    });

    res.json(ordenada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tabla', error });
  }
};

module.exports = { getTablaPorCategoria };
