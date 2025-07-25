const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema({
  local: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo'
  },
  visitante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo'
  },
  vuelta: {
    type: Number,
    required: true
  }
}, { _id: false });

const jornadaSchema = new mongoose.Schema({
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  numero: {
    type: Number,
    required: true
  },
  partidos: [partidoSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Jornada', jornadaSchema);
