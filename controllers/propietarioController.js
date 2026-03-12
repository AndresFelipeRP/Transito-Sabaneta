const Propietario = require('../models/propietarioModel');

const propietarioController = {
    listar: (req, res) => {
        Propietario.obtenerTodos((err, propietarios) => {
            if (err) return res.send('Error al obtener propietarios');
            res.render('propietarios/index', { propietarios });
        });
    },

    mostrarFormulario: (req, res) => {
        res.render('propietarios/crear');
    },

    crear: (req, res) => {
        Propietario.crear(req.body, (err) => {
            if (err) return res.send('Error al crear propietario: ' + err.message);
            res.redirect('/propietarios');
        });
    },

    mostrarEditar: (req, res) => {
        Propietario.obtenerPorId(req.params.id, (err, propietario) => {
            if (err || !propietario) return res.send('Propietario no encontrado');
            res.render('propietarios/editar', { propietario });
        });
    },

    editar: (req, res) => {
        Propietario.editar(req.params.id, req.body, (err) => {
            if (err) return res.send('Error al editar: ' + err.message);
            res.redirect('/propietarios');
        });
    },

    eliminar: (req, res) => {
        Propietario.eliminar(req.params.id, (err) => {
            if (err) return res.send('Error al eliminar');
            res.redirect('/propietarios');
        });
    }
};

module.exports = propietarioController;