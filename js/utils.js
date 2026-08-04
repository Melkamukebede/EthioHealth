// ============================================
// ETHIOHEALTH AI PRO - UTILITY FUNCTIONS
// ============================================

const Utils = (function() {
    'use strict';
    
    const utils = {
        /**
         * Get DOM element safely
         */
        getEl: function(id) {
            const el = document.getElementById(id);
            if (!el) console.warn(`Element #${id} not found`);
            return el;
        },
        
        /**
         * Get input value safely with fallback
         */
        getVal: function(id, fallback = 0) {
            const el = utils.getEl(id);
            if (!el) return fallback;
            const val = parseFloat(el.value);
            return isNaN(val) ? fallback : val;
        },
        
        /**
         * Set input value
         */
        setVal: function(id, value) {
            const el = utils.getEl(id);
            if (el) el.value = value;
        },
        
        /**
         * Show toast notification
         */
        toast: function(message, type = 'info', duration = 3000) {
            const container = utils.getEl('toastContainer');
            if (!container) return;
            
            const bgMap = {
                success: 'bg-success text-white',
                warning: 'bg-warning text-dark',
                error: 'bg-danger text-white',
                info: 'bg-info text-white'
            };
            
            const bgClass = bgMap[type] || 'bg-dark text-white';
            const iconMap = {
                success: 'fa-check-circle',
                warning: 'fa-exclamation-triangle',
                error: 'fa-times-circle',
                info: 'fa-info-circle'
            };
            
            const el = document.createElement('div');
            el.className = `toast align-items-center ${bgClass} border-0 show mb-2`;
            el.setAttribute('role', 'alert');
            el.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas ${iconMap[type] || 'fa-info-circle'} me-2"></i>${message}
                    </div>
                    <button class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            `;
            container.appendChild(el);
            
            // Auto remove
            setTimeout(() => {
                el.classList.remove('show');
                setTimeout(() => el.remove(), 300);
            }, duration);
        },
        
        /**
         * Show loading overlay
         */
        showLoading: function(text = 'Loading...') {
            const overlay = utils.getEl('loadingOverlay');
            const textEl = utils.getEl('loadingText');
            if (overlay) overlay.style.display = 'flex';
            if (textEl) textEl.textContent = text;
        },
        
        /**
         * Hide loading overlay
         */
        hideLoading: function() {
            const overlay = utils.getEl('loadingOverlay');
            if (overlay) overlay.style.display = 'none';
        },
        
        /**
         * Format date
         */
        formatDate: function(timestamp, format = 'short') {
            const date = new Date(timestamp);
            const formats = {
                time: { hour: '2-digit', minute: '2-digit' },
                date: { year: 'numeric', month: 'short', day: 'numeric' },
                full: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
                short: { month: 'short', day: 'numeric' }
            };
            return date.toLocaleDateString(undefined, formats[format] || formats.short);
        },
        
        /**
         * Time ago string
         */
        timeAgo: function(timestamp) {
            const seconds = Math.floor((Date.now() - timestamp) / 1000);
            if (seconds < 60) return 'Just now';
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days}d ago`;
            return utils.formatDate(timestamp, 'date');
        },
        
        /**
         * Debounce function
         */
        debounce: function(func, wait = 300) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        /**
         * Generate unique ID
         */
        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        },
        
        /**
         * Check if online
         */
        isOnline: function() {
            return navigator.onLine;
        },
        
        /**
         * Get current language
         */
        getLanguage: function() {
            return localStorage.getItem(CONFIG.STORAGE.LANGUAGE) || 'en';
        },
        
        /**
         * Set language
         */
        setLanguage: function(lang) {
            localStorage.setItem(CONFIG.STORAGE.LANGUAGE, lang);
        },
        
        /**
         * Get language config
         */
        getLanguageConfig: function() {
            const lang = utils.getLanguage();
            return CONFIG.LANGUAGES[lang] || CONFIG.LANGUAGES.en;
        },
        
        /**
         * Vibrate device (if supported)
         */
        vibrate: function(pattern = 200) {
            if (navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        },
        
        /**
         * Copy to clipboard
         */
        copyToClipboard: async function(text) {
            try {
                await navigator.clipboard.writeText(text);
                utils.toast('Copied!', 'success');
                return true;
            } catch {
                utils.toast('Failed to copy', 'error');
                return false;
            }
        },
        
        /**
         * Share content
         */
        shareContent: async function(title, text) {
            if (navigator.share) {
                try {
                    await navigator.share({ title, text });
                    return true;
                } catch (err) {
                    if (err.name !== 'AbortError') console.error(err);
                    return false;
                }
            }
            return utils.copyToClipboard(text);
        },
        
        /**
         * Scroll to element
         */
        scrollTo: function(elementId, offset = 0) {
            const el = utils.getEl(elementId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (offset) window.scrollBy(0, offset);
            }
        },
        
        /**
         * Is mobile device
         */
        isMobile: function() {
            return window.innerWidth < 768;
        },
        
        /**
         * Safe JSON parse
         */
        safeJSON: function(str, fallback = null) {
            try { return JSON.parse(str); }
            catch { return fallback; }
        },
        
        /**
         * Local storage helpers
         */
        store: {
            set: function(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch { return false; }
            },
            get: function(key, fallback = null) {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : fallback;
                } catch { return fallback; }
            },
            remove: function(key) {
                localStorage.removeItem(key);
            }
        },
        
        /**
         * Log with prefix
         */
        log: function(...args) {
            console.log('[EthioHealth]', ...args);
        },
        
        error: function(...args) {
            console.error('[EthioHealth]', ...args);
        }
    };
    
    console.log('✅ Utils loaded');
    return utils;
})();
