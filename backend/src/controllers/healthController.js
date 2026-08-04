const aiService = require('../services/aiAnalysis');

exports.analyzeHealth = async (req, res, next) => {
    try {
        const { systolic, diastolic, glucose, bmi, temperature, age, symptoms } = req.body;

        // Validate required fields
        if (!systolic || !diastolic || !glucose) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: systolic, diastolic, glucose'
            });
        }

        // Run AI analysis
        const results = aiService.analyze({
            systolic: parseFloat(systolic),
            diastolic: parseFloat(diastolic),
            glucose: parseFloat(glucose),
            bmi: parseFloat(bmi) || 24,
            temperature: parseFloat(temperature) || 36.6,
            age: parseInt(age) || 30,
            symptoms: symptoms || []
        });

        res.json({
            success: true,
            data: results
        });

    } catch (error) {
        next(error);
    }
};

exports.getHistory = async (req, res) => {
    res.json({
        success: true,
        data: [],
        message: 'History stored locally on device'
    });
};
