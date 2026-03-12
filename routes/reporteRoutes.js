const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reporteController');

router.get('/', ctrl.index);
router.get('/infracciones-propietario', ctrl.infraccionesPorPropietario);
router.get('/infracciones-propietario/pdf', ctrl.infraccionesPorPropietarioPDF);
router.get('/propietarios-vehiculos', ctrl.propietariosYVehiculos);
router.get('/propietarios-vehiculos/pdf', ctrl.propietariosYVehiculosPDF);

module.exports = router;