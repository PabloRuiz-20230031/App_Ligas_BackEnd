const Temporada = require('../models/temporada');
const Jornada = require('../models/jornada');
const Partido = require('../models/partido');
const Tabla = require('../models/tablaPosicion');
const Categoria = require('../models/categoria');
const Equipo = require('../models/equipo');

const mongoose = require('mongoose');

const crearTemporadaCompleta = async (req, res) => {
  try {
    const { nombre, categoriaId, vueltas, fechaInicio, fechaFin } = req.body;

    // 1. Verificar si ya hay una temporada activa en la categoría
    const hoy = new Date();
    const temporadaActiva = await Temporada.findOne({
      categoria: categoriaId,
      fechaInicio: { $lte: hoy },
      fechaFin: { $gte: hoy }
    });

    if (temporadaActiva) {
      return res.status(400).json({ mensaje: 'Ya existe una temporada activa en esta categoría.' });
    }

    // 2. Crear temporada
    const temporada = new Temporada({
      nombre,
      categoria: categoriaId,
      vueltas,
      fechaInicio,
      fechaFin
    });

    const temporadaGuardada = await temporada.save();

    // 3. Obtener equipos de la categoría
    let equipos = await Equipo.find({ categoria: categoriaId });
    const equiposOriginales = [...equipos]; // para tabla (sin "Descanso")

    // 4. Agregar equipo "Descanso" si es impar
    let descansoId = null;
    if (equipos.length % 2 !== 0) {
      const descanso = new Equipo({
        nombre: 'Descanso',
        categoria: categoriaId,
        imagen: '',
        descripcion: 'Equipo generado automáticamente para jornadas impares'
      });
      const equipoDescanso = await descanso.save();
      equipos.push(equipoDescanso);
      descansoId = equipoDescanso._id;
    }

    const totalEquipos = equipos.length;
    const jornadasPorVuelta = totalEquipos - 1;
    const categoria = await Categoria.findById(categoriaId);
    const ligaId = categoria.liga;

    // 5. Crear jornadas y partidos
    for (let vuelta = 0; vuelta < vueltas; vuelta++) {
      let equiposCopia = [...equipos];

      for (let j = 0; j < jornadasPorVuelta; j++) {
        const jornada = new Jornada({
          categoria: categoriaId,
          temporada: temporadaGuardada._id,
          numero: j + 1 + vuelta * jornadasPorVuelta,
          partidos: []
        });

        const jornadaGuardada = await jornada.save();
        const partidosIds = [];

        for (let i = 0; i < totalEquipos / 2; i++) {
          const local = equiposCopia[i];
          const visitante = equiposCopia[totalEquipos - 1 - i];

          const partido = new Partido({
            temporada: temporadaGuardada._id,
            liga: ligaId,
            categoria: categoriaId,
            jornada: jornadaGuardada._id,
            equipoLocal: vuelta % 2 === 0 ? local._id : visitante._id,
            equipoVisitante: vuelta % 2 === 0 ? visitante._id : local._id,
            vuelta: vuelta + 1
          });

          const partidoGuardado = await partido.save();
          partidosIds.push(partidoGuardado._id);
        }

        jornadaGuardada.partidos = partidosIds;
        await jornadaGuardada.save();

        // Rotación estilo Round-Robin
        const fijo = equiposCopia[0];
        const rotados = [fijo, equiposCopia[equiposCopia.length - 1], ...equiposCopia.slice(1, -1)];
        equiposCopia = rotados;
      }
    }

    // 6. Crear tabla de posiciones (sin "Descanso")
    await Promise.all(equiposOriginales.map(async (equipo) => {
      const fila = new Tabla({
        categoria: categoriaId,
        temporada: temporadaGuardada._id,
        equipo: equipo._id,
        PJ: 0,
        PG: 0,
        PE: 0,
        PP: 0,
        GF: 0,
        GC: 0,
        DIF: 0,
        PTS: 0
      });
      await fila.save();
    }));

    res.status(201).json({
      mensaje: 'Temporada, jornadas y partidos creados correctamente.',
      temporada: temporadaGuardada
    });

  } catch (error) {
    console.error('❌ Error al crear temporada:', error);
    res.status(500).json({ mensaje: 'Error al crear temporada', error: error.message });
  }
};

const eliminarTemporada = async (req, res) => {
  try {
    const { id } = req.params;

    const temporada = await Temporada.findById(id);
    if (!temporada) {
      return res.status(404).json({ mensaje: 'Temporada no encontrada' });
    }

    // Eliminar equipo Descanso (si existe)
    await Equipo.deleteMany({ nombre: 'Descanso', categoria: temporada.categoria });

    // Eliminar jornadas, partidos, tabla
    await Jornada.deleteMany({ temporada: id });
    await Partido.deleteMany({ temporada: id });
    await Tabla.deleteMany({ temporada: id });

    // Eliminar temporada
    await Temporada.findByIdAndDelete(id);

    res.json({ mensaje: 'Temporada y registros asociados eliminados correctamente' });

  } catch (error) {
    console.error('❌ Error al eliminar temporada:', error);
    res.status(500).json({ mensaje: 'Error al eliminar temporada', error: error.message });
  }
};

