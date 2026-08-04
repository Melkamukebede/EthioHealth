const { validationResult } = require('express-validator');
const aiService = require('../services/aiAnalysis');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Analyze health data with Grok-style AI
 */
exports.analyzeHealth = async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { systolic, diastolic, glucose, bmi, temperature, age, symptoms } = req.body;

        // Run AI analysis
        const results = aiService.analyze({
            systolic, diastolic, glucose, bmi, temperature, age,
            symptoms: symptoms || []
        });

        // Save to database
        const saved = await prisma.healthAnalysis.create({
            data: {
                systolic,
                diastolic,
                glucose,
                bmi,
                temperature,
                age,
                score: results.score,
                findings: results.findings,
                urgency: results.urgency,
                symptoms: symptoms || []
            }
        });

        res.json({
            success: true,
            data: {
                id: saved.id,
                score: results.score,
                findings: results.findings,
                reasoning: results.reasoning,
                urgency: results.urgency,
                recommendations: results.recommendations,
                timestamp: saved.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get analysis history
 */
exports.getHistory = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        
        const analyses = await prisma.healthAnalysis.findMany({
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset),
            select: {
                id: true,
                score: true,
                systolic: true,
                diastolic: true,
                glucose: true,
                urgency: true,
                createdAt: true
            }
        });

        const total = await prisma.healthAnalysis.count();

        res.json({
            success: true,
            data: analyses,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get single analysis
 */
exports.getAnalysis = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const analysis = await prisma.healthAnalysis.findUnique({
            where: { id: parseInt(id) }
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        next(error);
    }
};
