// ============================================
// ETHIOHEALTH AI PRO - MAIN CONTROLLER
// ============================================

const App = (function() {
    'use strict';
    
    function init() {
        console.log('🧬 EthioHealth AI Pro Ready');
    }
    
    function switchTab(tab) {
        document.querySelectorAll('.tab-content').forEach(function(c) {
            c.style.display = 'none';
        });
        var panel = document.getElementById('tab-' + tab);
        if (panel) panel.style.display = 'block';
        
        document.querySelectorAll('[data-tab]').forEach(function(b) {
            b.classList.remove('active');
            if (b.getAttribute('data-tab') === tab) b.classList.add('active');
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function runAnalysis() {
        console.log('🔬 runAnalysis called');
        
        var systolic = parseFloat(document.getElementById('inputSystolic').value) || 120;
        var diastolic = parseFloat(document.getElementById('inputDiastolic').value) || 80;
        var glucose = parseFloat(document.getElementById('inputGlucose').value) || 95;
        var bmi = parseFloat(document.getElementById('inputBMI').value) || 24;
        var temperature = parseFloat(document.getElementById('inputTemp').value) || 36.6;
        var age = parseFloat(document.getElementById('inputAge').value) || 30;
        
        console.log('Input:', { systolic, diastolic, glucose, bmi, temperature, age });
        
        // Show loading
        var overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = 'flex';
        
        // Do analysis after short delay
        setTimeout(function() {
            var findings = [];
            var penaltyScore = 0;
            
            // Hypertension
            var hyperRisk = 0;
            if (systolic >= 180) hyperRisk = 60;
            else if (systolic >= 160) hyperRisk = 45;
            else if (systolic >= 140) hyperRisk = 30;
            else if (systolic >= 130) hyperRisk = 15;
            else if (systolic >= 120) hyperRisk = 5;
            if (diastolic >= 90) hyperRisk += 20;
            if (age >= 40) hyperRisk += 10;
            if (bmi >= 30) hyperRisk += 10;
            hyperRisk = Math.min(100, hyperRisk);
            
            if (hyperRisk > 0) {
                var level = hyperRisk >= 50 ? 'high' : hyperRisk >= 25 ? 'medium' : 'low';
                penaltyScore += level === 'high' ? 30 : level === 'medium' ? 15 : 5;
                findings.push({
                    name: 'Hypertension',
                    icon: 'fa-tint',
                    color: '#ef4444',
                    risk: hyperRisk,
                    level: level,
                    treatment: {
                        modern: ['Enalapril', 'Amlodipine'],
                        traditional: ['Moringa', 'Tosign'],
                        lifestyle: ['Reduce salt', 'Walk 30 min daily']
                    }
                });
            }
            
            // Diabetes
            var diabetesRisk = 0;
            if (glucose >= 200) diabetesRisk = 50;
            else if (glucose >= 140) diabetesRisk = 35;
            else if (glucose >= 126) diabetesRisk = 20;
            else if (glucose >= 110) diabetesRisk = 10;
            if (bmi >= 30) diabetesRisk += 15;
            if (age >= 45) diabetesRisk += 10;
            diabetesRisk = Math.min(100, diabetesRisk);
            
            if (diabetesRisk > 0) {
                var level = diabetesRisk >= 50 ? 'high' : diabetesRisk >= 25 ? 'medium' : 'low';
                penaltyScore += level === 'high' ? 30 : level === 'medium' ? 15 : 5;
                findings.push({
                    name: 'Type 2 Diabetes',
                    icon: 'fa-candy-cane',
                    color: '#f59e0b',
                    risk: diabetesRisk,
                    level: level,
                    treatment: {
                        modern: ['Metformin'],
                        traditional: ['Moringa', 'Grawa'],
                        lifestyle: ['Exercise daily', 'Reduce sugar']
                    }
                });
            }
            
            // Malaria
            var malariaRisk = 0;
            if (temperature >= 39) malariaRisk = 50;
            else if (temperature >= 38) malariaRisk = 30;
            else if (temperature >= 37.5) malariaRisk = 10;
            var month = new Date().getMonth() + 1;
            if (month >= 6 && month <= 9) malariaRisk += 25;
            malariaRisk = Math.min(100, malariaRisk);
            
            if (malariaRisk >= 10) {
                var level = malariaRisk >= 50 ? 'high' : malariaRisk >= 25 ? 'medium' : 'low';
                penaltyScore += level === 'high' ? 25 : 10;
                findings.push({
                    name: 'Malaria Risk',
                    icon: 'fa-mosquito',
                    color: '#3b82f6',
                    risk: malariaRisk,
                    level: level,
                    treatment: {
                        modern: ['Coartem'],
                        traditional: ['Neem', 'Gesho'],
                        lifestyle: ['Use treated nets', 'Seek testing']
                    }
                });
            }
            
            var score = Math.max(0, Math.min(100, 100 - penaltyScore));
            
            // Hide loading FIRST
            if (overlay) overlay.style.display = 'none';
            
            // Update UI
            updateHealthScore(score);
            renderRiskResults({ findings: findings, score: score });
            
            console.log('✅ Analysis done. Score:', score);
            
        }, 1500);
    }
    
    function updateHealthScore(score) {
        var el = document.getElementById('healthScore');
        if (el) {
            el.textContent = score;
            el.style.color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
        }
    }
    
    function renderRiskResults(results) {
        var container = document.getElementById('riskResults');
        if (!container) return;
        
        if (!results || !results.findings || results.findings.length === 0) {
            container.innerHTML = '<p class="text-center text-muted py-3">✅ No significant risks detected</p>';
            return;
        }
        
        var html = '';
        results.findings.forEach(function(f) {
            html += '<div class="risk-item ' + f.level + ' mb-2">';
            html += '<div class="d-flex justify-content-between">';
            html += '<strong><i class="fas ' + f.icon + ' me-2"></i>' + f.name + '</strong>';
            html += '<span class="fw-bold">' + f.risk + '%</span>';
            html += '</div>';
            html += '<div class="risk-bar"><div class="risk-bar-fill ' + f.level + '" style="width:' + f.risk + '%"></div></div>';
            if (f.treatment) {
                html += '<div class="mt-2 small"><span class="badge bg-primary me-1">Modern</span>' + f.treatment.modern.join(', ') + '</div>';
            }
            html += '</div>';
        });
        
        container.innerHTML = html;
    }
    
    function getSelectedSymptoms() {
        return [];
    }
    
    function toggleSymptom(symptom) {
        console.log('Toggle symptom:', symptom);
    }
    
    function changeLanguage(lang) {
        localStorage.setItem('lang', lang);
        document.getElementById('navLangText').textContent = lang.toUpperCase();
    }
    
    function triggerEmergency() {
        if (confirm('Call Ethiopian Emergency (907)?')) {
            window.location.href = 'tel:907';
        }
    }
    
    function analyzeSymptoms() {
        alert('Symptom analysis: Please select symptoms first');
    }
    
    function loadPreset(name) {
        console.log('Load preset:', name);
    }
    
    function saveProfile() {
        alert('Profile saved!');
    }
    
    function shareReport() {
        alert('Report shared!');
    }
    
    function filterHerbs(cat) {
        console.log('Filter herbs:', cat);
    }
    
    function searchHerbs() {
        console.log('Search herbs');
    }
    
    function showHerbDetail(id) {
        console.log('Herb detail:', id);
    }
    
    function closeHerbDetail() {
        console.log('Close herb detail');
    }
    
    function toggleVoiceListen() {
        alert('Voice assistant: Speak now');
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
    
    return {
        init: init,
        switchTab: switchTab,
        runAnalysis: runAnalysis,
        updateHealthScore: updateHealthScore,
        renderRiskResults: renderRiskResults,
        getSelectedSymptoms: getSelectedSymptoms,
        toggleSymptom: toggleSymptom,
        changeLanguage: changeLanguage,
        triggerEmergency: triggerEmergency,
        analyzeSymptoms: analyzeSymptoms,
        loadPreset: loadPreset,
        saveProfile: saveProfile,
        shareReport: shareReport,
        filterHerbs: filterHerbs,
        searchHerbs: searchHerbs,
        showHerbDetail: showHerbDetail,
        closeHerbDetail: closeHerbDetail,
        toggleVoiceListen: toggleVoiceListen
    };
})();
