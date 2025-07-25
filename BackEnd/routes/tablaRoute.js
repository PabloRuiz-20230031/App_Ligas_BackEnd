const express = require('express');
const router = express.Router();
const { obtenerTablaPorCategoria } = require('../controllers/tablaController');

router.get('/tabla/:ligaId/:categoriaId', obtenerTablaPorCategoria);

module.exports = router;
