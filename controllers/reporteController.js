const Reporte = require('../models/reporteModel');
const PDFDocument = require('pdfkit');

const reporteController = {

    // ── Página principal de reportes ──
    index: (req, res) => {
        res.render('reportes/index');
    },

    // ── Reporte 1: Infracciones por propietario ──
    infraccionesPorPropietario: (req, res) => {
        Reporte.infraccionesPorPropietario((err, datos) => {
            if (err) return res.send('Error: ' + err.message);
            res.render('reportes/infraccionesPropietario', { datos });
        });
    },

    infraccionesPorPropietarioPDF: (req, res) => {
        Reporte.infraccionesPorPropietario((err, datos) => {
            if (err) return res.send('Error: ' + err.message);

            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=infracciones_por_propietario.pdf');
            doc.pipe(res);

            // Encabezado
            doc.fontSize(18).fillColor('#1a237e')
               .text('Secretaría de Tránsito de Sabaneta', { align: 'center' });
            doc.fontSize(13).fillColor('#333')
               .text('Reporte de Infracciones por Propietario', { align: 'center' });
            doc.fontSize(10).fillColor('#666')
               .text(`Generado el: ${new Date().toLocaleDateString('es-CO')}`, { align: 'center' });
            doc.moveDown(1.5);

            // Agrupar por propietario
            const agrupado = {};
            datos.forEach(row => {
                const key = row.identificacion;
                if (!agrupado[key]) {
                    agrupado[key] = {
                        identificacion: row.identificacion,
                        nombre: row.nombre,
                        tipo: row.tipo_propietario,
                        direccion: row.direccion,
                        vehiculos: []
                    };
                }
                if (row.placa) {
                    agrupado[key].vehiculos.push(row);
                }
            });

            Object.values(agrupado).forEach(prop => {
                // Bloque propietario
                doc.fontSize(12).fillColor('#1a237e')
                   .text(`Propietario: ${prop.nombre} (${prop.identificacion})`, { underline: true });
                doc.fontSize(10).fillColor('#444')
                   .text(`Tipo: ${prop.tipo} | Dirección: ${prop.direccion}`);
                doc.moveDown(0.5);

                if (prop.vehiculos.length === 0) {
                    doc.fontSize(10).fillColor('#999').text('  Sin vehículos registrados');
                } else {
                    prop.vehiculos.forEach(v => {
                        doc.fontSize(10).fillColor('#333')
                           .text(`  🚗 ${v.placa} - ${v.marca} ${v.modelo} (${v.tipo_vehiculo})`);
                        doc.fontSize(10).fillColor('#c62828')
                           .text(`     Infracciones: ${v.total_infracciones} | Total multas: $${Number(v.total_multas).toLocaleString('es-CO')}`);
                        if (v.detalle_infracciones) {
                            const detalles = v.detalle_infracciones.split(' | ');
                            detalles.forEach(d => {
                                doc.fontSize(9).fillColor('#555').text(`     • ${d}`);
                            });
                        }
                        doc.moveDown(0.3);
                    });
                }

                doc.moveDown(0.8)
                   .moveTo(40, doc.y).lineTo(555, doc.y)
                   .strokeColor('#cccccc').stroke();
                doc.moveDown(0.5);
            });

            doc.end();
        });
    },

    // ── Reporte 2: Propietarios y vehículos ──
    propietariosYVehiculos: (req, res) => {
        Reporte.propietariosYVehiculos((err, datos) => {
            if (err) return res.send('Error: ' + err.message);
            res.render('reportes/propietariosVehiculos', { datos });
        });
    },

    propietariosYVehiculosPDF: (req, res) => {
        Reporte.propietariosYVehiculos((err, datos) => {
            if (err) return res.send('Error: ' + err.message);

            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=propietarios_vehiculos.pdf');
            doc.pipe(res);

            // Encabezado
            doc.fontSize(18).fillColor('#1a237e')
               .text('Secretaría de Tránsito de Sabaneta', { align: 'center' });
            doc.fontSize(13).fillColor('#333')
               .text('Reporte General de Propietarios y Vehículos', { align: 'center' });
            doc.fontSize(10).fillColor('#666')
               .text(`Generado el: ${new Date().toLocaleDateString('es-CO')}`, { align: 'center' });
            doc.moveDown(1.5);

            // Agrupar por propietario
            const agrupado = {};
            datos.forEach(row => {
                const key = row.identificacion;
                if (!agrupado[key]) {
                    agrupado[key] = {
                        identificacion: row.identificacion,
                        nombre: row.nombre,
                        tipo: row.tipo_propietario,
                        direccion: row.direccion,
                        apellido: row.apellido,
                        tel_persona: row.tel_persona,
                        representante_legal: row.representante_legal,
                        tel_empresa: row.tel_empresa,
                        vehiculos: []
                    };
                }
                if (row.placa) {
                    agrupado[key].vehiculos.push(row);
                }
            });

            Object.values(agrupado).forEach(prop => {
                doc.fontSize(12).fillColor('#1a237e')
                   .text(`${prop.nombre} — ${prop.identificacion}`, { underline: true });
                doc.fontSize(10).fillColor('#444')
                   .text(`Tipo: ${prop.tipo} | Dirección: ${prop.direccion}`);

                if (prop.tipo === 'persona' && prop.apellido) {
                    doc.text(`Apellido: ${prop.apellido} | Tel: ${prop.tel_persona || 'N/A'}`);
                } else if (prop.representante_legal) {
                    doc.text(`Rep. Legal: ${prop.representante_legal} | Tel: ${prop.tel_empresa || 'N/A'}`);
                }

                doc.moveDown(0.5);

                if (prop.vehiculos.length === 0) {
                    doc.fontSize(10).fillColor('#999').text('  Sin vehículos registrados');
                } else {
                    prop.vehiculos.forEach(v => {
                        doc.fontSize(10).fillColor('#333')
                           .text(`  • Placa: ${v.placa} | ${v.marca} ${v.modelo} | Tipo: ${v.tipo_vehiculo}`);
                        doc.fontSize(10).fillColor('#555')
                           .text(`    Matrícula: ${v.numero_matricula || 'N/A'} | Fecha: ${v.fecha_matricula ? new Date(v.fecha_matricula).toLocaleDateString('es-CO') : 'N/A'}`);
                        doc.fontSize(10).fillColor('#c62828')
                           .text(`    Infracciones: ${v.total_infracciones} | Total multas: $${Number(v.total_multas).toLocaleString('es-CO')}`);
                        doc.moveDown(0.3);
                    });
                }

                doc.moveDown(0.8)
                   .moveTo(40, doc.y).lineTo(555, doc.y)
                   .strokeColor('#cccccc').stroke();
                doc.moveDown(0.5);
            });

            doc.end();
        });
    }
};

module.exports = reporteController;