const mongoose = require('mongoose');

const jornadaSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  temporada: { type: mongoose.Schema.Types.ObjectId, ref: 'Temporada', required: true },
  partidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partido' }]
}, { timestamps: true });

module.exports = mongoose.model('Jornada', jornadaSchema);