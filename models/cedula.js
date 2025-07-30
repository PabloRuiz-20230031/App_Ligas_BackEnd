const mongoose = require('mongoose');

const cedulaSchema = new mongoose.Schema({
  partido: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: true },
  temporada: { type: mongoose.Schema.Types.ObjectId, ref: 'Temporada', required: true },
  liga: { type: mongoose.Schema.Types.ObjectId, ref: 'Liga', required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  jornada: { type: mongoose.Schema.Types.ObjectId, ref: 'Jornada', required: true },
  equipoLocal: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  equipoVisitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  golesLocal: { type: Number, required: true, min: 0 },
  golesVisitante: { type: Number, required: true, min: 0 },
  autogoles: [{
  equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' },
    minuto: String
  }],
  anotadoresLocal: [{
    jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'Jugador', required: true },
    minuto: { type: String, required: true }
  }],
  anotadoresVisitante: [{
    jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'Jugador', required: true },
    minuto: { type: String, required: true }
  }],
    amonestaciones: [{
    jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'Jugador' },
    minuto: Number,
    motivo: String
  }],
  expulsiones: [{
    jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'Jugador' },
    minuto: Number,
    causa: String
  }],
  notas: { type: String, trim: true }
}, {
  timestamps: true
});

// 🔧 FALTA ESTO EN TU CÓDIGO:
module.exports = mongoose.model('Cedula', cedulaSchema);
