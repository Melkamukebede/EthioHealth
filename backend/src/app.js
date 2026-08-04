/**
 * Grok-Style AI Health Analysis Service
 * Ethiopian-specific disease detection
 */

const diseaseKB = {
    hypertension: {
        name: { en: 'Hypertension', am: 'የደም ግፊት', om: 'Dhiibbaa Dhiigaa' },
        icon: 'fa-tint',
        color: '#ef4444',
        calculateRisk: (input) => {
            let risk = 0;
            if (input.systolic >= 180) risk += 60;
            else if (input.systolic >= 160) risk += 45;
            else if (input.systolic >= 140) risk += 30;
            else if (input.systolic >= 130) risk += 15;
            else if (input.systolic >= 120) risk += 5;
            
            if (input.diastolic >= 110) risk += 35;
            else if (input.diastolic >= 90) risk += 20;
            else if (input.diastolic >= 85) risk += 10;
            
            if (input.age >= 60) risk += 15;
            else if (input.age >= 40) risk += 10;
            
            if (input.bmi >= 30) risk += 15;
            else if (input.bmi >= 25) risk += 8;
            
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Enalapril', 'Amlodipine', 'Hydrochlorothiazide', 'Atenolol'],
            traditional: ['Moringa', 'Tosign', 'Gesho'],
            lifestyle: ['Reduce salt to <5g/day', '30 min daily walk', 'Monitor BP weekly at health center']
        }
    },
    diabetes: {
        name: { en: 'Type 2 Diabetes', am: 'ዓይነት 2 የስኳር', om: 'Sukkaara Gosa 2' },
        icon: 'fa-candy-cane',
        color: '#f59e0b',
        calculateRisk: (input) => {
            let risk = 0;
            if (input.glucose >= 300) risk += 70;
            else if (input.glucose >= 200) risk += 50;
            else if (input.glucose >= 140) risk += 35;
            else if (input.glucose >= 126) risk += 20;
            else if (input.glucose >= 110) risk += 10;
            else if (input.glucose >= 100) risk += 5;
            
            if (input.bmi >= 35) risk += 20;
            else if (input.bmi >= 30) risk += 15;
            else if (input.bmi >= 25) risk += 8;
            
            if (input.age >= 45) risk += 15;
            
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Metformin', 'Glibenclamide', 'Insulin NPH'],
            traditional: ['Moringa', 'Grawa', 'Koseret'],
            lifestyle: ['Exercise 30 min daily', 'Reduce sugar intake', 'Eat teff injera instead of white bread']
        }
    },
    malaria: {
        name: { en: 'Malaria', am: 'ወባ', om: 'Busaa' },
        icon: 'fa-mosquito',
        color: '#3b82f6',
        calculateRisk: (input) => {
            let risk = 0;
            if (input.temperature >= 40) risk += 60;
            else if (input.temperature >= 39) risk += 40;
            else if (input.temperature >= 38) risk += 25;
            else if (input.temperature >= 37.5) risk += 10;
            
            const month = new Date().getMonth() + 1;
            if ([6,7,8,9].includes(month)) risk += 25;
            
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Artemether-Lumefantrine (Coartem)', 'Chloroquine', 'Quinine'],
            traditional: ['Neem', 'Gesho', 'Grawa'],
            lifestyle: ['Sleep under treated nets', 'Eliminate standing water', 'Seek free RDT test at health center']
        }
    },
    tuberculosis: {
        name: { en: 'Tuberculosis (TB)', am: 'ሳንባ ነቀርሳ', om: 'Sombisaa' },
        icon: 'fa-lungs',
        color: '#8b5cf6',
        calculateRisk: (input) => {
            let risk = 0;
            if (input.symptoms?.includes('persistent_cough')) risk += 40;
            if (input.symptoms?.includes('night_sweats')) risk += 25;
            if (input.symptoms?.includes('weight_loss')) risk += 20;
            if (input.symptoms?.includes('fever')) risk += 10;
            if (input.symptoms?.includes('chest_pain')) risk += 15;
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol'],
            traditional: [],
            lifestyle: ['Complete full DOTS treatment', 'Good nutrition', 'Respiratory hygiene', 'Free treatment at government clinics']
        }
    },
    anemia: {
        name: { en: 'Anemia/Malnutrition', am: 'የደም ማነስ', om: 'Dhiiga Hanqina' },
        icon: 'fa-tint',
        color: '#ef4444',
        calculateRisk: (input) => {
            let risk = 0;
            if (input.bmi < 18.5) risk += 50;
            else if (input.bmi < 20) risk += 25;
            if (input.symptoms?.includes('fatigue')) risk += 15;
            if (input.symptoms?.includes('pale_skin')) risk += 20;
            if (input.symptoms?.includes('dizziness')) risk += 15;
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Iron + Folic Acid', 'Vitamin B12'],
            traditional: ['Moringa', 'Teff-based foods', 'Lentils'],
            lifestyle: ['Eat iron-rich foods', 'Free supplements at antenatal clinics', 'Regular deworming']
        }
    }
};

/**
 * Generate Grok-style reasoning
 */
function generateReasoning(findings, input) {
    const reasoning = [];
    
    if (findings.length === 0) {
        reasoning.push('Based on the provided health data, no significant disease risks were identified. All vital signs appear within normal ranges.');
        return reasoning;
    }
    
    reasoning.push(`Analysis of ${Object.keys(input).filter(k => k !== 'symptoms').length} vital signs reveals ${findings.length} potential health conditions.`);
    
    findings.slice(0, 3).forEach(f => {
        reasoning.push(`${f.name.en}: ${f.risk}% probability based on ${f.factors?.length || 'multiple'} risk factors. ${f.risk >= 50 ? 'This requires medical attention.' : 'Monitor and follow preventive measures.'}`);
    });
    
    if (input.symptoms?.length > 0) {
        reasoning.push(`Additionally, ${input.symptoms.length} reported symptoms were factored into the analysis.`);
    }
    
    return reasoning;
}

/**
 * Main analysis function
 */
function analyze(input) {
    const findings = [];
    let penaltyScore = 0;
    
    // Analyze each disease
    for (const [diseaseId, disease] of Object.entries(diseaseKB)) {
        const risk = disease.calculateRisk(input);
        
        if (risk >= 5) {
            const level = risk >= 60 ? 'high' : risk >= 30 ? 'medium' : risk >= 15 ? 'low' : 'minimal';
            const penalties = { high: 30, medium: 15, low: 5, minimal: 2 };
            penaltyScore += penalties[level];
            
            findings.push({
                id: diseaseId,
                name: disease.name,
                icon: disease.icon,
                color: disease.color,
                risk,
                level,
                treatment: disease.treatment,
                emergency: risk >= 60
            });
        }
    }
    
    // Sort by risk
    findings.sort((a, b) => b.risk - a.risk);
    
    // Calculate score
    const score = Math.max(0, Math.min(100, 100 - penaltyScore));
    
    // Determine urgency
    const urgency = findings.some(f => f.emergency) ? 'urgent' :
                    findings.some(f => f.level === 'high') ? 'attention' : 'normal';
    
    // Generate recommendations
    const recommendations = findings.map(f => ({
        condition: f.name.en,
        modern: f.treatment.modern.slice(0, 3),
        traditional: f.treatment.traditional.slice(0, 2),
        lifestyle: f.treatment.lifestyle[0]
    }));
    
    return {
        score,
        findings,
        reasoning: generateReasoning(findings, input),
        urgency,
        recommendations,
        timestamp: new Date().toISOString()
    };
}

module.exports = { analyze, diseaseKB };
