const express = require('express');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const {
  obtenerJugadoresPorEquipo,
  obtenerJugadorPorId,
  crearJugador,
  actualizarJugador,
  eliminarJugador
} = require('../controllers/jugadorController');

// 🟢 Todo se monta bajo /api/jugadores
router.get('/equipo/:equipoId', obtenerJugadoresPorEquipo); // GET /api/jugadores/equipo/:equipoId
router.get('/:id', obtenerJugadorPorId);                    // GET /api/jugadores/:id
router.post('/', crearJugador);                             // POST /api/jugadores
router.put('/:id', actualizarJugador);
router.delete('/:id', eliminarJugador, verificarToken, soloAdmin);

module.exports = router;
