async function runAnalysis() {
    const input = {
        systolic: Utils.getVal('inputSystolic', 120),
        diastolic: Utils.getVal('inputDiastolic', 80),
        glucose: Utils.getVal('inputGlucose', 95),
        bmi: Utils.getVal('inputBMI', 24),
        temperature: Utils.getVal('inputTemp', 36.6),
        age: Utils.getVal('inputAge', 30)
    };
    
    Utils.showLoading('🤖 Grok AI analyzing...');
    
    let results = null;
    
    // Try API first
    try {
        const response = await API.analyzeHealth(input);
        if (response && response.success && response.data) {
            results = response.data;
        }
    } catch (e) {
        console.warn('API call failed, using local');
    }
    
    // FALLBACK: Always run local if API fails
    if (!results) {
        console.log('📱 Using local analysis');
        results = analyzeLocally(input);
    }
    
    // ALWAYS hide loading and show results
    Utils.hideLoading();
    App.updateHealthScore(results.score);
    App.renderRiskResults(results);
}
