// ============================================
// ETHIOHEALTH AI PRO - MAIN CONTROLLER (THIN)
// ============================================

const App = (function() {
    'use strict';
    
    // Core state
    let currentTab = 'home';
    let selectedSymptoms = [];
    let latestAnalysis = null;
    let healthChart = null;
    
    /**
     * Initialize application
     */
    function init() {
        Utils.log('Initializing EthioHealth AI Pro...');
        
        // Setup modules
        Symptoms.setupBodyMap();
        setupTabNavigation();
        setupSeveritySlider();
        Herbs.render();
        
        // Restore state
        restoreState();
        
        // Online/Offline handlers
        window.addEventListener('online', () => Utils.toast('Back online', 'success'));
        window.addEventListener('offline', () => Utils.toast('Offline mode - using local data', 'warning'));
        
        Utils.log('✅ Ready');
    }
    
    /**
     * Setup tab navigation
     */
    function setupTabNavigation() {
        document.querySelectorAll('[data-tab]').forEach(el => {
            el.addEventListener('click', function() {
                const tab = this.dataset.tab;
                if (tab) switchTab(tab);
            });
        });
    }
    
    /**
     * Switch active tab
     */
    function switchTab(tab) {
        currentTab = tab;
        
        // Update nav links
        document.querySelectorAll('[data-tab]').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === tab);
        });
        
        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        const panel = document.getElementById('tab-' + tab);
        if (panel) panel.style.display = 'block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Tab-specific refresh
        if (tab === 'traditional') Herbs.render();
        if (tab === 'report') Report.render();
    }
    
    /**
     * Setup severity slider
     */
    function setupSeveritySlider() {
        const slider = Utils.getEl('severitySlider');
        if (slider) {
            slider.addEventListener('input', function() {
                const valEl = Utils.getEl('severityValue');
                if (valEl) valEl.textContent = this.value;
            });
        }
    }
    
    /**
     * Symptom management
     */
    function getSelectedSymptoms() { return [...selectedSymptoms]; }
    function setSelectedSymptoms(symptoms) { selectedSymptoms = [...symptoms]; }
    
    function toggleSymptom(symptom) {
        const idx = selectedSymptoms.indexOf(symptom);
        idx > -1 ? selectedSymptoms.splice(idx, 1) : selectedSymptoms.push(symptom);
        
        // Update UI
        document.querySelectorAll('.symptom-tag').forEach(tag => {
            const onclick = tag.getAttribute('onclick') || '';
            if (onclick.includes(`'${symptom}'`)) {
                tag.classList.toggle('selected', selectedSymptoms.includes(symptom));
            }
        });
        
        Symptoms.updateSelectedDisplay();
    }
    
    /**
     * Update health score display
     */
    function updateHealthScore(score) {
        const el = Utils.getEl('healthScore');
        if (el) {
            el.textContent = score;
            el.style.color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
        }
    }
    
    /**
     * Render risk results
     */
    function renderRiskResults(results) {
        const container = Utils.getEl('riskResults');
        if (!container) return;
        
        if (!results?.findings?.length) {
            container.innerHTML = '<div class="text-center text-muted py-4"><i class="fas fa-check-circle text-success fs-1 d-block mb-2"></i><p>No significant risks detected</p></div>';
            return;
        }
        
        container.innerHTML = results.findings.map(f => `
            <div class="risk-item ${f.level}">
                <div class="d-flex justify-content-between align-items-center">
                    <strong><i class="fas ${f.icon} me-2" style="color:${f.color}"></i>${f.name}</strong>
                    <span class="fw-bold" style="color:${f.level==='high'?'#ef4444':f.level==='medium'?'#f59e0b':'#10b981'}">${f.risk}%</span>
                </div>
                <div class="risk-bar"><div class="risk-bar-fill ${f.level}" style="width:${f.risk}%"></div></div>
                ${f.treatment ? `
                    <div class="mt-2 small">
                        <span class="badge bg-primary me-1"><i class="fas fa-pills me-1"></i>Modern</span>
                        ${f.treatment.modern?.slice(0,3).join(', ')}
                    </div>
                    ${f.treatment.traditional?.length ? `
                    <div class="mt-1 small">
                        <span class="badge bg-success me-1"><i class="fas fa-leaf me-1"></i>Traditional</span>
                        ${f.treatment.traditional.join(', ')}
                    </div>` : ''}
                ` : ''}
                ${f.emergency ? '<span class="badge bg-danger mt-1"><i class="fas fa-ambulance me-1"></i>Seek Medical Attention</span>' : ''}
            </div>
        `).join('');
    }
    
    /**
     * Update health trend chart
     */
    function updateChart(results) {
        const canvas = Utils.getEl('healthTrendChart');
        if (!canvas || !results?.findings?.length) return;
        
        const ctx = canvas.getContext('2d');
        if (healthChart) healthChart.destroy();
        
        const data = results.findings.slice(0, 5);
        
        healthChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(f => f.name),
                datasets: [{
                    data: data.map(f => f.risk),
                    backgroundColor: data.map(f => f.level === 'high' ? '#ef4444' : f.level === 'medium' ? '#f59e0b' : '#10b981'),
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }
    
    /**
     * Voice functions (delegated)
     */
    function toggleVoiceListen() {
        Voice.toggle();
    }
    
    /**
     * Emergency function
     */
    function triggerEmergency() {
        if (confirm('Call Ethiopian Emergency (907)?')) {
            window.location.href = 'tel:907';
        }
    }
    
    /**
     * Language functions
     */
    function changeLanguage(lang) {
        Utils.setLanguage(lang);
        document.documentElement.dir = lang === 'am' ? 'rtl' : 'ltr';
        document.body.classList.toggle('rtl', lang === 'am');
        
        const langNames = { en: 'EN', am: 'አማ', om: 'OM' };
        const navEl = Utils.getEl('navLangText');
        if (navEl) navEl.textContent = langNames[lang] || 'EN';
        
        Utils.toast(`Language: ${lang.toUpperCase()}`, 'success');
    }
    
    /**
     * Share report
     */
    function shareReport() {
        Utils.shareContent('EthioHealth AI Report', 'Health analysis generated by Grok AI');
    }
    
    /**
     * Save profile
     */
    function saveProfile() {
        const profile = {
            name: Utils.getEl('profileName')?.value || '',
            age: Utils.getVal('profileAge', 30),
            location: Utils.getEl('profileLocation')?.value || ''
        };
        DB.saveProfile(profile);
        Utils.toast('✅ Profile saved!', 'success');
    }
    
    /**
     * Restore previous state
     */
    function restoreState() {
        const lang = Utils.getLanguage();
        document.documentElement.dir = lang === 'am' ? 'rtl' : 'ltr';
    }
    
    console.log('✅ App controller loaded');
    
    // Public API
    return {
        init,
        switchTab,
        getSelectedSymptoms,
        setSelectedSymptoms,
        toggleSymptom,
        updateHealthScore,
        renderRiskResults,
        updateChart,
        toggleVoiceListen,
        triggerEmergency,
        changeLanguage,
        shareReport,
        saveProfile,
        runAnalysis: Analysis.runAnalysis,
        analyzeSymptoms: Symptoms.analyzeSymptoms,
        loadPreset: Symptoms.loadPreset,
        changeHolisticTab: Symptoms.changeHolisticTab,
        showBodyPartSymptoms: Symptoms.showBodyPartSymptoms,
        filterHerbs: Herbs.filter,
        searchHerbs: Herbs.search,
        showHerbDetail: Herbs.showDetail,
        closeHerbDetail: Herbs.closeDetail
    };
})();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}
