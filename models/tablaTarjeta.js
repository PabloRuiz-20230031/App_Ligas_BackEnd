const mongoose = require('mongoose');

const tablaTarjetasSchema = new mongoose.Schema({
  jugador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jugador',
    required: true,
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true,
  },
  temporada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temporada',
    required: true,
  },
  amarillas: {
    type: Number,
    default: 0,
  },
  rojas: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

// Asegura que no se repita el mismo jugador en una misma temporada
tablaTarjetasSchema.index({ jugador: 1, temporada: 1 }, { unique: true });

module.exports = mongoose.model('TablaTarjetas', tablaTarjetasSchema);
