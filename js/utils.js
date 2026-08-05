// ============================================
// ETHIOHEALTH AI PRO - UTILITY FUNCTIONS
// ============================================

const Utils = (function() {
    'use strict';
    
    const utils = {
        getEl: function(id) {
            return document.getElementById(id);
        },
        
        getVal: function(id, fallback) {
            const el = document.getElementById(id);
            if (!el) return fallback || 0;
            const val = parseFloat(el.value);
            return isNaN(val) ? (fallback || 0) : val;
        },
        
        toast: function(message, type) {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const el = document.createElement('div');
            el.className = 'alert alert-' + (type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info') + ' alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            el.style.zIndex = '9999';
            el.innerHTML = message + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
            container.appendChild(el);
            setTimeout(function() { el.remove(); }, 3000);
        },
        
        showLoading: function(text) {
            var overlay = document.getElementById('loadingOverlay');
            var textEl = document.getElementById('loadingText');
            if (overlay) overlay.style.display = 'flex';
            if (textEl) textEl.textContent = text || 'Loading...';
        },
        
        hideLoading: function() {
            var overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
    };
    
    console.log('✅ Utils loaded');
    return utils;
})();
