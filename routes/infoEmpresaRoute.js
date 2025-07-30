const express = require('express');
const router = express.Router();
const { obtenerInfo, actualizarInfo } = require('../controllers/infoEmpresaController');

// Rutas
router.get('/:tipo', obtenerInfo);
router.put('/:tipo', actualizarInfo);

module.exports = router;
