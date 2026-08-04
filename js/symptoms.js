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
            container.innerHTML = '<span class="text-m
