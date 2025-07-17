const mongoose = require('mongoose');

const tablaPosicionSchema = new mongoose.Schema({
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  PJ: { type: Number, default: 0 },
  PG: { type: Number, default: 0 },
  PE: { type: Number, default: 0 },
  PP: { type: Number, default: 0 },
  GF: { type: Number, default: 0 },
  GC: { type: Number, default: 0 },
  DIF: { type: Number, default: 0 },
  PTS: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Para evitar duplicados por categoría y equipo
tablaPosicionSchema.index({ categoria: 1, equipo: 1 }, { unique: true });

module.exports = mongoose.model('TablaPosicion', tablaPosicionSchema);
