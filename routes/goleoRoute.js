const express = require('express');
const router = express.Router();
const goleadorController = require('../controllers/tablaGoleoController');

router.get('/:temporadaId', goleadorController.obtenerTablaGoleoPorTemporada);
router.delete('/:temporadaId', goleadorController.reiniciarTablaGoleo);

module.exports = router;