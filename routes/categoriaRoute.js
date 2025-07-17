const express = require('express');
const router = express.Router();
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriasPorLiga,
  actualizarCategoria,
  eliminarCategoria
} = require('../controllers/categoriaController');

router.post('/categorias', crearCategoria);
router.get('/categorias', obtenerCategorias);
router.get('/por-liga/:ligaId', obtenerCategoriasPorLiga);
router.put('/categorias/:id', actualizarCategoria);
router.delete('/categorias/:id', eliminarCategoria);


module.exports = router;
