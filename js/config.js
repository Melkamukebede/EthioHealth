// ============================================
// ETHIOHEALTH AI PRO - CONFIGURATION
// ============================================

const CONFIG = {
    // App Info
    APP_NAME: 'EthioHealth AI Pro',
    APP_VERSION: '3.0.0',
    APP_DESCRIPTION: 'AI-powered Ethiopian health companion',
    
    // API Endpoints (for backend integration)
    API: {
        BASE_URL: 'https://ethiohealth-api.onrender.com/api/v1',
        ANALYZE: '/health/analyze',
        HERBS: '/herbs',
        VOICE: '/voice/process',
        REPORT: '/report/generate',
        TIMEOUT: 10000
    },
    
    // Ethiopian Emergency Numbers
    EMERGENCY: {
        AMBULANCE: '907',
        POLICE: '991',
        FIRE: '939',
        RED_CROSS: '011-552-72-22'
    },
    
    // Health Thresholds
    THRESHOLDS: {
        HYPERTENSION_SYSTOLIC: 130,
        HYPERTENSION_DIASTOLIC: 85,
        DIABETES_GLUCOSE: 126,
        MALARIA_TEMPERATURE: 38,
        OBESITY_BMI: 30,
        UNDERWEIGHT_BMI: 18.5
    },
    
    // Malaria Peak Season (Ethiopia)
    MALARIA_PEAK_MONTHS: [6, 7, 8, 9],
    
    // Language Support
    LANGUAGES: {
        en: { name: 'English', native: 'English', flag: '🇺🇸', dir: 'ltr', locale: 'en-US' },
        am: { name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹', dir: 'rtl', locale: 'am-ET' },
        om: { name: 'Oromo', native: 'Afaan Oromoo', flag: '🇪🇹', dir: 'ltr', locale: 'om-ET' }
    },
    
    // Storage Keys
    STORAGE: {
        LANGUAGE: 'ethiohealth_lang',
        PROFILE: 'ethiohealth_profile',
        ANALYSES: 'ethiohealth_analyses',
        SYMPTOMS: 'ethiohealth_symptoms',
        VOICE_HISTORY: 'ethiohealth_voice',
        SETTINGS: 'ethiohealth_settings'
    },
    
    // Cache Duration (milliseconds)
    CACHE: {
        ANALYSIS: 3600000,    // 1 hour
        HERBS: 86400000,      // 24 hours
        VOICE: 300000         // 5 minutes
    },
    
    // Feature Flags
    FEATURES: {
        VOICE_ENABLED: true,
        OFFLINE_MODE: true,
        GROK_AI: true,
        EMERGENCY_SOS: true,
        TRADITIONAL_MEDICINE: true
    }
};

// Freeze to prevent modification
Object.freeze(CONFIG);
console.log('✅ Config loaded');
