const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reportsRouter = require('./routes/reports');
const statsRouter = require('./routes/stats');
const infrastructureRouter = require('./routes/infrastructure');
const { getCollectionQueue, getAlerts } = require('./controllers/reportController');
const { seedDatabase } = require('./seed');
const WasteReport = require('./models/WasteReport');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecopulse';

// Enable CORS for all incoming clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const time = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'healthy',
    platform: 'EcoPulse Smart City OS',
    database: isConnected ? 'MongoDB Connected' : 'EcoPulse Document Store (Active)',
    isRealMongo: isConnected,
    uptime: Math.round(process.uptime()),
    timestamp: new Date()
  });
});

// Primary API Endpoints
app.use('/api/reports', reportsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/infrastructure', infrastructureRouter);
app.use('/api/underground-grid', infrastructureRouter);
app.get('/api/collection-queue', getCollectionQueue);
app.get('/api/alerts', getAlerts);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB & Start Server
async function startServer() {
  console.log('EcoPulse Backend initializing...');

  try {
    const maskedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`Attempting connection to MongoDB: ${maskedUri}`);
    
    // 2.5s connection timeout so server starts rapidly
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('✓ Successfully connected to MongoDB / MongoDB Atlas.');
  } catch (err) {
    console.log(`ℹ️ MongoDB daemon not active locally (${err.message}).`);
    console.log('⚡ Switched seamlessly to EcoPulse Persistent Document Engine.');
    console.log('   (To connect to MongoDB Atlas, add your Atlas URI to backend/.env)');
  }

  // Ensure initial seed data exists
  try {
    const existing = await WasteReport.find();
    if (!existing || existing.length === 0) {
      console.log('Empty database detected. Seeding 7 sample waste reports...');
      await seedDatabase();
    }
  } catch (seedErr) {
    console.warn('Note on auto-seed:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` 🌿 EcoPulse Smart City Backend RUNNING on port ${PORT}`);
    console.log(` Health Check:       http://localhost:${PORT}/api/health`);
    console.log(` Reports API:        http://localhost:${PORT}/api/reports`);
    console.log(` Stats API:          http://localhost:${PORT}/api/stats`);
    console.log(` Collection Queue:   http://localhost:${PORT}/api/collection-queue`);
    console.log(` Smart Alerts:       http://localhost:${PORT}/api/alerts`);
    console.log(`====================================================`);
  });
}

startServer();

module.exports = app;
