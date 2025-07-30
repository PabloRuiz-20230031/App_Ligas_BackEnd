const mongoose = require('mongoose');

const temporadaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  vueltas: { type: Number, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  creadaEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temporada', temporadaSchema);
