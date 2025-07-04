const express = require('express');
const router = express.Router();
const {
  crearCategoria,
  obtenerCategorias
} = require('../controllers/categoriaController');

router.post('/categorias', crearCategoria);
router.get('/categorias', obtenerCategorias);

module.exports = router;
