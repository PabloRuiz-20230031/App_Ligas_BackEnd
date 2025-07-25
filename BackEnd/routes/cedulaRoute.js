const express = require('express');
const router = express.Router();
const {
  crearCedula,
  obtenerCedulasPorCategoria
} = require('../controllers/cedulaController');

const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.post('/cedulas', verificarToken, soloAdmin, crearCedula);
router.get('/cedulas/:categoriaId', verificarToken, obtenerCedulasPorCategoria);

module.exports = router;
