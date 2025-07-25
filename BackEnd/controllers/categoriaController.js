const Categoria = require('../models/categoria');

const crearCategoria = async (req, res) => {
  try {
    const { nombre, liga, imagen } = req.body;

    const nuevaCategoria = new Categoria({ nombre, liga, imagen });
    const guardada = await nuevaCategoria.save();

    res.status(201).json(guardada);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ya existe esa categoría en esta liga' });
    }
    res.status(500).json({ mensaje: 'Error al crear categoría', error });
  }
};

const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().populate('liga', 'nombre');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías', error });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias
};
