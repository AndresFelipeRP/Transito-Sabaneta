const db = require('../config/db');

const Estadistica = {
    resumen: (callback) => {
        const sql = `
            SELECT
                (SELECT COUNT(*) FROM propietario) AS total_propietarios,
                (SELECT COUNT(*) FROM vehiculo) AS total_vehiculos,
                (SELECT COUNT(*) FROM infraccion) AS total_infracciones,
                (SELECT COALESCE(SUM(valor_multa), 0) FROM infraccion) AS total_multas
        `;
        db.query(sql, (err, rows) => {
            if (err) return callback(err);
            const resumen = Array.isArray(rows) && rows.length > 0 ? rows[0] : {
                total_propietarios: 0,
                total_vehiculos: 0,
                total_infracciones: 0,
                total_multas: 0
            };
            callback(null, resumen);
        });
    },

    vehiculosPorTipo: (callback) => {
        db.query(`
            SELECT tipo, COUNT(*) AS total
            FROM vehiculo
            GROUP BY tipo
        `, callback);
    },

    top5Infracciones: (callback) => {
        db.query(`
            SELECT v.placa, v.marca, v.modelo,
                COUNT(i.id) AS total_infracciones
            FROM vehiculo v
            JOIN infraccion i ON v.id = i.vehiculo_id
            GROUP BY v.id
            ORDER BY total_infracciones DESC
            LIMIT 5
        `, callback);
    },

    infraccionesPorMes: (callback) => {
        db.query(`
            SELECT 
                MONTH(fecha_infraccion) AS mes,
                COUNT(*) AS total
            FROM infraccion
            WHERE YEAR(fecha_infraccion) = YEAR(CURDATE())
            GROUP BY MONTH(fecha_infraccion)
            ORDER BY mes
        `, callback);
    }
};

module.exports = Estadistica;