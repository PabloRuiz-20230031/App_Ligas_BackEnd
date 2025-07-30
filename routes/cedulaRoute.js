// routes/cedulaRoute.js
const express = require('express');
const router = express.Router();



const {
  crearCedula,
  obtenerCedulasPorTemporada,
  obtenerCedulaPorPartido,
  obtenerTablaGoleoPorTemporada
} = require('../controllers/cedulaController');

const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// ✅ QUITA el prefijo "cedulas" aquí, porque ya lo estás usando en app.js
router.post('/', verificarToken, soloAdmin, crearCedula);
router.get('/temporada/:temporadaId', verificarToken, obtenerCedulasPorTemporada);
router.get('/partido/:id', obtenerCedulaPorPartido);

module.exports = router;