const db = require('../config/db');

const Infraccion = {
    obtenerTodas: (callback) => {
        const sql = `
            SELECT i.*, v.placa, v.marca,
                f.tipo AS tipo_fuente, f.ubicacion,
                a.nombre AS nombre_agente, a.badge,
                c.codigo_camara
            FROM infraccion i
            JOIN vehiculo v ON i.vehiculo_id = v.id
            JOIN fuente_deteccion f ON i.fuente_id = f.id
            LEFT JOIN agente_transito a ON f.id = a.id
            LEFT JOIN camara_deteccion c ON f.id = c.id
        `;
        db.query(sql, callback);
    },

    obtenerPorId: (id, callback) => {
        const sql = `
            SELECT i.*, v.placa, v.marca,
                f.tipo AS tipo_fuente, f.ubicacion
            FROM infraccion i
            JOIN vehiculo v ON i.vehiculo_id = v.id
            JOIN fuente_deteccion f ON i.fuente_id = f.id
            WHERE i.id = ?
        `;
        db.query(sql, [id], (err, rows) => {
            callback(err, rows[0]);
        });
    },

    obtenerVehiculos: (callback) => {
        db.query('SELECT * FROM vehiculo', callback);
    },

    obtenerFuentes: (callback) => {
        db.query('SELECT * FROM fuente_deteccion', callback);
    },

    crearFuente: (datos, callback) => {
        const { ubicacion, tipo, nombre, badge, turno, codigo_camara, coordenadas } = datos;
        db.query(
            'INSERT INTO fuente_deteccion (ubicacion, tipo) VALUES (?,?)',
            [ubicacion, tipo],
            (err, result) => {
                if (err) return callback(err);
                const nuevoId = result.insertId;
                if (tipo === 'agente') {
                    db.query(
                        'INSERT INTO agente_transito (id, nombre, badge, turno) VALUES (?,?,?,?)',
                        [nuevoId, nombre, badge, turno], callback
                    );
                } else {
                    db.query(
                        'INSERT INTO camara_deteccion (id, codigo_camara, coordenadas) VALUES (?,?,?)',
                        [nuevoId, codigo_camara, coordenadas], callback
                    );
                }
            }
        );
    },

    crear: (datos, callback) => {
        const { fecha_infraccion, descripcion, valor_multa, vehiculo_id, fuente_id } = datos;
        db.query(
            'INSERT INTO infraccion (fecha_infraccion, descripcion, valor_multa, vehiculo_id, fuente_id) VALUES (?,?,?,?,?)',
            [fecha_infraccion, descripcion, valor_multa, vehiculo_id, fuente_id],
            callback
        );
    },

    editar: (id, datos, callback) => {
        const { fecha_infraccion, descripcion, valor_multa } = datos;
        db.query(
            'UPDATE infraccion SET fecha_infraccion=?, descripcion=?, valor_multa=? WHERE id=?',
            [fecha_infraccion, descripcion, valor_multa, id],
            callback
        );
    },

    eliminar: (id, callback) => {
        db.query('DELETE FROM infraccion WHERE id = ?', [id], callback);
    }
};

module.exports = Infraccion;