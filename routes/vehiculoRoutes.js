const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehiculoController');

router.get('/', ctrl.listar);
router.get('/buscar', ctrl.buscar);
router.get('/crear', ctrl.mostrarFormulario);
router.post('/crear', ctrl.crear);
router.get('/editar/:id', ctrl.mostrarEditar);
router.post('/editar/:id', ctrl.editar);
router.get('/:id/infracciones', ctrl.verInfracciones);
router.post('/eliminar/:id', ctrl.eliminar);

module.exports = router;