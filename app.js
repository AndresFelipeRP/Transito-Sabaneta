const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

// GraphQL schema y resolvers
const { typeDefs, resolvers } = require('./graphql');

// Rutas existentes
const propietarioRoutes = require('./routes/propietarioRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const matriculaRoutes = require('./routes/matriculaRoutes');
const infraccionRoutes = require('./routes/infraccionRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const estadisticaCtrl = require('./controllers/estadisticaController');

async function startServer() {
    const app = express();

    // Configurar view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // Middleware existente
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, 'public')));

    // Rutas REST existentes
    app.use('/propietarios', propietarioRoutes);
    app.use('/vehiculos', vehiculoRoutes);
    app.use('/matriculas', matriculaRoutes);
    app.use('/infracciones', infraccionRoutes);
    app.use('/reportes', reporteRoutes);

    // Inicio con estadísticas
    app.get('/', estadisticaCtrl.index);

    // Configurar Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true
    });

    await server.start();

    // Montar GraphQL en /graphql
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({ req })
    }));

    // Iniciar servidor
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📊 GraphQL Playground en http://localhost:${PORT}/graphql`);
    });
}

startServer().catch(err => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
});