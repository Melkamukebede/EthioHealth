// ============================================
// ETHIOHEALTH AI PRO - HEALTH ANALYSIS MODULE
// ============================================

const Analysis = (function() {
    'use strict';
    
    // Disease knowledge base
    const diseaseKB = {
        hypertension: {
            name: 'Hypertension',
            icon: 'fa-tint',
            color: '#ef4444',
            riskFactors: {
                systolic: { threshold: 130, weight: 35 },
                diastolic: { threshold: 85, weight: 25 },
                age: { threshold: 40, weight: 15 },
                bmi: { threshold: 25, weight: 15 },
                lifestyle: { weight: 10 }
            },
            treatment: {
                modern: ['Enalapril', 'Amlodipine', 'Hydrochlorothiazide'],
                traditional: ['Moringa', 'Tosign', 'Gesho'],
                lifestyle: ['Reduce salt to <5g/day', '30 min daily walk', 'Stress management']
            },
            emergencyThreshold: 60
        },
        diabetes: {
            name: 'Type 2 Diabetes',
            icon: 'fa-candy-cane',
            color: '#f59e0b',
            riskFactors: {
                glucose: { threshold: 126, weight: 40 },
                bmi: { threshold: 25, weight: 20 },
                age: { threshold: 45, weight: 15 },
                hypertension: { weight: 15 },
                familyHistory: { weight: 10 }
            },
            treatment: {
                modern: ['Metformin', 'Glibenclamide'],
                traditional: ['Moringa', 'Grawa', 'Koseret'],
                lifestyle: ['Exercise 30 min daily', 'Reduce sugar', 'Eat teff injera']
            },
            emergencyThreshold: 65
        },
        malaria: {
            name: 'Malaria',
            icon: 'fa-mosquito',
            color: '#3b82f6',
            riskFactors: {
                temperature: { threshold: 38, weight: 40 },
                season: { weight: 30 },
                location: { weight: 20 },
                symptoms: { weight: 10 }
            },
            treatment: {
                modern: ['Coartem', 'Chloroquine'],
                traditional: ['Neem', 'Gesho', 'Grawa'],
                lifestyle: ['Sleep under treated nets', 'Eliminate standing water', 'Seek early diagnosis']
            },
            emergencyThreshold: 50,
            seasonal: true
        }
    };
    
    /**
     * Run full health analysis
     */
    async function runAnalysis() {
    const input = {
        systolic: Utils.getVal('inputSystolic', 120),
        diastolic: Utils.getVal('inputDiastolic', 80),
        glucose: Utils.getVal('inputGlucose', 95),
        bmi: Utils.getVal('inputBMI', 24),
        temperature: Utils.getVal('inputTemp', 36.6),
        age: Utils.getVal('inputAge', 30)
    };
    
    Utils.showLoading('Grok AI analyzing via server...');
    
    try {
        const result = await API.analyzeHealth(input);
        
        if (result.success) {
            App.updateHealthScore(result.data.score);
            App.renderRiskResults(result.data);
        }
    } catch (error) {
        // Fallback to local analysis
        console.warn('API unavailable, using local analysis');
        const results = Analysis.analyzeData(input);
        App.updateHealthScore(results.score);
        App.renderRiskResults(results);
    }
    
    Utils.hideLoading();
}
    function analyzeData(input) {
        const findings = [];
        let penaltyScore = 0;
        
        // Analyze each disease
        for (const [diseaseId, disease] of Object.entries(diseaseKB)) {
            let risk = 0;
            
            if (disease.riskFactors) {
                for (const [factor, config] of Object.entries(disease.riskFactors)) {
                    switch (factor) {
                        case 'systolic':
                            if (input.systolic >= config.threshold) risk += config.weight;
                            break;
                        case 'diastolic':
                            if (input.diastolic >= config.threshold) risk += config.weight;
                            break;
                        case 'glucose':
                            if (input.glucose >= config.threshold) risk += config.weight;
                            break;
                        case 'bmi':
                            if (input.bmi >= config.threshold) risk += config.weight;
                            break;
                        case 'age':
                            if (input.age >= config.threshold) risk += config.weight;
                            break;
                        case 'temperature':
                            if (input.temperature >= config.threshold) risk += config.weight;
                            break;
                        case 'season':
                            if (disease.seasonal) {
                                const month = new Date().getMonth() + 1;
                                if (CONFIG.MALARIA_PEAK_MONTHS.includes(month)) risk += config.weight;
                            }
                            break;
                        case 'hypertension':
                            if (input.systolic >= 130 || input.diastolic >= 85) risk += config.weight;
                            break;
                        default:
                            risk += config.weight * 0.5; // Default factor contribution
                    }
                }
            }
            
            risk = Math.min(100, Math.max(0, risk));
            
            if (risk >= 5) {
                const level = risk >= 60 ? 'high' : risk >= 30 ? 'medium' : risk >= 15 ? 'low' : 'minimal';
                
                // Calculate penalty
                const penalties = { high: 30, medium: 15, low: 5, minimal: 2 };
                penaltyScore += penalties[level] || 0;
                
                findings.push({
                    id: diseaseId,
                    name: disease.name,
                    icon: disease.icon,
                    color: disease.color,
                    risk: risk,
                    level: level,
                    treatment: disease.treatment,
                    emergency: risk >= disease.emergencyThreshold
                });
            }
        }
        
        // Sort by risk
        findings.sort((a, b) => b.risk - a.risk);
        
        // Calculate health score
        const score = Math.max(0, Math.min(100, 100 - penaltyScore));
        
        return {
            score,
            findings,
            timestamp: Date.now(),
            urgency: findings.some(f => f.emergency) ? 'urgent' : 
                     findings.some(f => f.level === 'high') ? 'attention' : 'normal'
        };
    }
    
    /**
     * Quick analysis for single condition
     */
    function quickCheck(type, value) {
        switch (type) {
            case 'bp':
                return value >= 140 ? { level: 'high', message: 'Seek medical attention' } :
                       value >= 130 ? { level: 'medium', message: 'Monitor regularly' } :
                       { level: 'normal', message: 'Within range' };
            case 'glucose':
                return value >= 200 ? { level: 'high', message: 'Seek medical attention' } :
                       value >= 126 ? { level: 'medium', message: 'Monitor regularly' } :
                       { level: 'normal', message: 'Within range' };
            default:
                return { level: 'unknown', message: 'Check with doctor' };
        }
    }
    
    console.log('✅ Analysis module loaded');
    
    return {
        runAnalysis,
        analyzeData,
        quickCheck,
        diseaseKB
    };
})();
