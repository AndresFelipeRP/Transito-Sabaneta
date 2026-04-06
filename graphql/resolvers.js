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

// Helper para paginación Relay-style
const encodeCursor = (index) => Buffer.from(`cursor:${index}`).toString('base64');
const decodeCursor = (cursor) => {
    try {
        const decoded = Buffer.from(cursor, 'base64').toString();
        const parts = decoded.split(':');
        if (parts[0] === 'cursor') {
            const index = parseInt(parts[1]);
            return isNaN(index) ? 0 : index;
        }
        return 0;
    } catch (e) {
        return 0; // Default to start if invalid cursor
    }
};

const applyPagination = (items, { first, after, last, before }) => {
    let startIndex = 0;
    let endIndex = items.length;

    if (after) {
        startIndex = decodeCursor(after) + 1;
    }
    if (before) {
        endIndex = decodeCursor(before);
    }

    // Ensure indices are within bounds
    startIndex = Math.max(0, Math.min(startIndex, items.length));
    endIndex = Math.max(0, Math.min(endIndex, items.length));

    let slicedItems = items.slice(startIndex, endIndex);

    if (first && first > 0) {
        slicedItems = slicedItems.slice(0, first);
    }
    if (last && last > 0) {
        slicedItems = slicedItems.slice(-last);
    }

    const edges = slicedItems.map((item, index) => ({
        node: item,
        cursor: encodeCursor(startIndex + index)
    }));

    const pageInfo = {
        hasNextPage: (startIndex + slicedItems.length) < items.length,
        hasPreviousPage: startIndex > 0,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
    };

    return { edges, pageInfo };
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
        propietario: async (parent) => {
            try {
                const vehiculo = await promisify(Vehiculo.obtenerPorId, parent.vehiculo_id);
                if (!vehiculo) return null;
                const matriculas = await promisify(Matricula.obtenerTodas);
                const matricula = matriculas.find(m => m.vehiculo_id === parent.vehiculo_id);
                if (!matricula) return null;
                return await promisify(Propietario.obtenerPorId, matricula.propietario_id);
            } catch (e) {
                console.error('Error resolviendo propietario:', e);
                return null;
            }
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
        propietarios: async (_, { pagination, filtro }) => {
            let propietarios = await promisify(Propietario.obtenerTodos);
            if (filtro) {
                if (filtro.tipo) propietarios = propietarios.filter(p => p && p.tipo === filtro.tipo);
                if (filtro.nombre) propietarios = propietarios.filter(p => p && p.nombre && p.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()));
                if (filtro.identificacion) propietarios = propietarios.filter(p => p && p.identificacion === filtro.identificacion);
            }
            return applyPagination(propietarios, pagination || {});
        },

        propietario: async (_, { id }) => {
            return promisify(Propietario.obtenerPorId, id);
        },

        // Vehículos
        vehiculos: async (_, { pagination, filtro }) => {
            let vehiculos = await promisify(Vehiculo.obtenerTodos);
            if (filtro) {
                if (filtro.tipo) vehiculos = vehiculos.filter(v => v && v.tipo === filtro.tipo);
                if (filtro.marca) vehiculos = vehiculos.filter(v => v && v.marca && v.marca.toLowerCase().includes(filtro.marca.toLowerCase()));
                if (filtro.placa) vehiculos = vehiculos.filter(v => v && v.placa && v.placa.toLowerCase().includes(filtro.placa.toLowerCase()));
            }
            return applyPagination(vehiculos, pagination || {});
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
        infracciones: async (_, { pagination, filtro }) => {
            let infracciones = await promisify(Infraccion.obtenerTodas);
            if (filtro) {
                if (filtro.fechaDesde) {
                    const fechaDesde = new Date(filtro.fechaDesde);
                    if (!isNaN(fechaDesde.getTime())) {
                        infracciones = infracciones.filter(i => i && i.fecha_infraccion && new Date(i.fecha_infraccion) >= fechaDesde);
                    }
                }
                if (filtro.fechaHasta) {
                    const fechaHasta = new Date(filtro.fechaHasta);
                    if (!isNaN(fechaHasta.getTime())) {
                        infracciones = infracciones.filter(i => i && i.fecha_infraccion && new Date(i.fecha_infraccion) <= fechaHasta);
                    }
                }
                if (filtro.valorMultaMin !== undefined && filtro.valorMultaMin !== null) {
                    infracciones = infracciones.filter(i => i && i.valor_multa >= filtro.valorMultaMin);
                }
                if (filtro.valorMultaMax !== undefined && filtro.valorMultaMax !== null) {
                    infracciones = infracciones.filter(i => i && i.valor_multa <= filtro.valorMultaMax);
                }
                if (filtro.vehiculoId) {
                    infracciones = infracciones.filter(i => i && i.vehiculo_id == filtro.vehiculoId);
                }
            }
            return applyPagination(infracciones, pagination || {});
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