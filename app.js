const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const propietarioRoutes  = require('./routes/propietarioRoutes');
const vehiculoRoutes     = require('./routes/vehiculoRoutes');
const matriculaRoutes    = require('./routes/matriculaRoutes');
const infraccionRoutes   = require('./routes/infraccionRoutes');
const reporteRoutes      = require('./routes/reporteRoutes');
const estadisticaCtrl    = require('./controllers/estadisticaController');

app.use('/propietarios', propietarioRoutes);
app.use('/vehiculos',    vehiculoRoutes);
app.use('/matriculas',   matriculaRoutes);
app.use('/infracciones', infraccionRoutes);
app.use('/reportes',     reporteRoutes);

// Inicio con estadísticas
app.get('/', estadisticaCtrl.index);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:3000`);
});