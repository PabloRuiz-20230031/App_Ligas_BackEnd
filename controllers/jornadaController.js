const Jornada = require('../models/jornada');
const Partido = require('../models/partido');
const Equipo = require('../models/equipo');

const generarJornadas = async (req, res) => {
  try {
    const { categoriaId, vueltas, temporadaId } = req.body;

    const equipos = await Equipo.find({ categoria: categoriaId });
    let listaEquipos = [...equipos];
    let descansoId = null;

    // Verificar si ya existe un equipo "Descanso" en esta categoría
    const yaExisteDescanso = await Equipo.findOne({ nombre: 'Descanso', categoria: categoriaId });

    if (listaEquipos.length % 2 !== 0) {
      if (!yaExisteDescanso) {
        const descanso = new Equipo({
          nombre: 'Descanso',
          categoria: categoriaId,
          descripcion: 'Equipo generado automáticamente para empates',
          imagen: 'https://res.cloudinary.com/dprwy1viz/image/upload/v1753268469/descanso_qypb7w.webp'
        });
        const descansoGuardado = await descanso.save();
        descansoId = descansoGuardado._id.toString();
        listaEquipos.push(descansoGuardado);
      } else {
        descansoId = yaExisteDescanso._id.toString();
        listaEquipos.push(yaExisteDescanso);
      }
    }

    const mitad = listaEquipos.length / 2;
    const jornadasCreadas = [];

    for (let v = 0; v < vueltas; v++) {
      let equiposCopia = [...listaEquipos];

      for (let j = 0; j < listaEquipos.length - 1; j++) {
        const jornada = new Jornada({
          categoria: categoriaId,
          temporada: temporadaId,
          numero: j + 1 + v * (listaEquipos.length - 1),
          partidos: []
        });

        const jornadaGuardada = await jornada.save();
        const partidosIds = [];

        for (let i = 0; i < mitad; i++) {
          const local = equiposCopia[i];
          const visitante = equiposCopia[equiposCopia.length - 1 - i];

          // ❌ Evitar partidos "Descanso vs Descanso"
          if (
            descansoId &&
            local._id.toString() === descansoId &&
            visitante._id.toString() === descansoId
          ) {
            continue;
          }

          const partido = new Partido({
            temporada: temporadaId,
            liga: null,
            categoria: categoriaId,
            jornada: jornadaGuardada._id,
            equipoLocal: v % 2 === 0 ? local._id : visitante._id,
            equipoVisitante: v % 2 === 0 ? visitante._id : local._id,
            vuelta: v + 1
          });

          const partidoGuardado = await partido.save();
          partidosIds.push(partidoGuardado._id);
        }

        jornadaGuardada.partidos = partidosIds;
        await jornadaGuardada.save();

        jornadasCreadas.push(jornadaGuardada);
      }
    }

    res.status(201).json({
      mensaje: 'Jornadas y partidos generados correctamente',
      total: jornadasCreadas.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar jornadas', error });
  }
};

module.exports = {
  generarJornadas
};
