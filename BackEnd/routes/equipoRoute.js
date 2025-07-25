const express = require('express');
const router = express.Router();
const {
  crearEquipo,
  obtenerEquipos
} = require('../controllers/equipoController');

router.post('/equipos', crearEquipo);
router.get('/equipos', obtenerEquipos);

module.exports = router;
