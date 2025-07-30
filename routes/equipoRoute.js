const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const {
  crearEquipo,
  obtenerEquipos,
  editarEquipo,
  eliminarEquipo,
  obtenerEquipoPorId,
  obtenerEquiposPorCategoria,
  obtenerEquipoConInfo
} = require('../controllers/equipoController');

// Cambia los paths internos:
router.post('/', crearEquipo);                  // POST /api/equipos
router.get('/', obtenerEquipos);
router.get('/por-categoria/:categoriaId', obtenerEquiposPorCategoria); // ✅
router.get('/:id/info', obtenerEquipoConInfo);
router.get('/:id', obtenerEquipoPorId);                // GET /api/equipos
router.put('/:id', editarEquipo);               // PUT /api/equipos/:id
router.delete('/:id', eliminarEquipo, verificarToken, soloAdmin);          // DELETE /api/equipos/:id

module.exports = router;
