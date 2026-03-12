const db = require('../config/db');

const Reporte = {

    // Solo propietarios CON infracciones
    infraccionesPorPropietario: (callback) => {
        const sql = `
            SELECT 
                p.identificacion,
                p.nombre,
                p.tipo AS tipo_propietario,
                p.direccion,
                v.placa,
                ANY_VALUE(v.marca) AS marca,
                ANY_VALUE(v.modelo) AS modelo,
                ANY_VALUE(v.tipo) AS tipo_vehiculo,
                COUNT(i.id) AS total_infracciones,
                COALESCE(SUM(i.valor_multa), 0) AS total_multas,
                GROUP_CONCAT(
                    CONCAT(
                        DATE_FORMAT(i.fecha_infraccion, '%d/%m/%Y'),
                        ' - ', i.descripcion,
                        ' ($', FORMAT(i.valor_multa, 0), ')'
                    ) SEPARATOR ' | '
                ) AS detalle_infracciones
            FROM propietario p
            INNER JOIN matricula m ON p.id = m.propietario_id
            INNER JOIN vehiculo v ON m.vehiculo_id = v.id
            INNER JOIN infraccion i ON v.id = i.vehiculo_id
            GROUP BY p.identificacion, p.nombre, p.tipo, p.direccion, v.placa
            ORDER BY total_multas DESC
        `;
        db.query(sql, callback);
    },

    // Todos los propietarios con datos de contacto completos
    propietariosYVehiculos: (callback) => {
        const sql = `
            SELECT 
                p.identificacion,
                p.nombre,
                p.tipo AS tipo_propietario,
                p.direccion,
                ANY_VALUE(pe.apellido) AS apellido,
                ANY_VALUE(pe.telefono) AS tel_persona,
                ANY_VALUE(e.representante_legal) AS representante_legal,
                ANY_VALUE(e.telefono) AS tel_empresa,
                v.placa,
                ANY_VALUE(v.marca) AS marca,
                ANY_VALUE(v.modelo) AS modelo,
                ANY_VALUE(v.tipo) AS tipo_vehiculo,
                ANY_VALUE(m.numero_matricula) AS numero_matricula,
                ANY_VALUE(m.fecha_matricula) AS fecha_matricula
            FROM propietario p
            LEFT JOIN persona pe ON p.id = pe.id
            LEFT JOIN empresa e ON p.id = e.id
            LEFT JOIN matricula m ON p.id = m.propietario_id
            LEFT JOIN vehiculo v ON m.vehiculo_id = v.id
            GROUP BY p.identificacion, p.nombre, p.tipo, p.direccion, v.placa
            ORDER BY p.nombre
        `;
        db.query(sql, callback);
    }
};

module.exports = Reporte;