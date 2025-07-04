const RedSocial = require('../models/redSocial');

// Obtener todas las redes
const obtenerRedes = async (req, res) => {
  try {
    const redes = await RedSocial.find();
    res.json(redes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las redes sociales', error });
  }
};

// Actualizar una red por plataforma
const actualizarRed = async (req, res) => {
  const { plataforma } = req.params;
  const { url } = req.body;

  try {
    const red = await RedSocial.findOneAndUpdate(
      { plataforma },
      { url },
      { new: true, upsert: true }
    );
    res.json(red);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la red social', error });
  }
};

module.exports = {
  obtenerRedes,
  actualizarRed,
};
