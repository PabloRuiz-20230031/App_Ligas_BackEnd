const mongoose = require('mongoose');

const tablaGoleoSchema = new mongoose.Schema({
  temporada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temporada',
    required: true
  },
  jugador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jugador',
    required: true
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  dorsal: {
    type: Number,
    required: true
  },
  goles: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

tablaGoleoSchema.index({ temporada: 1, jugador: 1 }, { unique: true }); // No repetir jugador por temporada

module.exports = mongoose.model('TablaGoleo', tablaGoleoSchema);
