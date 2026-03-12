const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/infraccionController');

router.get('/', ctrl.listar);
router.get('/crear', ctrl.mostrarFormulario);
router.post('/crear', ctrl.crear);
router.get('/fuente/crear', ctrl.mostrarFormularioFuente);
router.post('/fuente/crear', ctrl.crearFuente);
router.get('/editar/:id', ctrl.mostrarEditar);
router.post('/editar/:id', ctrl.editar);
router.post('/eliminar/:id', ctrl.eliminar);

module.exports = router;