const Matricula = require('../models/matriculaModel');

const matriculaController = {
    listar: (req, res) => {
        Matricula.obtenerTodas((err, matriculas) => {
            if (err) return res.send('Error al obtener matrículas');
            res.render('matriculas/index', { matriculas });
        });
    },

    mostrarFormulario: (req, res) => {
        Matricula.obtenerVehiculosSinMatricula((err, vehiculos) => {
            if (err) return res.send('Error');
            Matricula.obtenerPropietarios((err2, propietarios) => {
                if (err2) return res.send('Error');
                res.render('matriculas/crear', { vehiculos, propietarios });
            });
        });
    },

    crear: (req, res) => {
        Matricula.crear(req.body, (err) => {
            if (err) return res.send('Error al crear matrícula: ' + err.message);
            res.redirect('/matriculas');
        });
    },

    mostrarEditar: (req, res) => {
        Matricula.obtenerPorId(req.params.id, (err, matricula) => {
            if (err || !matricula) return res.send('Matrícula no encontrada');
            Matricula.obtenerPropietarios((err2, propietarios) => {
                if (err2) return res.send('Error');
                res.render('matriculas/editar', { matricula, propietarios });
            });
        });
    },

    editar: (req, res) => {
        Matricula.editar(req.params.id, req.body, (err) => {
            if (err) return res.send('Error al editar: ' + err.message);
            res.redirect('/matriculas');
        });
    },

    eliminar: (req, res) => {
        Matricula.eliminar(req.params.id, (err) => {
            if (err) return res.send('Error al eliminar');
            res.redirect('/matriculas');
        });
    }
};

module.exports = matriculaController;