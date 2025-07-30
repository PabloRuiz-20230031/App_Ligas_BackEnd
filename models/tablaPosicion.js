const mongoose = require('mongoose');

const tablaSchema = new mongoose.Schema({
  temporada: { type: mongoose.Schema.Types.ObjectId, ref: 'Temporada', required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  PJ: { type: Number, default: 0 },
  PG: { type: Number, default: 0 },
  PE: { type: Number, default: 0 },
  PP: { type: Number, default: 0 },
  GF: { type: Number, default: 0 },
  GC: { type: Number, default: 0 },
  DIF: { type: Number, default: 0 },
  PTS: { type: Number, default: 0 }
});

module.exports = mongoose.model('Tabla', tablaSchema);