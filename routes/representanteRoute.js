const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const {
  crearRepresentante,
  obtenerRepresentantesPorEquipo,
  actualizarRepresentante,
  eliminarRepresentante,
  obtenerRepresentantePorId
} = require('../controllers/representanteController');

// Montado en /api/representantes
router.post('/', crearRepresentante); // POST /api/representantes
router.get('/equipo/:equipoId', obtenerRepresentantesPorEquipo); // GET /api/representantes/equipo/:equipoId
router.get('/:id', obtenerRepresentantePorId);                    // GET /api/representantes/:id
router.put('/:id', actualizarRepresentante);
router.delete('/:id', eliminarRepresentante,verificarToken, soloAdmin);

module.exports = router;
