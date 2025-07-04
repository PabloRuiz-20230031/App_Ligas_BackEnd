const express = require('express');
const router = express.Router();
const { crearLiga, obtenerLigas } = require('../controllers/ligaController');

router.post('/ligas', crearLiga);
router.get('/ligas', obtenerLigas);

module.exports = router;
