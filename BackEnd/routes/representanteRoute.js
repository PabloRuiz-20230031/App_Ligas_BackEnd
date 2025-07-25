const express = require('express');
const router = express.Router();
const {
  crearRepresentante,
  obtenerRepresentantesPorEquipo
} = require('../controllers/representanteController');

router.post('/representantes', crearRepresentante);
router.get('/representantes/:equipoId', obtenerRepresentantesPorEquipo);

module.exports = router;
