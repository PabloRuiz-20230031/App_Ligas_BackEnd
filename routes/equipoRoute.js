const express = require('express');
const router = express.Router();
const {
  crearEquipo,
  obtenerEquipos,
  editarEquipo,
  eliminarEquipo
} = require('../controllers/equipoController');

router.post('/equipos', crearEquipo);
router.get('/equipos', obtenerEquipos);
router.put('/equipos/:id', editarEquipo);      // ✅ Editar equipo
router.delete('/equipos/:id', eliminarEquipo);  // ✅ Eliminar equipo

module.exports = router;
