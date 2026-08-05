const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const healthRoutes = require('./routes/health');
const herbRoutes = require('./routes/herbs');
const voiceRoutes = require('./routes/voice');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security
app.use(helmet());

// CORS - Allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// ============ ROUTES ============

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'EthioHealth AI API',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/v1/health/analyze',
            herbs: '/api/v1/herbs',
            voice: '/api/v1/voice/process'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        uptime: process.uptime(),
        memory: process.memoryUsage().heapUsed / 1024 / 1024,
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/herbs', herbRoutes);
app.use('/api/v1/voice', voiceRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found: ' + req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use(errorHandler);

module.exports = app;
