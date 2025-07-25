const Cedula = require('../models/cedula');
const Equipo = require('../models/equipo');

const obtenerTablaPorCategoria = async (req, res) => {
  try {
    const { ligaId, categoriaId } = req.params;

    // Buscar todos los partidos jugados en esta categoría
    const cedulas = await Cedula.find({ categoria: categoriaId, liga: ligaId });

    const tabla = {};

    for (const cedula of cedulas) {
      const { equipoLocal, equipoVisitante, golesLocal, golesVisitante } = cedula;

      // Inicializar si no existe
      [equipoLocal, equipoVisitante].forEach(equipoId => {
        if (!tabla[equipoId]) {
          tabla[equipoId] = {
            equipo: equipoId,
            PJ: 0,
            PG: 0,
            PE: 0,
            PP: 0,
            GF: 0,
            GC: 0,
            DIF: 0,
            PTS: 0
          };
        }
      });

      // Local
      tabla[equipoLocal].PJ++;
      tabla[equipoLocal].GF += golesLocal;
      tabla[equipoLocal].GC += golesVisitante;

      // Visitante
      tabla[equipoVisitante].PJ++;
      tabla[equipoVisitante].GF += golesVisitante;
      tabla[equipoVisitante].GC += golesLocal;

      // Resultado
      if (golesLocal > golesVisitante) {
        tabla[equipoLocal].PG++;
        tabla[equipoLocal].PTS += 3;
        tabla[equipoVisitante].PP++;
      } else if (golesLocal < golesVisitante) {
        tabla[equipoVisitante].PG++;
        tabla[equipoVisitante].PTS += 3;
        tabla[equipoLocal].PP++;
      } else {
        tabla[equipoLocal].PE++;
        tabla[equipoVisitante].PE++;
        tabla[equipoLocal].PTS += 1;
        tabla[equipoVisitante].PTS += 1;
      }
    }

    // Calcular diferencia de goles y obtener nombres
    const resultado = await Promise.all(Object.values(tabla).map(async item => {
      item.DIF = item.GF - item.GC;
      const equipo = await Equipo.findById(item.equipo);
      item.nombreEquipo = equipo?.nombre || 'Equipo eliminado';
      return item;
    }));

    // Ordenar por PTS, luego DIF, luego GF
    resultado.sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      if (b.DIF !== a.DIF) return b.DIF - a.DIF;
      return b.GF - a.GF;
    });

    res.json(resultado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tabla de posiciones', error });
  }
};

module.exports = { obtenerTablaPorCategoria };
