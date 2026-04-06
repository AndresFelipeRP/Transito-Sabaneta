const Estadistica = require('../models/estadisticaModel');

const estadisticaController = {
    index: (req, res) => {
        Estadistica.resumen((err, resumen) => {
            if (err) {
                console.error('Error obteniendo resumen:', err.message);
                resumen = {
                    total_propietarios: 0,
                    total_vehiculos: 0,
                    total_infracciones: 0,
                    total_multas: 0
                };
            }

            Estadistica.vehiculosPorTipo((err2, porTipo) => {
                if (err2) {
                    console.error('Error obteniendo vehículos por tipo:', err2.message);
                    porTipo = [];
                }

                Estadistica.top5Infracciones((err3, top5) => {
                    if (err3) {
                        console.error('Error obteniendo top 5 infracciones:', err3.message);
                        top5 = [];
                    }

                    Estadistica.infraccionesPorMes((err4, porMes) => {
                        if (err4) {
                            console.error('Error obteniendo infracciones por mes:', err4.message);
                            porMes = [];
                        }

                        // Preparar datos para Chart.js
                        const meses = ['Ene','Feb','Mar','Abr','May','Jun',
                                       'Jul','Ago','Sep','Oct','Nov','Dic'];

                        // Gráfica torta
                        const tiposLabels = porTipo.map(t => t.tipo);
                        const tiposData   = porTipo.map(t => t.total);

                        // Gráfica barras
                        const top5Labels = top5.map(v => v.placa);
                        const top5Data   = top5.map(v => v.total_infracciones);

                        // Gráfica línea — llenar los 12 meses
                        const mesData = Array(12).fill(0);
                        porMes.forEach(m => {
                            if (m.mes >= 1 && m.mes <= 12) {
                                mesData[m.mes - 1] = m.total;
                            }
                        });

                        res.render('index', {
                            titulo: 'Tránsito Sabaneta',
                            resumen,
                            tiposLabels: JSON.stringify(tiposLabels),
                            tiposData:   JSON.stringify(tiposData),
                            top5Labels:  JSON.stringify(top5Labels),
                            top5Data:    JSON.stringify(top5Data),
                            mesLabels:   JSON.stringify(meses),
                            mesData:     JSON.stringify(mesData)
                        });
                    });
                });
            });
        });
    }
};

module.exports = estadisticaController;