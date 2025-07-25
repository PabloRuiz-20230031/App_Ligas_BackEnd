const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/register', usuarioController.registrarUsuario);
router.post('/login', usuarioController.iniciarSesion);
router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);

module.exports = router;
