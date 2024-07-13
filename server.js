const express = require('express');
const port = 3001;
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); 
const path = require('path');
require ('dotenv').config();
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  next();
});

const carregarTabelas = require('./src/utils/carregarTabelas'); 
carregarTabelas();   


const authRoutes = require('./src/routes/authRoutes'); 
const eventoRoutes = require('./src/routes/eventRoutes');
const areaRoutes = require('./src/routes/areaRoutes');
const estabelecimentoRoutes = require('./src/routes/establishmentRoutes');
const postoRoutes = require('./src/routes/postRoutes');
const avaliacaoRoutes = require('./src/routes/reviewRoutes');
const utilizadorRoutes = require('./src/routes/userRoutes');
const notificacaoRoutes = require('./src/routes/notificationRoutes');
const fotoRoutes = require('./src/routes/photoRoutes');
const estatisticaRoutes = require('./src/routes/statRoutes');

app.use('/', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/areas', areaRoutes);
app.use('/estabelecimentos', estabelecimentoRoutes);
app.use('/postos', postoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   
app.use('/avaliacao', avaliacaoRoutes);
app.use('/utilizador', utilizadorRoutes);
app.use('/foto', fotoRoutes);
app.use('/notificacao', notificacaoRoutes);
app.use('/estatistica', estatisticaRoutes);



app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});