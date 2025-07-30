const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config(); // debe ir antes de usar variables de entorno

// Conexión a la base de datos
connectDB();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/ligas', require('./routes/ligaRoute'));
app.use('/api/categorias', require('./routes/categoriaRoute'));
app.use('/api/equipos', require('./routes/equipoRoute'));
app.use('/api/jugadores', require('./routes/jugadorRoute'));
app.use('/api/representantes', require('./routes/representanteRoute'));
app.use('/api/usuarios', require('./routes/usuarioRoute'));
app.use('/api/cedulas', require('./routes/cedulaRoute'));
app.use('/api/jornadas', require('./routes/jornadaRoute'));
app.use('/api/tabla', require('./routes/tablaRoute'));
app.use('/api/redes-sociales', require('./routes/redsocialRoute'));
app.use('/api/temporadas', require('./routes/temporadaCompletaRoute'));
app.use('/api/partidos', require('./routes/partidoRoute'));
app.use('/api/goleo', require('./routes/goleoRoute'));
app.use('/api/tarjetas', require('./routes/tablaTarjetasRoute'));
app.use('/api/info', require('./routes/infoEmpresaRoute'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ API de Ligas de Fútbol funcionando');
});

// Escuchar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
