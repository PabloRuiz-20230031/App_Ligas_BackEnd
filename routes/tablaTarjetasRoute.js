const express = require('express');
const router = express.Router();
const { obtenerTarjetasPorTemporada } = require('../controllers/tablaTarjetasController');

// Obtener todas las tarjetas de una temporada
// GET /api/tarjetas/:temporadaId
router.get('/:temporadaId', obtenerTarjetasPorTemporada);

module.exports = router;