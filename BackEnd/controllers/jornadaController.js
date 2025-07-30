const Jornada = require('../models/jornada');
const Equipo = require('../models/equipo');
const mongoose = require('mongoose');

const generarJornadas = async (req, res) => {
  try {
    const { categoriaId, vueltas } = req.body;

    let equipos = await Equipo.find({ categoria: categoriaId });

    let descansoId = null;

    // Si hay número impar, crear y agregar el equipo "Descanso"
    if (equipos.length % 2 !== 0) {
      const descanso = new Equipo({
        nombre: 'Descanso',
        categoria: categoriaId,
        descripcion: 'Equipo agregado automáticamente para completar el calendario',
        imagen: 'https://res.cloudinary.com/dprwy1viz/image/upload/v1753268469/descanso_qypb7w.webp'
      });

      const descansoGuardado = await descanso.save();
      descansoId = descansoGuardado._id;
      equipos.push(descansoGuardado);
    }

    const totalJornadas = (equipos.length - 1) * vueltas;
    const mitad = equipos.length / 2;

    const jornadas = [];

    // Generar jornadas para cada vuelta
    for (let v = 0; v < vueltas; v++) {
      let equiposCopia = [...equipos];

      for (let j = 0; j < equipos.length - 1; j++) {
        const partidos = [];

        for (let i = 0; i < mitad; i++) {
          const local = equiposCopia[i];
          const visitante = equiposCopia[equiposCopia.length - 1 - i];

          // Evitar crear partidos con el equipo "Descanso"
          if (
            descansoId &&
            (local._id.equals(descansoId) || visitante._id.equals(descansoId))
          ) {
            continue;
          }

          partidos.push({
            local: v % 2 === 0 ? local._id : visitante._id,
            visitante: v % 2 === 0 ? visitante._id : local._id,
            vuelta: v + 1
          });
        }

        jornadas.push({
          categoria: categoriaId,
          numero: j + 1 + v * (equipos.length - 1),
          partidos
        });

        // Rotar equipos (excepto el primero)
        const fijo = equiposCopia[0];
        const resto = equiposCopia.slice(1);
        equiposCopia = [fijo, ...resto.slice(1), resto[0]];
      }
    }

    // Guardar jornadas
    await Jornada.insertMany(jornadas);

    res.status(201).json({
      mensaje: 'Jornadas generadas correctamente',
      total: jornadas.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar jornadas', error });
  }
};

module.exports = {
  generarJornadas
};
