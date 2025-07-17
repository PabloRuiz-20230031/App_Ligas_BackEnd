const express = require('express');
const router = express.Router();
const {
  crearLiga,
  obtenerLigas,
  actualizarLiga,
  eliminarLiga
} = require('../controllers/ligaController');

router.post('/ligas', crearLiga);
router.get('/ligas', obtenerLigas);
router.put('/ligas/:id', actualizarLiga);     // ✅ NUEVO
router.delete('/ligas/:id', eliminarLiga);    // ✅ NUEVO

module.exports = router;
