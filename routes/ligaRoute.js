const express = require('express');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const {
  crearLiga,
  obtenerLigas,
  actualizarLiga,
  eliminarLiga,
  buscarLigas,
  obtenerLigaPorId
} = require('../controllers/ligaController');

// ⚠️ Elimina '/ligas' del path — ya está incluido por app.use('/api/ligas', ...)
router.post('/', crearLiga);
router.get('/', obtenerLigas);
router.get('/buscar', buscarLigas);
router.get('/:id', obtenerLigaPorId);
router.put('/:id', actualizarLiga);
router.delete('/:id', eliminarLiga, verificarToken, soloAdmin);


module.exports = router;

