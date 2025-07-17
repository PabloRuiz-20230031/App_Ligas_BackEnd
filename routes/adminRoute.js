const express = require('express');
const router = express.Router();
const { obtenerResumenAdmin } = require('../controllers/adminController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/admin/dashboard', verificarToken, soloAdmin, obtenerResumenAdmin);

module.exports = router;
