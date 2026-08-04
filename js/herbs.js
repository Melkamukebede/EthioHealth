// Add this at the top of the render function in herbs.js

async function render() {
    const container = Utils.getEl('herbList');
    if (!container) return;
    
    // Show loading
    container.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-success"></div>
            <p class="mt-2 text-muted">Loading herbs from server...</p>
        </div>
    `;
    
    let herbs = [];
    
    // Try API first
    try {
        const response = await API.getHerbs(currentFilter);
        if (response.success && response.data.length > 0) {
            herbs = response.data;
            console.log('✅ Loaded herbs from server');
        }
    } catch (error) {
        console.warn('⚠️ Using local herb database');
    }
    
    // Fallback to local
    if (herbs.length === 0) {
        herbs = currentFilter === 'all' ? 
            localHerbs : 
            localHerbs.filter(h => h.cat && h.cat.includes(currentFilter));
        console.log('📱 Using local herb database');
    }
    
    // Render herbs...
    // (rest of your render code)
}
