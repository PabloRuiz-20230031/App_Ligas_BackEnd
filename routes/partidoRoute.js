const express = require('express');
const router = express.Router();
const {
  crearPartido,
  obtenerPartidosPorCategoria,
  eliminarPartido,
  obtenerPartidosPorTemporada,
  obtenerJugadoresDePartido,
  obtenerJornadasPorEquipo
} = require('../controllers/partidoController');

const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, crearPartido);
router.get('/categoria/:categoriaId', obtenerPartidosPorCategoria);
router.get('/temporada/:temporadaId', obtenerPartidosPorTemporada);
router.get('/:partidoId/jugadores', obtenerJugadoresDePartido);
router.get('/equipo/:equipoId', obtenerJornadasPorEquipo);// ✅ nueva ruta
router.delete('/:id', verificarToken, eliminarPartido);

module.exports = router;
