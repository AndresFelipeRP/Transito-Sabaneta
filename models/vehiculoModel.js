const db = require('../config/db');

const Vehiculo = {
    obtenerTodos: (callback) => {
        const sql = `
            SELECT v.*, m.numero_matricula, m.fecha_matricula,
                p.nombre AS nombre_propietario
            FROM vehiculo v
            LEFT JOIN matricula m ON v.id = m.vehiculo_id
            LEFT JOIN propietario p ON m.propietario_id = p.id
        `;
        db.query(sql, callback);
    },

    obtenerPorId: (id, callback) => {
        const sql = `
            SELECT v.*,
                a.numero_puertas, a.tipo_combustible,
                mo.tipo_moto, mo.cilindrada,
                cp.capacidad_carga, cp.tipo_carroceria
            FROM vehiculo v
            LEFT JOIN automovil a ON v.id = a.id
            LEFT JOIN moto mo ON v.id = mo.id
            LEFT JOIN carro_pesado cp ON v.id = cp.id
            WHERE v.id = ?
        `;
        db.query(sql, [id], (err, rows) => {
            callback(err, rows[0]);
        });
    },

    buscarPorPlaca: (placa, callback) => {
        const sql = `
            SELECT v.*, m.numero_matricula, m.fecha_matricula,
                p.nombre AS nombre_propietario, p.identificacion,
                p.direccion, p.tipo AS tipo_propietario
            FROM vehiculo v
            LEFT JOIN matricula m ON v.id = m.vehiculo_id
            LEFT JOIN propietario p ON m.propietario_id = p.id
            WHERE v.placa LIKE ?
        `;
        db.query(sql, [`%${placa}%`], callback);
    },

    obtenerInfracciones: (id, callback) => {
        const sql = `
            SELECT i.*, f.tipo AS tipo_fuente, f.ubicacion,
                a.nombre AS nombre_agente, a.badge,
                c.codigo_camara
            FROM infraccion i
            JOIN fuente_deteccion f ON i.fuente_id = f.id
            LEFT JOIN agente_transito a ON f.id = a.id
            LEFT JOIN camara_deteccion c ON f.id = c.id
            WHERE i.vehiculo_id = ?
            ORDER BY i.fecha_infraccion DESC
        `;
        db.query(sql, [id], callback);
    },

    crear: (datos, callback) => {
        const { placa, marca, modelo, tipo,
                numero_puertas, tipo_combustible,
                tipo_moto, cilindrada,
                capacidad_carga, tipo_carroceria } = datos;

        db.query(
            'INSERT INTO vehiculo (placa, marca, modelo, tipo) VALUES (?,?,?,?)',
            [placa, marca, modelo, tipo],
            (err, result) => {
                if (err) return callback(err);
                const nuevoId = result.insertId;

                if (tipo === 'automovil') {
                    db.query(
                        'INSERT INTO automovil (id, numero_puertas, tipo_combustible) VALUES (?,?,?)',
                        [nuevoId, numero_puertas, tipo_combustible], callback
                    );
                } else if (tipo === 'moto') {
                    db.query(
                        'INSERT INTO moto (id, tipo_moto, cilindrada) VALUES (?,?,?)',
                        [nuevoId, tipo_moto, cilindrada], callback
                    );
                } else {
                    db.query(
                        'INSERT INTO carro_pesado (id, capacidad_carga, tipo_carroceria) VALUES (?,?,?)',
                        [nuevoId, capacidad_carga, tipo_carroceria], callback
                    );
                }
            }
        );
    },

    editar: (id, datos, callback) => {
        const { marca, modelo, tipo,
                numero_puertas, tipo_combustible,
                tipo_moto, cilindrada,
                capacidad_carga, tipo_carroceria } = datos;

        db.query(
            'UPDATE vehiculo SET marca=?, modelo=? WHERE id=?',
            [marca, modelo, id],
            (err) => {
                if (err) return callback(err);
                if (tipo === 'automovil') {
                    db.query(
                        'UPDATE automovil SET numero_puertas=?, tipo_combustible=? WHERE id=?',
                        [numero_puertas, tipo_combustible, id], callback
                    );
                } else if (tipo === 'moto') {
                    db.query(
                        'UPDATE moto SET tipo_moto=?, cilindrada=? WHERE id=?',
                        [tipo_moto, cilindrada, id], callback
                    );
                } else {
                    db.query(
                        'UPDATE carro_pesado SET capacidad_carga=?, tipo_carroceria=? WHERE id=?',
                        [capacidad_carga, tipo_carroceria, id], callback
                    );
                }
            }
        );
    },

    eliminar: (id, callback) => {
        db.query('DELETE FROM vehiculo WHERE id = ?', [id], callback);
    }
};

module.exports = Vehiculo;