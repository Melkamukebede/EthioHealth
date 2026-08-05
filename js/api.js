// ============================================
// ETHIOHEALTH AI PRO - API SERVICE
// ============================================

const API = (function() {
    'use strict';
    
    // Change this to your Render.com URL after deployment
const BASE_URL = 'https://ethiohealth-api.onrender.com/api/v1';

    const TIMEOUT = 10000;
    
    /**
     * Make API request
     */
    async function request(endpoint, options = {}) {
        const { method = 'GET', body } = options;
        const url = `${BASE_URL}${endpoint}`;
        
        console.log(`🌐 ${method} ${url}`);
        
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
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ ${method} ${endpoint} - Success`);
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                console.warn('⏰ Request timeout');
                return { success: false, offline: true, message: 'Request timeout' };
            }
            
            console.warn('📡 API unavailable:', error.message);
            return { success: false, offline: true, message: 'Using offline mode' };
        }
    }
    
    /**
     * Analyze health data
     */
    async function analyzeHealth(vitals) {
        return await request('/health/analyze', {
            method: 'POST',
            body: vitals
        });
    }
    
    /**
     * Get all herbs
     */
    async function getHerbs(category) {
        let endpoint = '/herbs';
        if (category && category !== 'all') {
            endpoint += `?category=${category}`;
        }
        return await request(endpoint);
    }
    
    /**
     * Search herbs
     */
    async function searchHerbs(query) {
        return await request(`/herbs/search?q=${encodeURIComponent(query)}`);
    }
    
    /**
     * Get herb by ID
     */
    async function getHerbById(id) {
        return await request(`/herbs/${id}`);
    }
    
    /**
     * Process voice command
     */
    async function processVoice(transcript, language) {
        return await request('/voice/process', {
            method: 'POST',
            body: { transcript, language }
        });
    }
    
    /**
     * Check if server is reachable
     */
    async function healthCheck() {
        try {
            const response = await fetch(`${BASE_URL.replace('/v1', '')}/health`);
            const data = await response.json();
            return data.success;
        } catch {
            return false;
        }
    }
    
    console.log('✅ API Service loaded (Backend: ' + BASE_URL + ')');
    
    return {
        analyzeHealth,
        getHerbs,
        searchHerbs,
        getHerbById,
        processVoice,
        healthCheck,
        BASE_URL
    };
})();
