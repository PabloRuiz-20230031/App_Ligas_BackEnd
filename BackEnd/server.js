const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const ligaRoute = require('./routes/ligaRoute');
const categoriaRoute = require('./routes/categoriaRoute');
const equipoRoutes = require('./routes/equipoRoute');
const jugadorRoutes = require('./routes/jugadorRoute');
const representanteRoutes = require('./routes/representanteRoute');
const usuarioRoutes = require('./routes/usuarioRoute');
const cedulaRoutes = require('./routes/cedulaRoute');
const jornadaRoutes = require('./routes/jornadaRoute');
const tablaRoutes = require('./routes/tablaRoute');
const adminRoutes = require('./routes/adminRoute');
const redSocialRoutes = require('./routes/redsocialRoute');

require('dotenv').config();   

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api', ligaRoute);
app.use('/api', categoriaRoute);
app.use('/api', equipoRoutes);
app.use('/api', jugadorRoutes);
app.use('/api', representanteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api', cedulaRoutes);
app.use('/api', jornadaRoutes);
app.use('/api', tablaRoutes);
app.use('/api', adminRoutes);
app.use('/api/redes-sociales', redSocialRoutes);


// Conexión a la BD
connectDB();

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Ligas de Fútbol funcionando');
});

// Escuchar en puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});