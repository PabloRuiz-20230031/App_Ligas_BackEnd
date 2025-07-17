const mongoose = require('mongoose');

const cedulaSchema = new mongoose.Schema({
    liga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Liga',
    required: true
  },
    categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  jornada: {
    type: Number,
    required: true
  },
  equipoLocal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  equipoVisitante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  golesLocal: {
    type: Number,
    required: true,
    min: 0
  },
  golesVisitante: {
    type: Number,
    required: true,
    min: 0
  },
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
  notas: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cedula', cedulaSchema);
 