const InfoEmpresa = require('../models/infoEmpresa');

// Obtener información por tipo
const obtenerInfo = async (req, res) => {
  const { tipo } = req.params;
  try {
    const info = await InfoEmpresa.findOne({ tipo });
    if (!info) return res.status(404).json({ mensaje: 'No se encontró la información' });
    res.json(info);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la información', error });
  }
};

// Actualizar o crear información por tipo
const actualizarInfo = async (req, res) => {
  const { tipo } = req.params;
  const { nombre, correo, items } = req.body;

  try {
    const datos = { tipo };

    if (tipo === 'contacto') {
      datos.nombre = nombre;
      datos.correo = correo;
    } else {
      datos.items = items;
    }

    const info = await InfoEmpresa.findOneAndUpdate(
      { tipo },
      datos,
      { new: true, upsert: true }
    );

    res.json(info);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar la información', error });
  }
};

module.exports = {
  obtenerInfo,
  actualizarInfo,
};
