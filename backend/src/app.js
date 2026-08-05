const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// ============ ROUTES ============

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'EthioHealth AI API',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ============ HEALTH ANALYSIS ============
app.post('/api/v1/health/analyze', (req, res) => {
    try {
        const { systolic, diastolic, glucose, bmi, temperature, age } = req.body;
        
        let score = 100;
        const findings = [];
        
        // Hypertension check
        if (systolic >= 140) {
            const risk = Math.min(100, (systolic - 120) * 2);
            score -= 25;
            findings.push({
                name: 'Hypertension Risk',
                icon: 'fa-tint',
                color: '#ef4444',
                risk: risk,
                level: risk > 60 ? 'high' : 'medium'
            });
        }
        
        // Diabetes check
        if (glucose >= 126) {
            const risk = Math.min(100, (glucose - 100) * 1.5);
            score -= 25;
            findings.push({
                name: 'Diabetes Risk',
                icon: 'fa-candy-cane',
                color: '#f59e0b',
                risk: risk,
                level: risk > 50 ? 'high' : 'medium'
            });
        }
        
        // Malaria check
        if (temperature >= 38) {
            const risk = Math.min(100, (temperature - 36) * 20);
            score -= 20;
            findings.push({
                name: 'Malaria Risk',
                icon: 'fa-mosquito',
                color: '#3b82f6',
                risk: risk,
                level: risk > 50 ? 'high' : 'medium'
            });
        }
        
        // Obesity check
        if (bmi >= 30) {
            score -= 15;
            findings.push({
                name: 'Obesity',
                icon: 'fa-weight-scale',
                color: '#f59e0b',
                risk: Math.min(100, (bmi - 25) * 4),
                level: bmi > 35 ? 'high' : 'medium'
            });
        }
        
        score = Math.max(0, Math.min(100, score));
        
        res.json({
            success: true,
            data: {
                score,
                findings,
                urgency: score < 50 ? 'attention' : 'normal',
                analyzedAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============ HERB DATABASE ============
app.get('/api/v1/herbs', (req, res) => {
    const herbs = [
        { id: 'tena_adam', name: 'Tena Adam', scientific: 'Ruta chalepensis', uses: 'Stomach pain, headache, fever, cough, ear infection', warning: 'Avoid with blood thinners', category: ['respiratory', 'digestive'] },
        { id: 'moringa', name: 'Moringa', scientific: 'Moringa stenopetala', uses: 'Malnutrition, high BP, diabetes, anemia', warning: 'Monitor blood sugar', category: ['nutrition', 'chronic'] },
        { id: 'gesho', name: 'Gesho', scientific: 'Rhamnus prinoides', uses: 'Digestion, malaria, intestinal worms', warning: 'May interact with diabetes meds', category: ['digestive', 'malaria'] },
        { id: 'damakese', name: 'Damakese', scientific: 'Ocimum lamiifolium', uses: 'Fever, headache, cold, cough', warning: 'Generally safe', category: ['respiratory'] },
        { id: 'neem', name: 'Neem', scientific: 'Azadirachta indica', uses: 'Malaria, fever, skin diseases', warning: 'Not for pregnant women', category: ['malaria', 'skin'] },
        { id: 'tosign', name: 'Tosign', scientific: 'Thymus schimperi', uses: 'Cough, cold, BP, digestion', warning: 'May lower BP', category: ['respiratory', 'chronic'] },
        { id: 'koseret', name: 'Koseret', scientific: 'Lippia adoensis', uses: 'Digestion, parasites, fever', warning: 'Safe in culinary amounts', category: ['digestive'] },
        { id: 'grawa', name: 'Grawa', scientific: 'Vernonia amygdalina', uses: 'Malaria, diabetes, parasites', warning: 'Very bitter. Monitor sugar', category: ['malaria', 'chronic'] }
    ];
    
    res.json({ success: true, count: herbs.length, data: herbs });
});

// ============ VOICE PROCESSING ============
app.post('/api/v1/voice/process', (req, res) => {
    const { transcript, language } = req.body;
    
    const responses = {
        en: 'Processing your request. How can I help with your health today?',
        am: 'ጥያቄዎን በማስኬድ ላይ። ዛሬ በጤናዎ ላይ እንዴት ልረዳዎ?',
        om: 'Gaaffii kee adeessaa jira. Fayyaa kee irratti akkamittan si gargaaruu danda\'a?'
    };
    
    res.json({
        success: true,
        data: {
            transcript,
            response: responses[language] || responses.en,
            language: language || 'en',
            timestamp: new Date().toISOString()
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found: ' + req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

module.exports = app;
