const express = require('express');
const router = express.Router();
const {
  crearTemporadaCompleta,
  eliminarTemporada,
  editarTemporada,
  obtenerTemporadaPorCategoria,
  verificarTemporadaActiva,
  obtenerTablaPorTemporada,
  obtenerJornadasPorTemporada,
  obtenerTemporadasActivas,
  obtenerTodasTemporadasActivas
} = require('../controllers/temporadaCompletaController');

const { verificarToken, verificarTokenOpcional, soloAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas solo para admins
router.post('/crear-completa', verificarToken, soloAdmin, crearTemporadaCompleta);
router.delete('/:id', verificarToken, soloAdmin, eliminarTemporada);
router.put('/:id', verificarToken, soloAdmin, editarTemporada);

// Rutas públicas o con token opcional
router.get('/activas', verificarTokenOpcional, obtenerTodasTemporadasActivas); // ✅ debe ir antes que /activas/:ligaId
router.get('/activas/:ligaId', verificarTokenOpcional, obtenerTemporadasActivas);
router.get('/categoria/:categoriaId', verificarTokenOpcional, obtenerTemporadaPorCategoria);
router.get('/tabla/:temporadaId', verificarTokenOpcional, obtenerTablaPorTemporada);
router.get('/jornadas/:temporadaId', verificarTokenOpcional, obtenerJornadasPorTemporada);

module.exports = router;
