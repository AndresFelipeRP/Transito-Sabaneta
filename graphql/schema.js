const gql = require('graphql-tag');

const typeDefs = gql`
    # ==================== ENUMS ====================
    enum TipoPropietario {
        persona
        empresa
    }

    enum TipoVehiculo {
        automovil
        moto
        carro_pesado
    }

    enum TipoFuente {
        agente
        camara
    }

    # ==================== INTERFACES ====================
    interface PropietarioInterface {
        id: ID!
        identificacion: String!
        nombre: String!
        direccion: String
        tipo: TipoPropietario!
    }

    interface FuenteDeteccionInterface {
        id: ID!
        tipo: TipoFuente!
        ubicacion: String!
    }

    # ==================== TYPES ====================
    type Persona implements PropietarioInterface {
        id: ID!
        identificacion: String!
        nombre: String!
        direccion: String
        tipo: TipoPropietario!
        apellido: String
        telefono: String
        matriculas: [Matricula!]!
    }

    type Empresa implements PropietarioInterface {
        id: ID!
        identificacion: String!
        nombre: String!
        direccion: String
        tipo: TipoPropietario!
        representanteLegal: String
        telefono: String
        matriculas: [Matricula!]!
    }

    type Vehiculo {
        id: ID!
        placa: String!
        marca: String
        modelo: String
        tipo: TipoVehiculo!
        # Campos específicos de automóvil
        numeroPuertas: Int
        tipoCombustible: String
        # Campos específicos de moto
        tipoMoto: String
        cilindrada: Int
        # Campos específicos de carro pesado
        capacidadCarga: Int
        tipoCarroceria: String
        # Relaciones
        matricula: Matricula
        infracciones: [Infraccion!]!
    }

    type Matricula {
        id: ID!
        numeroMatricula: String!
        fechaMatricula: String!
        vehiculoId: Int!
        propietarioId: Int!
        vehiculo: Vehiculo!
        propietario: PropietarioInterface!
    }

    type Infraccion {
        id: ID!
        fecha: String!
        descripcion: String!
        valorMulta: Float!
        vehiculoId: Int!
        fuenteId: Int!
        vehiculo: Vehiculo!
        fuente: FuenteDeteccionInterface!
        propietario: PropietarioInterface!
    }

    type AgenteTransito implements FuenteDeteccionInterface {
        id: ID!
        tipo: TipoFuente!
        ubicacion: String!
        nombre: String
        badge: String
        turno: String
    }

    type CamaraDeteccion implements FuenteDeteccionInterface {
        id: ID!
        tipo: TipoFuente!
        ubicacion: String!
        codigoCamara: String
        coordenadas: String
    }

    type Estadisticas {
        totalPropietarios: Int!
        totalVehiculos: Int!
        totalInfracciones: Int!
        totalMultas: Float!
        vehiculosPorTipo: [VehiculoPorTipo!]!
        top5Infracciones: [TopInfraccion!]!
        infraccionesPorMes: [InfraccionPorMes!]!
    }

    type VehiculoPorTipo {
        tipo: String!
        total: Int!
    }

    type TopInfraccion {
        placa: String!
        marca: String!
        modelo: String
        totalInfracciones: Int!
    }

    type InfraccionPorMes {
        mes: Int!
        total: Int!
    }

    # ==================== PAGINATION TYPES ====================
    type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        startCursor: String
        endCursor: String
    }

    type PropietarioEdge {
        node: PropietarioInterface!
        cursor: String!
    }

    type PropietarioConnection {
        edges: [PropietarioEdge!]!
        pageInfo: PageInfo!
    }

    type VehiculoEdge {
        node: Vehiculo!
        cursor: String!
    }

    type VehiculoConnection {
        edges: [VehiculoEdge!]!
        pageInfo: PageInfo!
    }

    type InfraccionEdge {
        node: Infraccion!
        cursor: String!
    }

    type InfraccionConnection {
        edges: [InfraccionEdge!]!
        pageInfo: PageInfo!
    }

    # ==================== INPUTS ====================
    input PropietarioInput {
        identificacion: String!
        nombre: String!
        direccion: String
        tipo: TipoPropietario!
        # Campos de persona
        apellido: String
        telPersona: String
        # Campos de empresa
        representanteLegal: String
        telEmpresa: String
    }

    input VehiculoInput {
        placa: String!
        marca: String
        modelo: String
        tipo: TipoVehiculo!
        # Campos de automóvil
        numeroPuertas: Int
        tipoCombustible: String
        # Campos de moto
        tipoMoto: String
        cilindrada: Int
        # Campos de carro pesado
        capacidadCarga: Int
        tipoCarroceria: String
    }

    input MatriculaInput {
        numeroMatricula: String!
        fechaMatricula: String!
        vehiculoId: ID!
        propietarioId: ID!
    }

    input InfraccionInput {
        fecha: String!
        descripcion: String!
        valorMulta: Float!
        vehiculoId: ID!
        fuenteId: ID!
    }

    input FuenteDeteccionInput {
        ubicacion: String!
        tipo: TipoFuente!
        # Campos de agente
        nombre: String
        badge: String
        turno: String
        # Campos de cámara
        codigoCamara: String
        coordenadas: String
    }

    # ==================== FILTROS PARA PAGINACIÓN ====================
    input FiltroPropietarioInput {
        tipo: TipoPropietario
        nombre: String
        identificacion: String
    }

    input FiltroVehiculoInput {
        tipo: TipoVehiculo
        marca: String
        placa: String
    }

    input FiltroInfraccionInput {
        fechaDesde: String
        fechaHasta: String
        valorMultaMin: Float
        valorMultaMax: Float
        vehiculoId: ID
    }

    # ==================== PAGINATION INPUTS ====================
    input PaginationInput {
        first: Int
        after: String
        last: Int
        before: String
    }

    # ==================== QUERIES ====================
    type Query {
        # Propietarios
        propietarios(pagination: PaginationInput, filtro: FiltroPropietarioInput): PropietarioConnection!
        propietario(id: ID!): PropietarioInterface

        # Vehículos
        vehiculos(pagination: PaginationInput, filtro: FiltroVehiculoInput): VehiculoConnection!
        vehiculo(id: ID!): Vehiculo
        buscarVehiculoPorPlaca(placa: String!): [Vehiculo!]!

        # Matrículas
        matriculas: [Matricula!]!
        matricula(id: ID!): Matricula

        # Infracciones
        infracciones(pagination: PaginationInput, filtro: FiltroInfraccionInput): InfraccionConnection!
        infraccion(id: ID!): Infraccion

        # Fuentes de detección
        fuentesDeteccion: [FuenteDeteccionInterface!]!

        # Estadísticas
        estadisticas: Estadisticas!
    }

    # ==================== MUTATIONS ====================
    type Mutation {
        # Propietarios
        crearPropietario(input: PropietarioInput!): PropietarioInterface!
        editarPropietario(id: ID!, input: PropietarioInput!): PropietarioInterface!
        eliminarPropietario(id: ID!): Boolean!

        # Vehículos
        crearVehiculo(input: VehiculoInput!): Vehiculo!
        editarVehiculo(id: ID!, input: VehiculoInput!): Vehiculo!
        eliminarVehiculo(id: ID!): Boolean!

        # Matrículas
        crearMatricula(input: MatriculaInput!): Matricula!
        editarMatricula(id: ID!, input: MatriculaInput!): Matricula!
        eliminarMatricula(id: ID!): Boolean!

        # Infracciones
        crearInfraccion(input: InfraccionInput!): Infraccion!
        editarInfraccion(id: ID!, input: InfraccionInput!): Infraccion!
        eliminarInfraccion(id: ID!): Boolean!

        # Fuentes de detección
        crearFuenteDeteccion(input: FuenteDeteccionInput!): FuenteDeteccionInterface!
    }
`;

module.exports = typeDefs;