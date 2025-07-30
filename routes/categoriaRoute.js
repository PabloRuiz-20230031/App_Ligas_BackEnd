const express = require('express');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriasPorLiga,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoriaPorId
} = require('../controllers/categoriaController');

// Ya no pongas '/categorias', solo rutas relativas
router.post('/', crearCategoria);                             // POST /api/categorias
router.get('/', obtenerCategorias);   
router.get('/:id', obtenerCategoriaPorId);                       // GET /api/categorias
router.get('/por-liga/:ligaId', obtenerCategoriasPorLiga);   // ✅ GET /api/categorias/por-liga/:ligaId
router.put('/:id', actualizarCategoria);                     // PUT /api/categorias/:id
router.delete('/:id', eliminarCategoria, verificarToken, soloAdmin);
                    // DELETE /api/categorias/:id

module.exports = router;