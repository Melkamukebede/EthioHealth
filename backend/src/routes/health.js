const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// POST /api/v1/health/analyze
router.post('/analyze', healthController.analyzeHealth);

// GET /api/v1/health/history
router.get('/history', healthController.getHistory);

module.exports = router;
