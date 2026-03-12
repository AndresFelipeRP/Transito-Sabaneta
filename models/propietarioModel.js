const db = require('../config/db');

const Propietario = {
    obtenerTodos: (callback) => {
        const sql = `
            SELECT p.*, 
                pe.apellido, pe.telefono AS tel_persona,
                e.representante_legal, e.telefono AS tel_empresa
            FROM propietario p
            LEFT JOIN persona pe ON p.id = pe.id
            LEFT JOIN empresa e ON p.id = e.id
        `;
        db.query(sql, callback);
    },

    obtenerPorId: (id, callback) => {
        const sql = `
            SELECT p.*, 
                pe.apellido, pe.telefono AS tel_persona,
                e.representante_legal, e.telefono AS tel_empresa
            FROM propietario p
            LEFT JOIN persona pe ON p.id = pe.id
            LEFT JOIN empresa e ON p.id = e.id
            WHERE p.id = ?
        `;
        db.query(sql, [id], (err, rows) => {
            callback(err, rows[0]);
        });
    },

    crear: (datos, callback) => {
        const { identificacion, nombre, direccion, tipo,
                apellido, tel_persona, representante_legal, tel_empresa } = datos;

        db.query(
            'INSERT INTO propietario (identificacion, nombre, direccion, tipo) VALUES (?,?,?,?)',
            [identificacion, nombre, direccion, tipo],
            (err, result) => {
                if (err) return callback(err);
                const nuevoId = result.insertId;

                if (tipo === 'persona') {
                    db.query(
                        'INSERT INTO persona (id, apellido, telefono) VALUES (?,?,?)',
                        [nuevoId, apellido, tel_persona], callback
                    );
                } else {
                    db.query(
                        'INSERT INTO empresa (id, representante_legal, telefono) VALUES (?,?,?)',
                        [nuevoId, representante_legal, tel_empresa], callback
                    );
                }
            }
        );
    },

    editar: (id, datos, callback) => {
        const { nombre, direccion, apellido, tel_persona,
                representante_legal, tel_empresa, tipo } = datos;

        db.query(
            'UPDATE propietario SET nombre=?, direccion=? WHERE id=?',
            [nombre, direccion, id],
            (err) => {
                if (err) return callback(err);
                if (tipo === 'persona') {
                    db.query(
                        'UPDATE persona SET apellido=?, telefono=? WHERE id=?',
                        [apellido, tel_persona, id], callback
                    );
                } else {
                    db.query(
                        'UPDATE empresa SET representante_legal=?, telefono=? WHERE id=?',
                        [representante_legal, tel_empresa, id], callback
                    );
                }
            }
        );
    },

    eliminar: (id, callback) => {
        db.query('DELETE FROM propietario WHERE id = ?', [id], callback);
    }
};

module.exports = Propietario;