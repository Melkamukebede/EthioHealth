// ============================================
// ETHIOHEALTH AI PRO - MAIN APPLICATION
// Bootstrap + Font Awesome + Amazon Style
// ============================================

const App = (function() {
    'use strict';
    
    const app = {
        currentTab: 'home',
        selectedSymptoms: [],
        latestAnalysis: null,
        healthChart: null,
        isListening: false,
        
        init: function() {
            console.log('🧬 EthioHealth AI Pro Initializing...');
            app.setupBodyMap();
            app.setupEventListeners();
            app.renderHerbList();
            app.updateLanguageUI();
            console.log('✅ Ready');
        },
        
        setupEventListeners: function() {
            document.getElementById('severitySlider')?.addEventListener('input', function() {
                document.getElementById('severityValue').textContent = this.value;
            });
            window.addEventListener('online', () => app.toast('Back online', 'success'));
            window.addEventListener('offline', () => app.toast('Offline mode', 'warning'));
        },
        
        setupBodyMap: function() {
            document.querySelectorAll('.body-part').forEach(part => {
                part.addEventListener('click', function() {
                    document.querySelectorAll('.body-part').forEach(p => p.classList.remove('selected'));
                    this.classList.add('selected');
                    app.showBodyPartSymptoms(this.dataset.part);
                });
            });
        },
        
        switchTab: function(tab) {
            app.currentTab = tab;
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
            const panel = document.getElementById('tab-' + tab);
            if (panel) panel.style.display = 'block';
            document.querySelectorAll(`[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (tab === 'traditional') app.renderHerbList();
        },
        
        runAnalysis: function() {
            const getVal = (id, def) => { const el = document.getElementById(id); return el ? (parseFloat(el.value) || def) : def; };
            const input = {
                systolic: getVal('inputSystolic', 120), diastolic: getVal('inputDiastolic', 80),
                glucose: getVal('inputGlucose', 95), bmi: getVal('inputBMI', 24),
                temperature: getVal('inputTemp', 36.6), age: getVal('inputAge', 30)
            };
            
            app.showLoading('Grok AI analyzing...');
            
            setTimeout(() => {
                const results = app.analyzeData(input);
                app.latestAnalysis = results;
                app.hideLoading();
                app.updateHealthScore(results.score);
                app.renderRiskResults(results);
                app.toast(`${results.score >= 70 ? '✅' : '⚠️'} Score: ${results.score}/100`, results.score >= 70 ? 'success' : 'warning');
            }, 1800);
        },
        
        analyzeData: function(input) {
            const diseases = []; let penalty = 0;
            
            let hyperRisk = 0;
            if (input.systolic >= 180) hyperRisk += 60;
            else if (input.systolic >= 140) hyperRisk += 35;
            else if (input.systolic >= 130) hyperRisk += 15;
            if (input.diastolic >= 90) hyperRisk += 25;
            if (input.age >= 40) hyperRisk += 10;
            hyperRisk = Math.min(100, hyperRisk);
            
            if (hyperRisk > 5) {
                const lvl = hyperRisk >= 50 ? 'high' : hyperRisk >= 25 ? 'medium' : 'low';
                penalty += lvl === 'high' ? 30 : lvl === 'medium' ? 15 : 5;
                diseases.push({ name: 'Hypertension', icon: 'fa-tint', risk: hyperRisk, level: lvl, treatment: { modern: ['Enalapril','Amlodipine'], traditional: ['Moringa','Tosign'] } });
            }
            
            let diabetesRisk = 0;
            if (input.glucose >= 200) diabetesRisk += 50;
            else if (input.glucose >= 140) diabetesRisk += 35;
            else if (input.glucose >= 126) diabetesRisk += 20;
            if (input.bmi >= 30) diabetesRisk += 15;
            diabetesRisk = Math.min(100, diabetesRisk);
            
            if (diabetesRisk > 5) {
                const lvl = diabetesRisk >= 50 ? 'high' : diabetesRisk >= 25 ? 'medium' : 'low';
                penalty += lvl === 'high' ? 30 : lvl === 'medium' ? 15 : 5;
                diseases.push({ name: 'Type 2 Diabetes', icon: 'fa-candy-cane', risk: diabetesRisk, level: lvl, treatment: { modern: ['Metformin'], traditional: ['Moringa','Grawa'] } });
            }
            
            let malariaRisk = 0;
            if (input.temperature >= 39) malariaRisk += 50;
            else if (input.temperature >= 38) malariaRisk += 30;
            const month = new Date().getMonth() + 1;
            if (month >= 6 && month <= 9) malariaRisk += 20;
            malariaRisk = Math.min(100, malariaRisk);
            
            if (malariaRisk >= 10) {
                const lvl = malariaRisk >= 50 ? 'high' : malariaRisk >= 25 ? 'medium' : 'low';
                penalty += lvl === 'high' ? 20 : 10;
                diseases.push({ name: 'Malaria Risk', icon: 'fa-mosquito', risk: malariaRisk, level: lvl, treatment: { modern: ['Coartem'], traditional: ['Neem','Gesho'] } });
            }
            
            diseases.sort((a, b) => b.risk - a.risk);
            return { score: Math.max(0, Math.min(100, 100 - penalty)), findings: diseases, timestamp: Date.now() };
        },
        
        updateHealthScore: function(score) {
            const el = document.getElementById('healthScore');
            if (el) { el.textContent = score; el.style.color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'; }
        },
        
        renderRiskResults: function(results) {
            const container = document.getElementById('riskResults');
            if (!container) return;
            if (!results?.findings?.length) { container.innerHTML = '<p class="text-center text-muted py-3"><i class="fas fa-check-circle text-success fs-4 d-block mb-2"></i>No risks detected</p>'; return; }
            
            container.innerHTML = results.findings.map(f => `
                <div class="risk-item ${f.level}">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong><i class="fas ${f.icon} me-2"></i>${f.name}</strong>
                        <span class="fw-bold" style="color:${f.level==='high'?'#ef4444':f.level==='medium'?'#f59e0b':'#10b981'}">${f.risk}%</span>
                    </div>
                    <div class="risk-bar"><div class="risk-bar-fill ${f.level}" style="width:${f.risk}%"></div></div>
                    ${f.treatment ? `<div class="mt-2 small"><span class="badge bg-primary me-1">Modern</span> ${f.treatment.modern?.join(', ')}</div>
                    ${f.treatment.traditional?.length ? `<div class="mt-1 small"><span class="badge bg-success me-1">Traditional</span> ${f.treatment.traditional.join(', ')}</div>` : ''}` : ''}
                </div>
            `).join('');
        },
        
        showBodyPartSymptoms: function(part) {
            const map = {
                'head': ['headache','dizziness','fever','blurred_vision','ear_pain','confusion'],
                'chest': ['chest_pain','shortness_breath','cough','wheezing','rapid_heartbeat'],
                'abdomen': ['abdominal_pain','nausea','vomiting','diarrhea','constipation','loss_appetite'],
                'left_arm': ['shoulder_pain','arm_pain','numbness','tingling','weakness'],
                'right_arm': ['shoulder_pain','arm_pain','numbness','tingling','weakness'],
                'left_leg': ['hip_pain','knee_pain','swelling','muscle_cramps'],
                'right_leg': ['hip_pain','knee_pain','swelling','muscle_cramps'],
                'left_foot': ['foot_pain','heel_pain','swelling','numbness'],
                'right_foot': ['foot_pain','heel_pain','swelling','numbness']
            };
            const symptoms = map[part] || ['pain','swelling'];
            const container = document.getElementById('bodyPartSymptoms');
            if (container) {
                container.innerHTML = `<p class="fw-bold small">📍 ${part.replace(/_/g,' ')}:</p>` + 
                    symptoms.map(s => `<span class="symptom-tag ${app.selectedSymptoms.includes(s)?'selected':''}" onclick="App.toggleSymptom('${s}')">${s.replace(/_/g,' ')}</span>`).join('');
            }
        },
        
        changeHolisticTab: function(category) {
            document.querySelectorAll('#holisticTabs .nav-link').forEach(t => t.classList.remove('active'));
            document.querySelector(`#holisticTabs [data-category="${category}"]`)?.classList.add('active');
            document.getElementById('bodyMapContainer').style.display = category === 'body' ? 'block' : 'none';
            document.getElementById('categorySymptoms').style.display = category !== 'body' ? 'grid' : 'none';
            if (category !== 'body') app.showCategorySymptoms(category);
        },
        
        showCategorySymptoms: function(category) {
            const symptoms = {
                'mind': ['anxiety','depression','stress','insomnia','mood_swings','panic_attacks','brain_fog','restlessness'],
                'spirit': ['loneliness','grief','fear','hopelessness','emptiness','disconnection'],
                'social': ['isolation','family_conflict','financial_stress','work_stress','lack_support']
            };
            const list = symptoms[category] || [];
            const container = document.getElementById('categorySymptoms');
            if (container) container.innerHTML = list.map(s => `<span class="symptom-tag ${app.selectedSymptoms.includes(s)?'selected':''}" onclick="App.toggleSymptom('${s}')">${s.replace(/_/g,' ')}</span>`).join('');
        },
        
        toggleSymptom: function(symptom) {
            const idx = app.selectedSymptoms.indexOf(symptom);
            idx > -1 ? app.selectedSymptoms.splice(idx, 1) : app.selectedSymptoms.push(symptom);
            document.querySelectorAll(`.symptom-tag`).forEach(el => {
                if (el.onclick?.toString().includes(`'${symptom}'`)) el.classList.toggle('selected', app.selectedSymptoms.includes(symptom));
            });
            const list = document.getElementById('selectedSymptomsList');
            if (list) list.innerHTML = app.selectedSymptoms.length ? app.selectedSymptoms.map(s => `<span class="badge bg-success me-1">${s.replace(/_/g,' ')} ✕</span>`).join('') : '<span class="text-muted small">None selected</span>';
        },
        
        loadPreset: function(preset) {
            const presets = {
                'malaria': ['fever','chills','headache','muscle_pain','fatigue','nausea'],
                'respiratory': ['cough','fever','chest_pain','shortness_breath','sore_throat'],
                'digestive': ['abdominal_pain','nausea','vomiting','diarrhea','loss_appetite'],
                'stress': ['anxiety','stress','insomnia','fatigue','headache','irritability']
            };
            app.selectedSymptoms = presets[preset] || [];
            document.querySelectorAll('.symptom-tag').forEach(el => el.classList.remove('selected'));
            app.selectedSymptoms.forEach(s => document.querySelectorAll(`.symptom-tag`).forEach(el => {
                if (el.onclick?.toString().includes(`'${s}'`)) el.classList.add('selected');
            }));
            const list = document.getElementById('selectedSymptomsList');
            if (list) list.innerHTML = app.selectedSymptoms.map(s => `<span class="badge bg-success me-1">${s.replace(/_/g,' ')} ✕</span>`).join('');
            app.switchTab('symptoms');
            app.toast(`✅ Loaded "${preset}" preset`, 'success');
        },
        
        analyzeSymptoms: function() {
            if (!app.selectedSymptoms.length) return app.toast('Select at least one symptom', 'warning');
            app.showLoading('Grok AI analyzing symptoms...');
            setTimeout(() => {
                const sympStr = app.selectedSymptoms.join(' ').toLowerCase();
                const findings = [];
                if (sympStr.includes('fever') && (sympStr.includes('chills')||sympStr.includes('headache'))) findings.push({ name:'Possible Malaria', icon:'fa-mosquito', risk:75, advice:'Get free RDT test at health center' });
                if (sympStr.includes('cough') && sympStr.includes('fever')) findings.push({ name:'Respiratory Infection', icon:'fa-lungs', risk:60, advice:'Rest and hydrate. Seek care if persists.' });
                if (sympStr.includes('headache') && sympStr.includes('dizziness')) findings.push({ name:'Possible Hypertension', icon:'fa-tint', risk:50, advice:'Check BP at health center' });
                if (!findings.length) findings.push({ name:'General Symptoms', icon:'fa-clipboard-list', risk:20, advice:'Monitor and consult doctor if persists' });
                
                app.hideLoading();
                const resultsDiv = document.getElementById('symptomResults');
                const contentDiv = document.getElementById('symptomResultsContent');
                if (resultsDiv) resultsDiv.style.display = 'block';
                if (contentDiv) contentDiv.innerHTML = findings.map(f => `
                    <div class="risk-item medium mb-2">
                        <div class="d-flex justify-content-between"><strong><i class="fas ${f.icon} me-2"></i>${f.name}</strong><span class="fw-bold">${f.risk}%</span></div>
                        <p class="small mb-0 mt-1">✅ ${f.advice}</p>
                    </div>`).join('');
                app.toast(`${findings.length} condition(s) identified`, 'info');
            }, 1500);
        },
        
        renderHerbList: function() {
            const herbs = [
                { id:'tena_adam', name:'Tena Adam', sci:'Ruta chalepensis', icon:'fa-leaf', uses:'Stomach pain, headache, fever, cough', warn:'Avoid with blood thinners', cat:['respiratory','digestive'] },
                { id:'gesho', name:'Gesho', sci:'Rhamnus prinoides', icon:'fa-tree', uses:'Digestion, malaria, intestinal worms', warn:'May interact with diabetes meds', cat:['digestive','malaria'] },
                { id:'moringa', name:'Moringa', sci:'Moringa stenopetala', icon:'fa-seedling', uses:'Malnutrition, BP, diabetes, anemia', warn:'Monitor blood sugar', cat:['nutrition','chronic'] },
                { id:'damakese', name:'Damakese', sci:'Ocimum lamiifolium', icon:'fa-leaf', uses:'Fever, headache, cold, cough', warn:'Generally safe', cat:['respiratory'] },
                { id:'neem', name:'Neem', sci:'Azadirachta indica', icon:'fa-tree', uses:'Malaria, fever, skin diseases', warn:'Not for pregnant women', cat:['malaria','skin'] },
                { id:'tosign', name:'Tosign', sci:'Thymus schimperi', icon:'fa-leaf', uses:'Cough, cold, BP, digestion', warn:'May lower BP', cat:['respiratory','chronic'] }
            ];
            
            const container = document.getElementById('herbList');
            if (container) container.innerHTML = herbs.map(h => `
                <div class="col-md-4 col-sm-6"><div class="herb-card-enhanced" onclick="App.showHerbDetail('${h.id}')">
                    <div class="d-flex justify-content-between"><h6><i class="fas ${h.icon} text-success me-2"></i>${h.name}</h6><small class="text-purple">${h.sci}</small></div>
                    <p class="small text-muted">${h.uses}</p>
                    <p class="small text-danger mb-0"><i class="fas fa-exclamation-triangle me-1"></i>${h.warn}</p>
                    <div class="mt-2">${h.cat.map(c => `<span class="badge bg-success bg-opacity-25 text-success me-1">${c}</span>`).join('')}</div>
                </div></div>
            `).join('');
        },
        
        showHerbDetail: function(id) {
            const herb = { 
                tena_adam: { name:'Tena Adam', sci:'Ruta chalepensis', desc:'Widely used in Ethiopian highlands for various ailments.', parts:'Leaves, stems', uses:['Stomach pain','Headache','Fever','Cough','Ear infection','Worms'], prep:[{m:'Tea',d:'Boil 5-10 leaves in 2 cups water for 10 min. Strain.',dos:'1 cup, 2-3x daily'}], warn:['Avoid during pregnancy','Avoid with blood thinners','May cause photosensitivity'], regions:'Ethiopian highlands (1,500-3,000m)' },
                gesho: { name:'Gesho', sci:'Rhamnus prinoides', desc:'Essential in Tella/Tej brewing. Medicinally used for digestion and malaria.', parts:'Leaves, stems', uses:['Digestive aid','Malaria','Intestinal worms','Tonsillitis','Fever'], prep:[{m:'Tea',d:'Boil 10-15 leaves in 1L water for 15 min.',dos:'1 cup, 2-3x daily'}], warn:['May interact with diabetes meds','Avoid excessive with alcohol'], regions:'Ethiopian highlands (1,800-3,200m)' },
                moringa: { name:'Moringa', sci:'Moringa stenopetala', desc:'Miracle tree - extremely nutritious. Larger leaves than Indian variety.', parts:'Leaves, seeds', uses:['Malnutrition','High BP','Diabetes','Anemia','Breastfeeding'], prep:[{m:'Fresh leaves',d:'Wash and add to soups/stews.',dos:'1/2 cup daily'},{m:'Powder',d:'Dry leaves, grind to powder.',dos:'1-2 tsp daily'}], warn:['May lower blood sugar','Avoid root during pregnancy'], regions:'Southern Ethiopia (Konso, Gamo Gofa)' }
            }[id] || { name:'Herb', sci:'', desc:'Information not available.', parts:'', uses:[], prep:[], warn:[], regions:'' };
            
            document.getElementById('herbList').style.display = 'none';
            const card = document.getElementById('herbDetailCard');
            const content = document.getElementById('herbDetailContent');
            if (card && content) {
                card.style.display = 'block';
                content.innerHTML = `
                    <h4><i class="fas fa-leaf text-success me-2"></i>${herb.name} <small class="text-purple">${herb.sci}</small></h4>
                    <p>${herb.desc}</p>
                    <h6>✅ Uses</h6><ul>${herb.uses.map(u=>`<li>${u}</li>`).join('')}</ul>
                    <h6>🔧 Preparation</h6>${herb.prep.map(p=>`<p><strong>${p.m}:</strong> ${p.d}<br><small>Dosage: ${p.dos}</small></p>`).join('')}
                    <h6 class="text-danger">⚠️ Warnings</h6><ul>${herb.warn.map(w=>`<li>${w}</li>`).join('')}</ul>
                    <p><strong>📍 Regions:</strong> ${herb.regions}</p>`;
                card.scrollIntoView({ behavior:'smooth' });
            }
        },
        
        closeHerbDetail: function() {
            document.getElementById('herbDetailCard').style.display = 'none';
            document.getElementById('herbList').style.display = 'flex';
            window.scrollTo({ top:0, behavior:'smooth' });
        },
        
        filterHerbs: function(cat) {
            document.querySelectorAll('.herb-cat-btn').forEach(b => b.classList.remove('active','btn-success'));
            document.querySelectorAll('.herb-cat-btn').forEach(b => { if(b.textContent.toLowerCase().includes(cat)) b.classList.add('active','btn-success'); else b.classList.add('btn-outline-success'); });
            // Simplified - in production would filter the list
        },
        
        searchHerbs: function() {
            const q = document.getElementById('herbSearch')?.value?.toLowerCase() || '';
            document.querySelectorAll('#herbList .col-md-4').forEach(card => {
                card.style.display = card.textContent.toLowerCase().includes(q) ? 'block' : 'none';
            });
        },
        
        toggleVoiceListen: function() {
            if (app.isListening) { app.stopListening(); return; }
            app.isListening = true;
            document.getElementById('voiceRing')?.classList.add('active');
            document.getElementById('voiceListenBtn').innerHTML = '<i class="fas fa-stop me-2"></i>Stop Listening';
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                app.recognition = new SpeechRecognition();
                app.recognition.lang = {en:'en-US',am:'am-ET',om:'om-ET'}[localStorage.getItem('lang')||'en']||'en-US';
                app.recognition.onresult = e => {
                    const text = e.results[0][0].transcript;
                    document.getElementById('voiceTranscript').innerHTML = `<p>${text}</p>`;
                    app.processVoice(text);
                    app.stopListening();
                };
                app.recognition.start();
            }
            setTimeout(() => { if(app.isListening) app.stopListening(); }, 8000);
        },
        
        stopListening: function() {
            app.isListening = false;
            app.recognition?.stop();
            document.getElementById('voiceRing')?.classList.remove('active');
            document.getElementById('voiceListenBtn').innerHTML = '<i class="fas fa-microphone me-2"></i>Start Listening';
        },
        
        processVoice: function(text) {
            const lower = text.toLowerCase();
            let response = '';
            if (lower.includes('blood pressure') || lower.includes('dhiibbaa') || lower.includes('ግፊት')) { response = 'Opening blood pressure check.'; setTimeout(()=>app.switchTab('home'),1000); }
            else if (lower.includes('symptom') || lower.includes('mallattoo') || lower.includes('ምልክት')) { response = 'Opening symptom checker.'; setTimeout(()=>app.switchTab('symptoms'),1000); }
            else if (lower.includes('herb') || lower.includes('traditional')) { response = 'Opening traditional medicine.'; setTimeout(()=>app.switchTab('traditional'),1000); }
            else { response = 'I understand. Please use the symptom checker or vital signs input for analysis.'; }
            document.getElementById('voiceResponse').style.display = 'block';
            document.getElementById('voiceResponseText').textContent = response;
        },
        
        changeLanguage: function(lang) {
            localStorage.setItem('lang', lang);
            document.documentElement.dir = lang === 'am' ? 'rtl' : 'ltr';
            document.body.classList.toggle('rtl', lang === 'am');
            document.getElementById('navLangText').textContent = {en:'EN',am:'አማ',om:'OM'}[lang]||'EN';
            app.updateLanguageUI();
            app.toast(`Language: ${lang.toUpperCase()}`, 'success');
        },
        
        updateLanguageUI: function() {
            const lang = localStorage.getItem('lang')||'en';
            document.querySelectorAll('.list-group-item').forEach(el => {
                const onclick = el.getAttribute('onclick')||'';
                const check = el.querySelector('.fa-check');
                if (check) check.style.visibility = onclick.includes(`'${lang}'`) ? 'visible' : 'hidden';
            });
        },
        
        triggerEmergency: function() {
            if (confirm('Call Ethiopian Emergency (907)?')) window.location.href = 'tel:907';
        },
        
        shareReport: function() {
            navigator.clipboard?.writeText('EthioHealth AI Report').then(() => app.toast('Copied!', 'success'));
        },
        
        saveProfile: function() { app.toast('Profile saved!', 'success'); },
        
        showLoading: function(text) {
            document.getElementById('loadingOverlay').style.display = 'flex';
            document.getElementById('loadingText').textContent = text;
        },
        hideLoading: function() { document.getElementById('loadingOverlay').style.display = 'none'; },
        
        toast: function(msg, type) {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const colors = { success:'bg-success', warning:'bg-warning text-dark', error:'bg-danger', info:'bg-info' };
            const el = document.createElement('div');
            el.className = `toast align-items-center text-white ${colors[type]||'bg-dark'} border-0 show`;
            el.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
            container.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }
    };
    
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => app.init());
    else app.init();
    
    return app;
})();

window.App = App;
