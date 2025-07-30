const mongoose = require('mongoose');

const infoEmpresaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['contacto', 'terminos', 'politicas'],
    required: true,
    unique: true,
  },
  nombre: String, // Solo aplica si tipo = contacto
  correo: String, // Solo aplica si tipo = contacto
  items: [String], // Solo aplica para terminos y politicas
}, {
  timestamps: true,
});

module.exports = mongoose.model('InfoEmpresa', infoEmpresaSchema);
