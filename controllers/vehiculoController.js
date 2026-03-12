const Vehiculo = require('../models/vehiculoModel');

const vehiculoController = {
    listar: (req, res) => {
        Vehiculo.obtenerTodos((err, vehiculos) => {
            if (err) return res.send('Error al obtener vehículos');
            res.render('vehiculos/index', { vehiculos, busqueda: '' });
        });
    },

    mostrarFormulario: (req, res) => {
        res.render('vehiculos/crear');
    },

    crear: (req, res) => {
        Vehiculo.crear(req.body, (err) => {
            if (err) return res.send('Error al crear vehículo: ' + err.message);
            res.redirect('/vehiculos');
        });
    },

    mostrarEditar: (req, res) => {
        Vehiculo.obtenerPorId(req.params.id, (err, vehiculo) => {
            if (err || !vehiculo) return res.send('Vehículo no encontrado');
            res.render('vehiculos/editar', { vehiculo });
        });
    },

    editar: (req, res) => {
        Vehiculo.editar(req.params.id, req.body, (err) => {
            if (err) return res.send('Error al editar: ' + err.message);
            res.redirect('/vehiculos');
        });
    },

    buscar: (req, res) => {
        const placa = req.query.placa || '';
        Vehiculo.buscarPorPlaca(placa, (err, vehiculos) => {
            if (err) return res.send('Error al buscar');
            res.render('vehiculos/index', { vehiculos, busqueda: placa });
        });
    },

    verInfracciones: (req, res) => {
        const id = req.params.id;
        Vehiculo.obtenerPorId(id, (err, vehiculo) => {
            if (err || !vehiculo) return res.send('Vehículo no encontrado');
            Vehiculo.obtenerInfracciones(id, (err2, infracciones) => {
                if (err2) return res.send('Error al obtener infracciones');
                const total = infracciones.reduce((sum, i) => sum + Number(i.valor_multa), 0);
                res.render('vehiculos/infracciones', { vehiculo, infracciones, total });
            });
        });
    },

    eliminar: (req, res) => {
        Vehiculo.eliminar(req.params.id, (err) => {
            if (err) return res.send('Error al eliminar');
            res.redirect('/vehiculos');
        });
    }
};

module.exports = vehiculoController;