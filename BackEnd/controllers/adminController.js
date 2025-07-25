const Liga = require('../models/liga');
const Categoria = require('../models/categoria');
const Equipo = require('../models/equipo');
const Usuario = require('../models/usuario');
const Cedula = require('../models/cedula');

const obtenerResumenAdmin = async (req, res) => {
  try {
    const totalLigas = await Liga.countDocuments();
    const totalCategorias = await Categoria.countDocuments();
    const totalEquipos = await Equipo.countDocuments();
    const totalUsuarios = await Usuario.countDocuments({ rol: 'usuario' });
    const totalCédulas = await Cedula.countDocuments();

    res.json({
      totalLigas,
      totalCategorias,
      totalEquipos,
      totalUsuarios,
      totalCédulas
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener resumen del administrador', error });
  }
};

module.exports = {
  obtenerResumenAdmin
};
