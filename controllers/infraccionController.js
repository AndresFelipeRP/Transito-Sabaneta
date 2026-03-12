const Infraccion = require('../models/infraccionModel');

const infraccionController = {
    listar: (req, res) => {
        Infraccion.obtenerTodas((err, infracciones) => {
            if (err) return res.send('Error al obtener infracciones');
            res.render('infracciones/index', { infracciones });
        });
    },

    mostrarFormulario: (req, res) => {
        Infraccion.obtenerVehiculos((err, vehiculos) => {
            if (err) return res.send('Error');
            Infraccion.obtenerFuentes((err2, fuentes) => {
                if (err2) return res.send('Error');
                res.render('infracciones/crear', { vehiculos, fuentes });
            });
        });
    },

    mostrarFormularioFuente: (req, res) => {
        res.render('infracciones/crearFuente');
    },

    crearFuente: (req, res) => {
        Infraccion.crearFuente(req.body, (err) => {
            if (err) return res.send('Error al crear fuente: ' + err.message);
            res.redirect('/infracciones/crear');
        });
    },

    crear: (req, res) => {
        Infraccion.crear(req.body, (err) => {
            if (err) return res.send('Error al crear infracción: ' + err.message);
            res.redirect('/infracciones');
        });
    },

    mostrarEditar: (req, res) => {
        Infraccion.obtenerPorId(req.params.id, (err, infraccion) => {
            if (err || !infraccion) return res.send('Infracción no encontrada');
            res.render('infracciones/editar', { infraccion });
        });
    },

    editar: (req, res) => {
        Infraccion.editar(req.params.id, req.body, (err) => {
            if (err) return res.send('Error al editar: ' + err.message);
            res.redirect('/infracciones');
        });
    },

    eliminar: (req, res) => {
        Infraccion.eliminar(req.params.id, (err) => {
            if (err) return res.send('Error al eliminar');
            res.redirect('/infracciones');
        });
    }
};

module.exports = infraccionController;