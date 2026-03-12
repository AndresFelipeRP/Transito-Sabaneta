const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/matriculaController');

router.get('/', ctrl.listar);
router.get('/crear', ctrl.mostrarFormulario);
router.post('/crear', ctrl.crear);
router.get('/editar/:id', ctrl.mostrarEditar);
router.post('/editar/:id', ctrl.editar);
router.post('/eliminar/:id', ctrl.eliminar);

module.exports = router;