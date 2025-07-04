const express = require('express');
const router = express.Router();
const { obtenerRedes, actualizarRed } = require('../controllers/redSocialController');
// const authMiddleware = require('../middlewares/authMiddleware'); // si quieres proteger con rol admin

router.get('/', obtenerRedes);

// Para permitir solo admin, descomenta y añade middleware
// router.put('/:plataforma', authMiddleware(['admin']), actualizarRed);
router.put('/:plataforma', actualizarRed);

module.exports = router;
