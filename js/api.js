// ============================================
// ETHIOHEALTH AI PRO - API SERVICE
// ============================================

const API = (function() {
    'use strict';
    
    const BASE_URL = 'https://ethiohealth-api.onrender.com/api/v1';
    const TIMEOUT = 15000; // 15 seconds for cold start
    
    async function request(endpoint, options = {}) {
        const { method = 'GET', body } = options;
        const url = `${BASE_URL}${endpoint}`;
        
        console.log('🌐 Calling:', url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
        
        try {
            const config = {
                method,
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            };
            
            if (body && method !== 'GET') {
                config.body = JSON.stringify(body);
            }
            
            const response = await fetch(url, config);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            const data = await response.json();
            console.log('✅ API Response:', data);
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn('⚠️ API failed, using local analysis:', error.message);
            return { success: false, offline: true };
        }
    }
    
    async function analyzeHealth(vitals) {
        return await request('/health/analyze', { method: 'POST', body: vitals });
    }
    
    async function getHerbs() {
        return await request('/herbs');
    }
    
    async function processVoice(transcript, language) {
        return await request('/voice/process', { 
            method: 'POST', 
            body: { transcript, language } 
        });
    }
    
    return {
        analyzeHealth,
        getHerbs,
        processVoice,
        BASE_URL
    };
})();
