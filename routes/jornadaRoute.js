const express = require('express');
const router = express.Router();
const { generarJornadas } = require('../controllers/jornadaController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// Ruta protegida, solo accesible por admins
router.post('/jornadas/generar', verificarToken, soloAdmin, generarJornadas);

module.exports = router;