const editarTemporada = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, vueltas, fechaInicio, fechaFin } = req.body;

    const actualizada = await Temporada.findByIdAndUpdate(
      id,
      { nombre, vueltas, fechaInicio, fechaFin },
      { new: true, runValidators: true }
    );

    if (!actualizada) {
      return res.status(404).json({ mensaje: 'Temporada no encontrada' });
    }

    res.json({ mensaje: 'Temporada actualizada correctamente', temporada: actualizada });
  } catch (error) {
    console.error('❌ Error al editar temporada:', error);
    res.status(500).json({ mensaje: 'Error al editar temporada', error: error.message });
  }
};

const obtenerTemporadaPorCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    // ⚠️ Forzamos a ObjectId por seguridad
    const categoriaObjectId = new mongoose.Types.ObjectId(categoriaId);

    const temporada = await Temporada.findOne({ categoria: categoriaObjectId });

    if (!temporada) {
      return res.status(404).json({ mensaje: 'No hay temporada registrada en esta categoría' });
    }

    res.json(temporada);
  } catch (error) {
    console.error('❌ Error al obtener temporada por categoría:', error);
    res.status(500).json({ mensaje: 'Error al obtener temporada', error: error.message });
  }
};

const verificarTemporadaActiva = async (req, res) => {
  const { categoriaId } = req.params;
  const hoy = new Date();

  try {
    const temporada = await Temporada.findOne({
      categoria: categoriaId,
      fechaInicio: { $lte: hoy },
      fechaFin: { $gte: hoy }
    });

    res.json({ activa: !!temporada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar temporada activa', error: error.message });
  }
};

const obtenerTablaPorTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    const tabla = await Tabla.find({ temporada: temporadaId })
      .populate('equipo', 'nombre imagen')
      .sort({ PTS: -1, DIF: -1, GF: -1 });

    res.json(tabla);
  } catch (error) {
    console.error('❌ Error al obtener tabla:', error);
    res.status(500).json({ mensaje: 'Error al obtener la tabla', error: error.message });
  }
};


const obtenerJornadasPorTemporada = async (req, res) => {
  try {
    const { temporadaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(temporadaId)) {
      return res.status(400).json({ mensaje: 'ID de temporada no válido' });
    }

    const jornadas = await Jornada.find({ temporada: temporadaId }).sort({ numero: 1 });

    if (!jornadas || jornadas.length === 0) {
      return res.json([]);
    }

    const jornadasConPartidos = await Promise.all(
      jornadas.map(async (jornada) => {
        const partidos = await Partido.find({ jornada: jornada._id })
          .populate('equipoLocal', 'nombre imagen')
          .populate('equipoVisitante', 'nombre imagen')
          .populate('cedula', '_id'); // ✅ Aquí traemos si ya tiene cédula

        const partidosConInfo = partidos.map(partido => {
          const equipoLocal = partido.equipoLocal || {
            nombre: 'Equipo eliminado',
            imagen: 'https://res.cloudinary.com/dprwy1viz/image/upload/v1753268469/descanso_qypb7w.webp'
          };

          const equipoVisitante = partido.equipoVisitante || {
            nombre: 'Equipo eliminado',
            imagen: 'https://res.cloudinary.com/dprwy1viz/image/upload/v1753268469/descanso_qypb7w.webp'
          };

          return {
            ...partido.toObject(),
            equipoLocal,
            equipoVisitante,
            tieneCedula: !!partido.cedula // 👈 indicador booleano
          };
        });

        return {
          _id: jornada._id,
          numero: jornada.numero,
          categoria: jornada.categoria,
          temporada: jornada.temporada,
          partidos: partidosConInfo
        };
      })
    );

    res.json(jornadasConPartidos);
  } catch (error) {
    console.error('❌ Error al obtener jornadas:', error);
    res.status(500).json({ mensaje: 'Error al obtener jornadas', error: error.message });
  }
};


const obtenerTemporadasActivas = async (req, res) => {
  try {
    const { ligaId } = req.params;
    const hoy = new Date();

    const temporadas = await Temporada.find({
      fechaInicio: { $lte: hoy },
      fechaFin: { $gte: hoy }
    }).populate({
      path: 'categoria',
      match: { liga: ligaId }
    });

    // Filtrar las que tengan categoría válida (porque el match podría dejar null)
    const activas = temporadas.filter(t => t.categoria !== null);

    res.json(activas);
  } catch (error) {
    console.error('❌ Error al obtener temporadas activas:', error);
    res.status(500).json({ mensaje: 'Error al obtener temporadas activas', error: error.message });
  }
};

const obtenerTodasTemporadasActivas = async (req, res) => {
  try {
    const hoy = new Date();

    const temporadas = await Temporada.find({
      fechaInicio: { $lte: hoy },
      fechaFin: { $gte: hoy }
    }).populate({
      path: 'categoria',
      populate: { path: 'liga', select: 'nombre' }
    });

    res.json(temporadas);
  } catch (error) {
    console.error('❌ Error al obtener todas las temporadas activas:', error);
    res.status(500).json({ mensaje: 'Error al obtener temporadas activas' });
  }
};



module.exports = {
  crearTemporadaCompleta,
  eliminarTemporada,
  editarTemporada,
  obtenerTemporadaPorCategoria,
  verificarTemporadaActiva,
  obtenerTablaPorTemporada,
  obtenerJornadasPorTemporada,
  obtenerTemporadasActivas,
  obtenerTodasTemporadasActivas,
};
