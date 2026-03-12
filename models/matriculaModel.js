const db = require('../config/db');

const Matricula = {
    obtenerTodas: (callback) => {
        const sql = `
            SELECT m.*, v.placa, v.marca, v.modelo,
                p.nombre AS nombre_propietario, p.identificacion
            FROM matricula m
            JOIN vehiculo v ON m.vehiculo_id = v.id
            JOIN propietario p ON m.propietario_id = p.id
        `;
        db.query(sql, callback);
    },

    obtenerPorId: (id, callback) => {
        const sql = `
            SELECT m.*, v.placa, v.marca, v.modelo,
                p.nombre AS nombre_propietario
            FROM matricula m
            JOIN vehiculo v ON m.vehiculo_id = v.id
            JOIN propietario p ON m.propietario_id = p.id
            WHERE m.id = ?
        `;
        db.query(sql, [id], (err, rows) => {
            callback(err, rows[0]);
        });
    },

    obtenerVehiculosSinMatricula: (callback) => {
        db.query(`
            SELECT * FROM vehiculo 
            WHERE id NOT IN (SELECT vehiculo_id FROM matricula)
        `, callback);
    },

    obtenerPropietarios: (callback) => {
        db.query('SELECT * FROM propietario', callback);
    },

    crear: (datos, callback) => {
        const { numero_matricula, fecha_matricula, vehiculo_id, propietario_id } = datos;
        db.query(
            'INSERT INTO matricula (numero_matricula, fecha_matricula, vehiculo_id, propietario_id) VALUES (?,?,?,?)',
            [numero_matricula, fecha_matricula, vehiculo_id, propietario_id],
            callback
        );
    },

    editar: (id, datos, callback) => {
        const { fecha_matricula, propietario_id } = datos;
        db.query(
            'UPDATE matricula SET fecha_matricula=?, propietario_id=? WHERE id=?',
            [fecha_matricula, propietario_id, id],
            callback
        );
    },

    eliminar: (id, callback) => {
        db.query('DELETE FROM matricula WHERE id = ?', [id], callback);
    }
};

module.exports = Matricula;