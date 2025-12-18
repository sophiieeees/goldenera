const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Disable for React app compatibility
}));

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de requests
});
app.use('/api/', limiter);

// Body parser - Importante: el orden importa para Stripe webhooks
app.use('/api/webhook/stripe', express.raw({type: 'application/json'}));
app.use(express.json());

// Rutas
app.use('/api/payment', require('./routes/payment'));
app.use('/api/webhook', require('./routes/webhook'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // Handle React routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});