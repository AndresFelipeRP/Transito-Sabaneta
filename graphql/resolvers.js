const Propietario = require('../models/propietarioModel');
const Vehiculo = require('../models/vehiculoModel');
const Matricula = require('../models/matriculaModel');
const Infraccion = require('../models/infraccionModel');
const Estadistica = require('../models/estadisticaModel');

// Helper para convertir callbacks a Promises
const promisify = (fn, ...args) => {
    return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Resolvers
const resolvers = {
    // ==================== TYPE RESOLVERS (Interfaces) ====================
    PropietarioInterface: {
        __resolveType(obj) {
            return obj.tipo === 'persona' ? 'Persona' : 'Empresa';
        }
    },

    FuenteDeteccionInterface: {
        __resolveType(obj) {
            return obj.tipo === 'agente' ? 'AgenteTransito' : 'CamaraDeteccion';
        }
    },

    // ==================== FIELD RESOLVERS ====================
    Persona: {
        matriculas: async (parent) => {
            const matriculas = await promisify(Matricula.obtenerTodas);
            return matriculas.filter(m => m.propietario_id === parent.id);
        }
    },

    Empresa: {
        matriculas: async (parent) => {
            const matriculas = await promisify(Matricula.obtenerTodas);
            return matriculas.filter(m => m.propietario_id === parent.id);
        }
    },

    Vehiculo: {
        matricula: async (parent) => {
            const matriculas = await promisify(Matricula.obtenerTodas);
            return matriculas.find(m => m.vehiculo_id === parent.id) || null;
        },
        infracciones: async (parent) => {
            return promisify(Vehiculo.obtenerInfracciones, parent.id);
        },
        // Mapear nombres de campos de la BD a GraphQL
        numeroPuertas: (parent) => parent.numero_puertas,
        tipoCombustible: (parent) => parent.tipo_combustible,
        tipoMoto: (parent) => parent.tipo_moto,
        capacidadCarga: (parent) => parent.capacidad_carga,
        tipoCarroceria: (parent) => parent.tipo_carroceria
    },

    Matricula: {
        vehiculo: async (parent) => {
            const vehiculo = await promisify(Vehiculo.obtenerPorId, parent.vehiculo_id);
            return vehiculo;
        },
        propietario: async (parent) => {
            const propietario = await promisify(Propietario.obtenerPorId, parent.propietario_id);
            return propietario;
        },
        numeroMatricula: (parent) => parent.numero_matricula,
        fechaMatricula: (parent) => parent.fecha_matricula,
        vehiculoId: (parent) => parent.vehiculo_id,
        propietarioId: (parent) => parent.propietario_id
    },

    Infraccion: {
        vehiculo: async (parent) => {
            const vehiculo = await promisify(Vehiculo.obtenerPorId, parent.vehiculo_id);
            return vehiculo;
        },
        fuente: async (parent) => {
            const fuentes = await promisify(Infraccion.obtenerFuentes);
            return fuentes.find(f => f.id === parent.fuente_id);
        },
        vehiculoId: (parent) => parent.vehiculo_id,
        fuenteId: (parent) => parent.fuente_id,
        valorMulta: (parent) => parent.valor_multa
    },

    AgenteTransito: {
        nombre: (parent) => parent.nombre_agente || parent.nombre
    },

    CamaraDeteccion: {
        codigoCamara: (parent) => parent.codigo_camara
    },

    // ==================== QUERIES ====================
    Query: {
        // Propietarios
        propietarios: async () => {
            return promisify(Propietario.obtenerTodos);
        },

        propietario: async (_, { id }) => {
            return promisify(Propietario.obtenerPorId, id);
        },

        // Vehículos
        vehiculos: async () => {
            return promisify(Vehiculo.obtenerTodos);
        },

        vehiculo: async (_, { id }) => {
            return promisify(Vehiculo.obtenerPorId, id);
        },

        buscarVehiculoPorPlaca: async (_, { placa }) => {
            return promisify(Vehiculo.buscarPorPlaca, placa);
        },

        // Matrículas
        matriculas: async () => {
            return promisify(Matricula.obtenerTodas);
        },

        matricula: async (_, { id }) => {
            return promisify(Matricula.obtenerPorId, id);
        },

        // Infracciones
        infracciones: async () => {
            return promisify(Infraccion.obtenerTodas);
        },

        infraccion: async (_, { id }) => {
            return promisify(Infraccion.obtenerPorId, id);
        },

        // Fuentes de detección
        fuentesDeteccion: async () => {
            return promisify(Infraccion.obtenerFuentes);
        },

        // Estadísticas
        estadisticas: async () => {
            const resumen = await promisify(Estadistica.resumen);
            const porTipo = await promisify(Estadistica.vehiculosPorTipo);
            const top5 = await promisify(Estadistica.top5Infracciones);
            const porMes = await promisify(Estadistica.infraccionesPorMes);

            return {
                totalPropietarios: resumen.total_propietarios,
                totalVehiculos: resumen.total_vehiculos,
                totalInfracciones: resumen.total_infracciones,
                totalMultas: resumen.total_multas,
                vehiculosPorTipo: porTipo.map(v => ({ tipo: v.tipo, total: v.total })),
                top5Infracciones: top5.map(t => ({
                    placa: t.placa,
                    marca: t.marca,
                    modelo: t.modelo,
                    totalInfracciones: t.total_infracciones
                })),
                infraccionesPorMes: porMes.map(m => ({ mes: m.mes, total: m.total }))
            };
        }
    },

    // ==================== MUTATIONS ====================
    Mutation: {
        // Propietarios
        crearPropietario: async (_, { input }) => {
            await promisify(Propietario.crear, {
                identificacion: input.identificacion,
                nombre: input.nombre,
                direccion: input.direccion,
                tipo: input.tipo,
                apellido: input.apellido,
                tel_persona: input.telPersona,
                representante_legal: input.representanteLegal,
                tel_empresa: input.telEmpresa
            });
            // Obtener el último propietario creado
            const propietarios = await promisify(Propietario.obtenerTodos);
            return propietarios[propietarios.length - 1];
        },

        editarPropietario: async (_, { id, input }) => {
            await promisify(Propietario.editar, id, {
                nombre: input.nombre,
                direccion: input.direccion,
                tipo: input.tipo,
                apellido: input.apellido,
                tel_persona: input.telPersona,
                representante_legal: input.representanteLegal,
                tel_empresa: input.telEmpresa
            });
            return promisify(Propietario.obtenerPorId, id);
        },

        eliminarPropietario: async (_, { id }) => {
            try {
                await promisify(Propietario.eliminar, id);
                return true;
            } catch {
                return false;
            }
        },

        // Vehículos
        crearVehiculo: async (_, { input }) => {
            await promisify(Vehiculo.crear, {
                placa: input.placa,
                marca: input.marca,
                modelo: input.modelo,
                tipo: input.tipo,
                numero_puertas: input.numeroPuertas,
                tipo_combustible: input.tipoCombustible,
                tipo_moto: input.tipoMoto,
                cilindrada: input.cilindrada,
                capacidad_carga: input.capacidadCarga,
                tipo_carroceria: input.tipoCarroceria
            });
            const vehiculos = await promisify(Vehiculo.obtenerTodos);
            return vehiculos[vehiculos.length - 1];
        },

        editarVehiculo: async (_, { id, input }) => {
            // Primero obtener el vehículo para saber su tipo original
            const vehiculo = await promisify(Vehiculo.obtenerPorId, id);
            await promisify(Vehiculo.editar, id, {
                marca: input.marca,
                modelo: input.modelo,
                tipo: vehiculo.tipo, // Mantener el tipo original
                numero_puertas: input.numeroPuertas,
                tipo_combustible: input.tipoCombustible,
                tipo_moto: input.tipoMoto,
                cilindrada: input.cilindrada,
                capacidad_carga: input.capacidadCarga,
                tipo_carroceria: input.tipoCarroceria
            });
            return promisify(Vehiculo.obtenerPorId, id);
        },

        eliminarVehiculo: async (_, { id }) => {
            try {
                await promisify(Vehiculo.eliminar, id);
                return true;
            } catch {
                return false;
            }
        },

        // Matrículas
        crearMatricula: async (_, { input }) => {
            await promisify(Matricula.crear, {
                numero_matricula: input.numeroMatricula,
                fecha_matricula: input.fechaMatricula,
                vehiculo_id: input.vehiculoId,
                propietario_id: input.propietarioId
            });
            const matriculas = await promisify(Matricula.obtenerTodas);
            return matriculas[matriculas.length - 1];
        },

        editarMatricula: async (_, { id, input }) => {
            await promisify(Matricula.editar, id, {
                fecha_matricula: input.fechaMatricula,
                propietario_id: input.propietarioId
            });
            return promisify(Matricula.obtenerPorId, id);
        },

        eliminarMatricula: async (_, { id }) => {
            try {
                await promisify(Matricula.eliminar, id);
                return true;
            } catch {
                return false;
            }
        },

        // Infracciones
        crearInfraccion: async (_, { input }) => {
            await promisify(Infraccion.crear, {
                fecha_infraccion: input.fecha,
                descripcion: input.descripcion,
                valor_multa: input.valorMulta,
                vehiculo_id: input.vehiculoId,
                fuente_id: input.fuenteId
            });
            const infracciones = await promisify(Infraccion.obtenerTodas);
            return infracciones[infracciones.length - 1];
        },

        editarInfraccion: async (_, { id, input }) => {
            await promisify(Infraccion.editar, id, {
                fecha_infraccion: input.fecha,
                descripcion: input.descripcion,
                valor_multa: input.valorMulta
            });
            return promisify(Infraccion.obtenerPorId, id);
        },

        eliminarInfraccion: async (_, { id }) => {
            try {
                await promisify(Infraccion.eliminar, id);
                return true;
            } catch {
                return false;
            }
        },

        // Fuentes de detección
        crearFuenteDeteccion: async (_, { input }) => {
            await promisify(Infraccion.crearFuente, {
                ubicacion: input.ubicacion,
                tipo: input.tipo,
                nombre: input.nombre,
                badge: input.badge,
                turno: input.turno,
                codigo_camara: input.codigoCamara,
                coordenadas: input.coordenadas
            });
            const fuentes = await promisify(Infraccion.obtenerFuentes);
            return fuentes[fuentes.length - 1];
        }
    }
};

module.exports = resolvers;