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
        },
        prevalence: '16-20% of Ethiopian adults'
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
        },
        prevalence: '5-8% of adults, rising in urban areas'
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
            
            // Seasonal factor (June-September = peak)
            const month = new Date().getMonth() + 1;
            if ([6, 7, 8, 9].includes(month)) risk += 25;
            
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Artemether-Lumefantrine (Coartem)', 'Chloroquine', 'Quinine'],
            traditional: ['Neem', 'Gesho', 'Grawa'],
            lifestyle: ['Sleep under treated nets', 'Eliminate standing water', 'Seek free RDT test at health center']
        },
        prevalence: '60% of population at risk'
    },
    
    tuberculosis: {
        name: { en: 'Tuberculosis (TB)', am: 'ሳንባ ነቀርሳ', om: 'Sombisaa' },
        icon: 'fa-lungs',
        color: '#8b5cf6',
        calculateRisk: (input) => {
            let risk = 0;
            const symptoms = input.symptoms || [];
            if (symptoms.includes('persistent_cough')) risk += 40;
            if (symptoms.includes('night_sweats')) risk += 25;
            if (symptoms.includes('weight_loss')) risk += 20;
            if (symptoms.includes('fever')) risk += 10;
            if (symptoms.includes('chest_pain')) risk += 15;
            if (symptoms.includes('coughing_blood')) risk += 30;
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol'],
            traditional: [],
            lifestyle: ['Complete full DOTS treatment (free)', 'Good nutrition', 'Respiratory hygiene']
        },
        prevalence: 'High burden: 150+ per 100,000'
    },
    
    anemia: {
        name: { en: 'Anemia/Malnutrition', am: 'የደም ማነስ', om: 'Dhiiga Hanqina' },
        icon: 'fa-tint',
        color: '#ef4444',
        calculateRisk: (input) => {
            let risk = 0;
            if (input.bmi < 16) risk += 50;
            else if (input.bmi < 18.5) risk += 30;
            else if (input.bmi < 20) risk += 15;
            
            const symptoms = input.symptoms || [];
            if (symptoms.includes('fatigue')) risk += 15;
            if (symptoms.includes('pale_skin')) risk += 20;
            if (symptoms.includes('dizziness')) risk += 15;
            if (symptoms.includes('shortness_breath')) risk += 10;
            
            return Math.min(100, risk);
        },
        treatment: {
            modern: ['Iron + Folic Acid (free at clinics)', 'Vitamin B12'],
            traditional: ['Moringa', 'Teff-based foods', 'Lentils and spinach'],
            lifestyle: ['Eat iron-rich foods', 'Take supplements if prescribed', 'Regular deworming']
        },
        prevalence: '24% of women, 57% of children under 5'
    }
};

/**
 * Generate reasoning for the analysis
 */
function generateReasoning(findings, input) {
    if (findings.length === 0) {
        return ['All vital signs appear within normal ranges. No significant disease risks identified.'];
    }
    
    const reasoning = [];
    reasoning.push(`Analysis of ${Object.keys(input).length} health parameters reveals ${findings.length} potential health conditions.`);
    
    findings.slice(0, 3).forEach(f => {
        reasoning.push(
            `${f.name.en}: ${f.risk}% risk (${f.level} level). ` +
            `${f.risk >= 50 ? 'Medical consultation recommended.' : 'Preventive measures advised.'}`
        );
    });
    
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
            penaltyScore += penalties[level] || 0;
            
            findings.push({
                id: diseaseId,
                name: disease.name,
                icon: disease.icon,
                color: disease.color,
                risk,
                level,
                treatment: disease.treatment,
                prevalence: disease.prevalence,
                emergency: risk >= 60
            });
        }
    }

    // Sort by risk (highest first)
    findings.sort((a, b) => b.risk - a.risk);

    // Calculate health score
    const score = Math.max(0, Math.min(100, 100 - penaltyScore));

    // Determine overall urgency
    const urgency = findings.some(f => f.emergency) ? 'urgent' :
                    findings.some(f => f.level === 'high') ? 'attention' : 'normal';

    // Generate recommendations
    const recommendations = findings.map(f => ({
        condition: f.name.en,
        risk: f.risk,
        level: f.level,
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
        analyzedAt: new Date().toISOString(),
        dataPoints: {
            systolic: input.systolic,
            diastolic: input.diastolic,
            glucose: input.glucose,
            bmi: input.bmi,
            temperature: input.temperature,
            age: input.age
        }
    };
}

module.exports = { analyze, diseaseKB };
