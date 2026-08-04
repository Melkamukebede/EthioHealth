// ============================================
// ETHIOHEALTH AI PRO - SYMPTOM CHECKER MODULE
// ============================================

const Symptoms = (function() {
    'use strict';
    
    // Complete symptom database
    const symptomDB = {
        body: {
            head: ['headache', 'dizziness', 'fever', 'blurred_vision', 'ear_pain', 'hearing_loss', 'ringing_ears', 'sinus_pressure', 'migraine', 'confusion', 'memory_loss', 'insomnia', 'concussion'],
            neck: ['neck_pain', 'stiff_neck', 'sore_throat', 'swollen_glands', 'difficulty_swallowing', 'hoarseness', 'thyroid_swelling'],
            chest: ['chest_pain', 'shortness_breath', 'cough', 'wheezing', 'rapid_heartbeat', 'irregular_heartbeat', 'chest_tightness', 'heartburn', 'palpitations'],
            abdomen: ['abdominal_pain', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'bloating', 'cramps', 'loss_appetite', 'indigestion', 'gas', 'acid_reflux'],
            left_arm: ['shoulder_pain', 'arm_pain', 'elbow_pain', 'numbness', 'tingling', 'swelling', 'weakness'],
            right_arm: ['shoulder_pain', 'arm_pain', 'elbow_pain', 'numbness', 'tingling', 'swelling', 'weakness'],
            left_hand: ['hand_pain', 'finger_pain', 'numbness', 'tingling', 'swelling', 'stiffness', 'tremors'],
            right_hand: ['hand_pain', 'finger_pain', 'numbness', 'tingling', 'swelling', 'stiffness', 'tremors'],
            left_leg: ['hip_pain', 'thigh_pain', 'knee_pain', 'muscle_cramps', 'swelling', 'weakness', 'sciatica'],
            right_leg: ['hip_pain', 'thigh_pain', 'knee_pain', 'muscle_cramps', 'swelling', 'weakness', 'sciatica'],
            left_foot: ['foot_pain', 'heel_pain', 'toe_pain', 'swelling', 'numbness', 'plantar_fasciitis'],
            right_foot: ['foot_pain', 'heel_pain', 'toe_pain', 'swelling', 'numbness', 'plantar_fasciitis']
        },
        mind: {
            emotional: ['anxiety', 'depression', 'stress', 'mood_swings', 'irritability', 'anger', 'apathy', 'emotional_numbness', 'crying_spells'],
            cognitive: ['brain_fog', 'poor_concentration', 'memory_loss', 'indecisiveness', 'racing_thoughts', 'overthinking'],
            behavioral: ['insomnia', 'nightmares', 'restlessness', 'social_withdrawal', 'panic_attacks', 'phobias', 'obsessive_thoughts'],
            severe: ['suicidal_thoughts', 'hallucinations', 'paranoia', 'ptsd_flashbacks', 'bipolar_symptoms']
        },
        spirit: {
            existential: ['lack_purpose', 'emptiness', 'hopelessness', 'existential_crisis', 'feeling_lost', 'meaninglessness'],
            emotional: ['loneliness', 'grief', 'fear', 'guilt', 'shame', 'disconnection'],
            spiritual: ['spiritual_distress', 'loss_of_faith', 'inner_conflict', 'moral_distress', 'spiritual_emptiness']
        },
        social: {
            relationships: ['isolation', 'family_conflict', 'marital_problems', 'community_rejection', 'domestic_violence'],
            economic: ['financial_stress', 'unemployment', 'housing_issues', 'food_insecurity', 'legal_problems'],
            work: ['work_stress', 'academic_pressure', 'discrimination', 'bullying', 'harassment'],
            support: ['lack_support', 'childcare_stress', 'elder_care_burden', 'language_barrier', 'cultural_isolation']
        }
    };
    
    // Symptom presets
    const presets = {
        malaria: {
            name: 'Malaria Suspect',
            icon: 'fa-mosquito',
            symptoms: ['fever', 'chills', 'headache', 'muscle_pain', 'fatigue', 'nausea', 'sweating'],
            duration: '1day'
        },
        respiratory: {
            name: 'Respiratory Infection',
            icon: 'fa-lungs',
            symptoms: ['cough', 'fever', 'chest_pain', 'shortness_breath', 'sore_throat', 'fatigue', 'runny_nose'],
            duration: '2-3days'
        },
        digestive: {
            name: 'Digestive Issues',
            icon: 'fa-stomach',
            symptoms: ['abdominal_pain', 'nausea', 'vomiting', 'diarrhea', 'loss_appetite', 'bloating', 'cramps'],
            duration: 'hours'
        },
        stress: {
            name: 'Stress & Anxiety',
            icon: 'fa-brain',
            symptoms: ['anxiety', 'stress', 'insomnia', 'fatigue', 'headache', 'irritability', 'poor_concentration'],
            duration: 'weeks'
        }
    };
    
    /**
     * Setup body map interactions
     */
    function setupBodyMap() {
        document.querySelectorAll('.body-part').forEach(part => {
            part.addEventListener('click', function(e) {
                e.preventDefault();
                const partName = this.dataset.part;
                
                // Highlight selected
                document.querySelectorAll('.body-part').forEach(p => p.classList.remove('selected'));
                this.classList.add('selected');
                
                // Show symptoms for body part
                showBodyPartSymptoms(partName);
                
                Utils.vibrate(30);
            });
        });
    }
    
    /**
     * Show symptoms for clicked body part
     */
    function showBodyPartSymptoms(partName) {
        const symptoms = symptomDB.body[partName] || ['pain', 'swelling', 'discomfort'];
        const container = Utils.getEl('bodyPartSymptoms');
        if (!container) return;
        
        const displayName = partName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const selectedSymptoms = App.getSelectedSymptoms();
        
        container.innerHTML = `
            <p class="fw-bold small mb-2">
                <i class="fas fa-map-marker-alt text-danger me-1"></i>${displayName} Symptoms:
            </p>
            <div class="symptom-list">
                ${symptoms.map(s => `
                    <span class="symptom-tag ${selectedSymptoms.includes(s) ? 'selected' : ''}" 
                          onclick="App.toggleSymptom('${s}')" style="cursor:pointer;">
                        ${s.replace(/_/g, ' ')}
                    </span>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Show category symptoms (mind/spirit/social)
     */
    function showCategorySymptoms(category) {
        const container = Utils.getEl('categorySymptoms');
        if (!container) return;
        
        const categoryData = symptomDB[category];
        if (!categoryData) return;
        
        let allSymptoms = [];
        for (const subcategory of Object.values(categoryData)) {
            allSymptoms = allSymptoms.concat(subcategory);
        }
        
        const selectedSymptoms = App.getSelectedSymptoms();
        
        container.innerHTML = allSymptoms.map(s => `
            <span class="symptom-tag ${selectedSymptoms.includes(s) ? 'selected' : ''}" 
                  onclick="App.toggleSymptom('${s}')" style="cursor:pointer;">
                ${s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
        `).join('');
    }
    
    /**
     * Load preset symptoms
     */
    function loadPreset(presetName) {
        const preset = presets[presetName];
        if (!preset) return;
        
        App.setSelectedSymptoms([...preset.symptoms]);
        
        // Update UI
        updateSelectedDisplay();
        
        // Set duration if exists
        if (preset.duration) {
            const durationEl = Utils.getEl('symptomDuration');
            if (durationEl) durationEl.value = preset.duration;
        }
        
        // Highlight matching tags
        document.querySelectorAll('.symptom-tag').forEach(tag => {
            const onclick = tag.getAttribute('onclick') || '';
            const symptom = onclick.match(/'([^']+)'/)?.[1];
            if (symptom && preset.symptoms.includes(symptom)) {
                tag.classList.add('selected');
            }
        });
        
        Utils.toast(`✅ Loaded: ${preset.name} (${preset.symptoms.length} symptoms)`, 'success');
    }
    
    /**
     * Update selected symptoms display
     */
    function updateSelectedDisplay() {
        const container = Utils.getEl('selectedSymptomsList');
        if (!container) return;
        
        const symptoms = App.getSelectedSymptoms();
        
        if (symptoms.length === 0) {
            container.innerHTML = '<span class="text-muted small">None selected - click symptoms above</span>';
        } else {
            container.innerHTML = symptoms.map(s => `
                <span class="badge bg-success me-1 mb-1" style="cursor:pointer;" 
                      onclick="App.toggleSymptom('${s}')">
                    ${s.replace(/_/g, ' ')} <i class="fas fa-times ms-1"></i>
                </span>
            `).join(' ');
        }
    }
    
    /**
     * Analyze selected symptoms
     */
    function analyzeSymptoms() {
        const symptoms = App.getSelectedSymptoms();
        
        if (symptoms.length === 0) {
            Utils.toast('Please select at least one symptom', 'warning');
            return;
        }
        
        const duration = Utils.getEl('symptomDuration')?.value || 'days';
        const severity = parseInt(Utils.getEl('severitySlider')?.value || '5');
        const notes = Utils.getEl('symptomNotes')?.value || '';
        
        Utils.showLoading('🔍 Grok AI analyzing symptoms...');
        
        setTimeout(() => {
            const results = matchSymptomsToConditions(symptoms, severity, duration);
            Utils.hideLoading();
            
            // Display results
            const resultsDiv = Utils.getEl('symptomResults');
            const contentDiv = Utils.getEl('symptomResultsContent');
            
            if (resultsDiv) resultsDiv.style.display = 'block';
            if (contentDiv) {
                contentDiv.innerHTML = results.length > 0 ? results.map(r => `
                    <div class="risk-item ${r.urgency === 'urgent' ? 'high' : r.urgency === 'moderate' ? 'medium' : 'low'} mb-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <strong><i class="fas ${r.icon} me-2"></i>${r.name}</strong>
                            <span class="fw-bold">${r.confidence}%</span>
                        </div>
                        <p class="small mb-0 mt-1">${r.message}</p>
                        ${r.action ? `<p class="small text-success mb-0"><i class="fas fa-check-circle me-1"></i>${r.action}</p>` : ''}
                        ${r.medicines ? `<p class="small text-primary mb-0 mt-1"><i class="fas fa-pills me-1"></i>${r.medicines.join(', ')}</p>` : ''}
                    </div>
                `).join('') : `<p class="text-center text-muted"><i class="fas fa-check-circle text-success fs-4 d-block mb-2"></i>No specific conditions identified. Monitor and consult doctor if symptoms persist.</p>`;
            }
            
            // Scroll to results
            Utils.scrollTo('symptomResults');
            
            // Save to DB
            DB.saveSymptomCheck({ symptoms, duration, severity, notes, results });
            
            Utils.toast(`🔍 ${results.length} condition(s) identified`, results.length > 0 ? 'warning' : 'success');
        }, 1500);
    }
    
    /**
     * Match symptoms to potential conditions
     */
    function matchSymptomsToConditions(symptoms, severity, duration) {
        const findings = [];
        const sympStr = symptoms.join(' ').toLowerCase();
        
        // Malaria check
        if ((sympStr.includes('fever') || sympStr.includes('chills')) && 
            (sympStr.includes('headache') || sympStr.includes('muscle_pain') || sympStr.includes('fatigue'))) {
            findings.push({
                name: 'Possible Malaria',
                icon: 'fa-mosquito',
                confidence: Math.min(90, 50 + (severity >= 7 ? 25 : 0) + (sympStr.includes('chills') ? 15 : 0)),
                urgency: severity >= 7 ? 'urgent' : 'moderate',
                message: 'Seek malaria RDT test at nearest health center immediately. Free testing available.',
                action: 'Visit health center for free RDT test',
                medicines: ['Artemether-Lumefantrine (Coartem)']
            });
        }
        
        // Respiratory/TB check
        if ((sympStr.includes('cough') || sympStr.includes('chest_pain')) && 
            (sympStr.includes('fever') || sympStr.includes('fatigue') || sympStr.includes('shortness_breath'))) {
            const isTB = sympStr.includes('night_sweats') || sympStr.includes('weight_loss') || duration === 'weeks' || duration === 'months';
            findings.push({
                name: isTB ? 'Possible Tuberculosis (TB)' : 'Respiratory Infection',
                icon: 'fa-lungs',
                confidence: Math.min(85, 40 + (isTB ? 30 : 0) + (severity >= 6 ? 15 : 0)),
                urgency: isTB ? 'urgent' : 'moderate',
                message: isTB ? 'Free TB testing and treatment at government clinics (DOTS program).' : 'Rest and hydrate. Seek care if breathing difficulty worsens.',
                action: isTB ? 'Visit health center for sputum test (free)' : 'Monitor and rest',
                medicines: isTB ? ['Rifampicin', 'Isoniazid'] : ['Amoxicillin', 'Paracetamol']
            });
        }
        
        // Typhoid check
        if (sympStr.includes('fever') && (sympStr.includes('abdominal_pain') || sympStr.includes('constipation') || sympStr.includes('diarrhea'))) {
            findings.push({
                name: 'Possible Typhoid Fever',
                icon: 'fa-temperature-high',
                confidence: Math.min(80, 40 + (severity >= 6 ? 20 : 0)),
                urgency: 'moderate',
                message: 'Requires antibiotic treatment. Drink only boiled water.',
                action: 'Visit health center for Widal test',
                medicines: ['Ciprofloxacin', 'Ceftriaxone']
            });
        }
        
        // Hypertension symptoms
        if ((sympStr.includes('headache') || sympStr.includes('dizziness')) && 
            (sympStr.includes('blurred_vision') || sympStr.includes('chest_pain') || sympStr.includes('rapid_heartbeat'))) {
            findings.push({
                name: 'Possible Hypertension',
                icon: 'fa-tint',
                confidence: Math.min(70, 30 + (severity >= 6 ? 20 : 0)),
                urgency: 'moderate',
                message: 'Check blood pressure at nearest health post. Reduce salt intake.',
                action: 'Check BP at health center (free)',
                medicines: ['Enalapril', 'Amlodipine']
            });
        }
        
        // Diabetes symptoms
        if ((sympStr.includes('frequent_urination') || sympStr.includes('excessive_thirst') || sympStr.includes('blurred_vision')) && 
            sympStr.includes('fatigue')) {
            findings.push({
                name: 'Possible Diabetes',
                icon: 'fa-candy-cane',
                confidence: Math.min(70, 35 + (severity >= 6 ? 15 : 0)),
                urgency: 'moderate',
                message: 'Get fasting glucose test. Reduce sugar and refined carbs.',
                action: 'Fasting glucose test at health center',
                medicines: ['Metformin']
            });
        }
        
        return findings;
    }
    
    console.log('✅ Symptoms module loaded');
    
    return {
        setupBodyMap,
        showBodyPartSymptoms,
        showCategorySymptoms,
        loadPreset,
        updateSelectedDisplay,
        analyzeSymptoms,
        symptomDB,
        presets
    };
})();
