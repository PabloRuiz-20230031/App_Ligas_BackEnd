const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema({
  temporada: { type: mongoose.Schema.Types.ObjectId, ref: 'Temporada', required: true },
  liga: { type: mongoose.Schema.Types.ObjectId, ref: 'Liga', required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  jornada: { type: mongoose.Schema.Types.ObjectId, ref: 'Jornada', required: true },
  equipoLocal: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  equipoVisitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  fecha: { type: Date },
  hora: { type: String },
  cedula: { type: mongoose.Schema.Types.ObjectId, ref: 'Cedula' },
  vuelta: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Partido', partidoSchema);