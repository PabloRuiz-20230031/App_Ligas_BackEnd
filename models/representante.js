const mongoose = require('mongoose');

const representanteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  curp: {
    type: String,
    uppercase: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Acepta vacío
        return /^[A-Z][AEIOU][A-Z]{2}\d{6}[HM][A-Z]{2}[A-Z]{3}[0-9A-Z]\d$/.test(v);
      },
      message: 'CURP no válida'
    }
  },
  telefono: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Teléfono no válido']
  },
  correo: {
    type: String,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Correo no válido']
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  }
}, {
  timestamps: true
});

// ✅ Validar máximo 2 representantes por equipo se mantiene en el controlador
module.exports = mongoose.model('Representante', representanteSchema);
