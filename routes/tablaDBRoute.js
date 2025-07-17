const express = require('express');
const router = express.Router();
const { getTablaPorCategoria } = require('../controllers/tablaDBController');

router.get('/tabla-db/:categoriaId', getTablaPorCategoria);

module.exports = router;

