const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import routes
const healthRoutes = require('./routes/health');
const herbRoutes = require('./routes/herbs');
const voiceRoutes = require('./routes/voice');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ============ MIDDLEWARE ============

// Security headers
app.use(helmet());

// CORS
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ============ HEALTH CHECK ============
app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'EthioHealth AI API',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/v1/health',
            herbs: '/api/v1/herbs',
            voice: '/api/v1/voice'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// ============ API ROUTES ============
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/herbs', herbRoutes);
app.use('/api/v1/voice', voiceRoutes);

// ============ 404 HANDLER ============
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl
    });
});

// ============ ERROR HANDLER ============
app.use(errorHandler);

module.exports = app;
