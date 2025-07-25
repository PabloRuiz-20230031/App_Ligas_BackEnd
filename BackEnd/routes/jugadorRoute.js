const express = require('express');
const router = express.Router();
const {
  crearJugador,
  obtenerJugadoresPorEquipo
} = require('../controllers/jugadorController');

router.post('/jugadores', crearJugador);
router.get('/jugadores/:equipoId', obtenerJugadoresPorEquipo);

module.exports = router;
