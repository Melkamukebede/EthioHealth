// ============================================
// ETHIOHEALTH AI PRO - DATABASE
// ============================================

const DB = (function() {
    'use strict';
    
    let db = null;
    
    /**
     * Initialize database
     */
    function init() {
        if (typeof Dexie === 'undefined') {
            Utils.error('Dexie.js not loaded');
            return false;
        }
        
        db = new Dexie('EthioHealthDB');
        
        db.version(3).stores({
            analyses: '++id, timestamp, score, systolic, diastolic, glucose',
            symptoms: '++id, timestamp, symptoms, results',
            herbs: 'id, name, category',
            voiceHistory: '++id, timestamp, command, language',
            settings: 'key',
            profile: 'id',
            reports: '++id, timestamp, data',
            trends: '++id, timestamp, type, value'
        });
        
        Utils.log('Database initialized');
        return true;
    }
    
    /**
     * Save health analysis
     */
    async function saveAnalysis(data) {
        if (!db) return null;
        try {
            return await db.analyses.add({
                timestamp: Date.now(),
                score: data.score || 0,
                systolic: data.systolic || 0,
                diastolic: data.diastolic || 0,
                glucose: data.glucose || 0,
                bmi: data.bmi || 0,
                temperature: data.temperature || 0,
                age: data.age || 0,
                findings: JSON.stringify(data.findings || [])
            });
        } catch (err) {
            Utils.error('Save analysis failed:', err);
            return null;
        }
    }
    
    /**
     * Get recent analyses
     */
    async function getRecentAnalyses(limit = 10) {
        if (!db) return [];
        try {
            return await db.analyses.orderBy('timestamp').reverse().limit(limit).toArray();
        } catch (err) {
            Utils.error('Get analyses failed:', err);
            return [];
        }
    }
    
    /**
     * Save symptom check
     */
    async function saveSymptomCheck(data) {
        if (!db) return null;
        try {
            return await db.symptoms.add({
                timestamp: Date.now(),
                symptoms: JSON.stringify(data.symptoms || []),
                duration: data.duration || '',
                severity: data.severity || 0,
                notes: data.notes || '',
                results: JSON.stringify(data.results || [])
            });
        } catch (err) {
            Utils.error('Save symptoms failed:', err);
            return null;
        }
    }
    
    /**
     * Save voice command
     */
    async function saveVoiceCommand(command, response, language) {
        if (!db) return null;
        try {
            return await db.voiceHistory.add({
                timestamp: Date.now(),
                command: command,
                response: response,
                language: language || 'en'
            });
        } catch (err) {
            Utils.error('Save voice failed:', err);
            return null;
        }
    }
    
    /**
     * Get voice history
     */
    async function getVoiceHistory(limit = 20) {
        if (!db) return [];
        try {
            return await db.voiceHistory.orderBy('timestamp').reverse().limit(limit).toArray();
        } catch (err) {
            return [];
        }
    }
    
    /**
     * Save setting
     */
    async function saveSetting(key, value) {
        if (!db) {
            Utils.store.set(key, value);
            return;
        }
        try {
            await db.settings.put({ key, value, updatedAt: Date.now() });
        } catch {
            Utils.store.set(key, value);
        }
    }
    
    /**
     * Get setting
     */
    async function getSetting(key, fallback = null) {
        if (!db) return Utils.store.get(key, fallback);
        try {
            const setting = await db.settings.get(key);
            return setting ? setting.value : fallback;
        } catch {
            return Utils.store.get(key, fallback);
        }
    }
    
    /**
     * Save health trend
     */
    async function saveTrend(type, value) {
        if (!db) return;
        try {
            await db.trends.add({ timestamp: Date.now(), type, value });
        } catch { /* ignore */ }
    }
    
    /**
     * Get health trends
     */
    async function getTrends(type, hours = 24) {
        if (!db) return [];
        try {
            const since = Date.now() - (hours * 3600000);
            return await db.trends
                .where('type').equals(type)
                .and(item => item.timestamp > since)
                .sortBy('timestamp');
        } catch {
            return [];
        }
    }
    
    /**
     * Save user profile
     */
    async function saveProfile(profile) {
        if (!db) {
            Utils.store.set(CONFIG.STORAGE.PROFILE, profile);
            return;
        }
        try {
            await db.profile.put({ id: 1, ...profile, updatedAt: Date.now() });
        } catch {
            Utils.store.set(CONFIG.STORAGE.PROFILE, profile);
        }
    }
    
    /**
     * Get user profile
     */
    async function getProfile() {
        if (!db) return Utils.store.get(CONFIG.STORAGE.PROFILE, {});
        try {
            return await db.profile.get(1) || {};
        } catch {
            return Utils.store.get(CONFIG.STORAGE.PROFILE, {});
        }
    }
    
    /**
     * Clear all data
     */
    async function clearAll() {
        if (!db) return;
        try {
            const tables = ['analyses', 'symptoms', 'voiceHistory', 'settings', 'trends', 'reports'];
            for (const table of tables) {
                if (db[table]) await db[table].clear();
            }
            Utils.log('Database cleared');
        } catch (err) {
            Utils.error('Clear failed:', err);
        }
    }
    
    // Initialize on load
    init();
    
    return {
        init,
        saveAnalysis,
        getRecentAnalyses,
        saveSymptomCheck,
        saveVoiceCommand,
        getVoiceHistory,
        saveSetting,
        getSetting,
        saveTrend,
        getTrends,
        saveProfile,
        getProfile,
        clearAll
    };
})();

console.log('✅ Database module loaded');
