const Representante = require('../models/representante');

const crearRepresentante = async (req, res) => {
  try {
    const { nombre, curp, telefono, correo, equipo } = req.body;

    const total = await Representante.countDocuments({ equipo });
    if (total >= 2) {
      return res.status(400).json({ mensaje: 'Este equipo ya tiene el máximo de 2 representantes' });
    }

    const nuevo = new Representante({ nombre, curp, telefono, correo, equipo });
    const guardado = await nuevo.save();

    res.status(201).json(guardado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'CURP ya registrada' });
    }
    res.status(500).json({ mensaje: 'Error al registrar representante', error });
  }
};

const obtenerRepresentantesPorEquipo = async (req, res) => {
  try {
    const { equipoId } = req.params;
    const representantes = await Representante.find({ equipo: equipoId });
    res.json(representantes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener representantes', error });
  }
};

module.exports = {
  crearRepresentante,
  obtenerRepresentantesPorEquipo
};
