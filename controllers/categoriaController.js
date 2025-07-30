const Categoria = require('../models/categoria');
const Equipo = require('../models/equipo');       // ✅ Importa aquí
const Temporada = require('../models/temporada');

const crearCategoria = async (req, res) => {
  try {
    const { nombre, liga, imagen, descripcion } = req.body;

    const nuevaCategoria = new Categoria({ nombre, liga, imagen, descripcion});
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

const obtenerCategoriasPorLiga = async (req, res) => {
  try {
    const { ligaId } = req.params;

    const categorias = await Categoria.find({ liga: ligaId }).populate('liga', 'nombre');

    const resultado = await Promise.all(
      categorias.map(async (cat) => {
        const totalEquipos = await Equipo.countDocuments({ categoria: cat._id });
        const tieneTemporada = await Temporada.exists({ categoria: cat._id });

       return {
        _id: cat._id,
        nombre: cat.nombre,
        liga: cat.liga,
        imagen: cat.imagen, // ✅ agregado
        descripcion: cat.descripcion, // opcional
        totalEquipos,
        tieneTemporada: !!tieneTemporada
      };
      })
    );

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener categorías por liga:', error);
    res.status(500).json({ mensaje: 'Error al obtener categorías', error });
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, liga, imagen } = req.body;

    const actualizada = await Categoria.findByIdAndUpdate(
      id,
      { nombre, liga, imagen },
      { new: true, runValidators: true }
    );

    if (!actualizada) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json(actualizada);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre en esta liga' });
    }
    res.status(500).json({ mensaje: 'Error al actualizar categoría', error });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Categoria.findByIdAndDelete(id);

    if (!eliminada) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar categoría', error });
  }
};

const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('liga', 'nombre');

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    console.error('❌ Error al obtener categoría por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener la categoría', error });
  }
};



module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriasPorLiga,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoriaPorId  
};
