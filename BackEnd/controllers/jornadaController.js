const Jornada = require('../models/jornada');
const Equipo = require('../models/equipo');

const generarJornadas = async (req, res) => {
  try {
    const { categoriaId, vueltas } = req.body;

    const equipos = await Equipo.find({ categoria: categoriaId });

    let listaEquipos = [...equipos];

    // Si hay número impar, agregamos "Descanso"
    if (listaEquipos.length % 2 !== 0) {
      const descanso = new Equipo({ nombre: 'Descanso', categoria: categoriaId });
      await descanso.save();
      listaEquipos.push(descanso);
    }

    const totalJornadas = (listaEquipos.length - 1) * vueltas;
    const mitad = listaEquipos.length / 2;

    const jornadas = [];

    // Generar para cada vuelta
    for (let v = 0; v < vueltas; v++) {
      let equiposCopia = [...listaEquipos];
      for (let j = 0; j < listaEquipos.length - 1; j++) {
        const partidos = [];
        for (let i = 0; i < mitad; i++) {
          const local = equiposCopia[i];
          const visitante = equiposCopia[equiposCopia.length - 1 - i];

          partidos.push({
            local: v % 2 === 0 ? local._id : visitante._id,
            visitante: v % 2 === 0 ? visitante._id : local._id,
            vuelta: v + 1
          });
        }

        jornadas.push({
          categoria: categoriaId,
          numero: j + 1 + v * (listaEquipos.length - 1),
          partidos
        });

        // Rotar equipos (excepto el primero)
        const fijo = equiposCopia[0];
        const rotados = [fijo, ...equiposCopia.slice(1, -1).slice(1), equiposCopia[1]];
        equiposCopia = rotados;
      }
    }

    // Guardar jornadas
    await Jornada.insertMany(jornadas);

    res.status(201).json({ mensaje: 'Jornadas generadas correctamente', total: jornadas.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al generar jornadas', error });
  }
};

module.exports = {
  generarJornadas
};
