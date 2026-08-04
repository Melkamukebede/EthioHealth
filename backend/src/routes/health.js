const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const healthController = require('../controllers/healthController');
const rateLimiter = require('../middleware/rateLimiter');

// Analyze health - POST
router.post('/analyze', 
    rateLimiter,
    [
        body('systolic').isFloat({ min: 60, max: 250 }).withMessage('Systolic BP must be 60-250'),
        body('diastolic').isFloat({ min: 30, max: 150 }).withMessage('Diastolic BP must be 30-150'),
        body('glucose').isFloat({ min: 20, max: 600 }).withMessage('Glucose must be 20-600'),
        body('bmi').isFloat({ min: 10, max: 60 }).withMessage('BMI must be 10-60'),
        body('temperature').isFloat({ min: 30, max: 45 }).withMessage('Temperature must be 30-45°C'),
        body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be 1-120')
    ],
    healthController.analyzeHealth
);

// Get analysis history - GET
router.get('/history', healthController.getHistory);

// Get single analysis - GET
router.get('/analysis/:id', healthController.getAnalysis);

module.exports = router;
