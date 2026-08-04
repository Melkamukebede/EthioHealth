// ============================================
// ETHIOHEALTH AI PRO - HEALTH ANALYSIS MODULE
// ============================================

const Analysis = (function() {
    'use strict';
    
    /**
     * Run health analysis - tries API first, falls back to local
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
        
        console.log('📊 Input:', input);
        
        // Validate
        if (input.systolic < 60 || input.systolic > 250) {
            Utils.toast('Invalid systolic BP (60-250 mmHg)', 'warning');
            return;
        }
        
        Utils.showLoading('🤖 Grok AI analyzing health data...');
        
        let results = null;
        let usedAPI = false;
        
        // Try backend API first
        try {
            console.log('🌐 Trying backend API...');
            const response = await API.analyzeHealth(input);
            
            if (response.success && response.data) {
                results = response.data;
                usedAPI = true;
                console.log('✅ Using server analysis');
            }
        } catch (error) {
            console.warn('⚠️ API failed, using local analysis');
        }
        
        // Fallback to local analysis if API fails
        if (!results) {
            console.log('📱 Using local analysis');
            results = analyzeLocally(input);
        }
        
        Utils.hideLoading();
        
        // Update UI
        App.updateHealthScore(results.score);
        App.renderRiskResults(results);
        App.updateChart(results);
        
        // Save to database
        DB.saveAnalysis({ ...input, score: results.score, findings: results.findings });
        
        // Show result
        const emoji = results.score >= 70 ? '✅' : results.score >= 40 ? '⚠️' : '🚨';
        const source = usedAPI ? ' (Server)' : ' (Local)';
        Utils.toast(`${emoji} Health Score: ${results.score}/100${source}`, 
            results.score >= 70 ? 'success' : results.score >= 40 ? 'warning' : 'error');
        
        // Alert for high risks
        if (results.findings) {
            const highRisks = results.findings.filter(f => f.level === 'high');
            if (highRisks.length > 0) {
                setTimeout(() => {
                    Utils.toast(`⚠️ ${highRisks.length} high-risk condition(s) detected!`, 'warning', 5000);
                }, 2000);
            }
        }
        
        console.log('✅ Analysis complete:', results);
    }
    
    /**
     * Local fallback analysis
     */
    function analyzeLocally(input) {
        const findings = [];
        let penaltyScore = 0;
        
        // Hypertension
        let hyperRisk = 0;
        if (input.systolic >= 180) hyperRisk += 60;
        else if (input.systolic >= 160) hyperRisk += 45;
        else if (input.systolic >= 140) hyperRisk += 30;
        else if (input.systolic >= 130) hyperRisk += 15;
        else if (input.systolic >= 120) hyperRisk += 5;
        
        if (input.diastolic >= 110) hyperRisk += 35;
        else if (input.diastolic >= 90) hyperRisk += 20;
        else if (input.diastolic >= 85) hyperRisk += 10;
        
        if (input.age >= 60) hyperRisk += 15;
        else if (input.age >= 40) hyperRisk += 10;
        
        if (input.bmi >= 30) hyperRisk += 15;
        else if (input.bmi >= 25) hyperRisk += 8;
        
        hyperRisk = Math.min(100, hyperRisk);
        
        if (hyperRisk > 5) {
            const level = hyperRisk >= 50 ? 'high' : hyperRisk >= 25 ? 'medium' : 'low';
            penaltyScore += level === 'high' ? 30 : level === 'medium' ? 15 : 5;
            findings.push({
                id: 'hypertension',
                name: 'Hypertension',
                icon: 'fa-tint',
                color: '#ef4444',
                risk: hyperRisk,
                level: level,
                treatment: {
                    modern: ['Enalapril', 'Amlodipine', 'Hydrochlorothiazide'],
                    traditional: ['Moringa', 'Tosign', 'Gesho'],
                    lifestyle: ['Reduce salt to <5g/day', '30 min daily walk', 'Monitor BP weekly']
                }
            });
        }
        
        // Diabetes
        let diabetesRisk = 0;
        if (input.glucose >= 300) diabetesRisk += 70;
        else if (input.glucose >= 200) diabetesRisk += 50;
        else if (input.glucose >= 140) diabetesRisk += 35;
        else if (input.glucose >= 126) diabetesRisk += 20;
        else if (input.glucose >= 110) diabetesRisk += 10;
        
        if (input.bmi >= 35) diabetesRisk += 20;
        else if (input.bmi >= 30) diabetesRisk += 15;
        else if (input.bmi >= 25) diabetesRisk += 8;
        
        if (input.age >= 45) diabetesRisk += 15;
        
        diabetesRisk = Math.min(100, diabetesRisk);
        
        if (diabetesRisk > 5) {
            const level = diabetesRisk >= 50 ? 'high' : diabetesRisk >= 25 ? 'medium' : 'low';
            penaltyScore += level === 'high' ? 30 : level === 'medium' ? 15 : 5;
            findings.push({
                id: 'diabetes',
                name: 'Type 2 Diabetes',
                icon: 'fa-candy-cane',
                color: '#f59e0b',
                risk: diabetesRisk,
                level: level,
                treatment: {
                    modern: ['Metformin', 'Glibenclamide'],
                    traditional: ['Moringa', 'Grawa', 'Koseret'],
                    lifestyle: ['Exercise 30 min daily', 'Reduce sugar', 'Eat teff injera']
                }
            });
        }
        
        // Malaria
        let malariaRisk = 0;
        if (input.temperature >= 40) malariaRisk += 60;
        else if (input.temperature >= 39) malariaRisk += 40;
        else if (input.temperature >= 38) malariaRisk += 25;
        else if (input.temperature >= 37.5) malariaRisk += 10;
        
        const month = new Date().getMonth() + 1;
        if ([6, 7, 8, 9].includes(month)) malariaRisk += 25;
        
        malariaRisk = Math.min(100, malariaRisk);
        
        if (malariaRisk >= 10) {
            const level = malariaRisk >= 50 ? 'high' : malariaRisk >= 25 ? 'medium' : 'low';
            penaltyScore += level === 'high' ? 25 : level === 'medium' ? 15 : 5;
            findings.push({
                id: 'malaria',
                name: 'Malaria Risk',
                icon: 'fa-mosquito',
                color: '#3b82f6',
                risk: malariaRisk,
                level: level,
                treatment: {
                    modern: ['Artemether-Lumefantrine (Coartem)', 'Chloroquine'],
                    traditional: ['Neem', 'Gesho', 'Grawa'],
                    lifestyle: ['Sleep under treated nets', 'Eliminate standing water', 'Seek free RDT test']
                }
            });
        }
        
        // Obesity
        if (input.bmi >= 30) {
            findings.push({
                id: 'obesity',
                name: 'Obesity',
                icon: 'fa-weight-scale',
                color: '#f59e0b',
                risk: Math.min(100, (input.bmi - 25) * 4),
                level: input.bmi >= 35 ? 'high' : 'medium',
                treatment: {
                    modern: ['Weight management program'],
                    traditional: ['Moringa tea', 'Portion control'],
                    lifestyle: ['Exercise 45 min daily', 'Reduce processed foods']
                }
            });
            penaltyScore += 15;
        }
        
        // Underweight/Anemia
        if (input.bmi < 18.5) {
            findings.push({
                id: 'anemia',
                name: 'Anemia/Malnutrition Risk',
                icon: 'fa-tint',
                color: '#ef4444',
                risk: Math.min(100, (20 - input.bmi) * 8),
                level: input.bmi < 16 ? 'high' : 'medium',
                treatment: {
                    modern: ['Iron + Folic Acid (free at clinics)', 'Vitamin B12'],
                    traditional: ['Moringa', 'Teff-based foods', 'Lentils'],
                    lifestyle: ['Eat iron-rich foods', 'Regular deworming']
                }
            });
            penaltyScore += 15;
        }
        
        findings.sort((a, b) => b.risk - a.risk);
        
        return {
            score: Math.max(0, Math.min(100, 100 - penaltyScore)),
            findings,
            urgency: findings.some(f => f.risk >= 60) ? 'urgent' : 'normal',
            analyzedAt: new Date().toISOString(),
            source: 'local'
        };
    }
    
    console.log('✅ Analysis module loaded');
    
    return {
        runAnalysis,
        analyzeLocally
    };
})();
