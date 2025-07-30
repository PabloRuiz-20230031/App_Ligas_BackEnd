const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.post('/register', usuarioController.registrarUsuario);
router.post('/login', usuarioController.iniciarSesion);
router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);
router.get('/buscar', verificarToken, soloAdmin, usuarioController.buscarUsuarioPorCorreo);
router.put('/:id/rol', verificarToken, soloAdmin, usuarioController.cambiarRolUsuario);
router.put('/perfil', verificarToken, soloAdmin, usuarioController.actualizarPerfil);
router.post('/recuperar-contrasena', usuarioController.recuperarContrasena);

module.exports = router;
