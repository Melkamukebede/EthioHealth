const API = {
    BASE_URL: 'http://localhost:10000/api/v1',
    
    async analyzeHealth(vitals) {
        const response = await fetch(`${this.BASE_URL}/health/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vitals)
        });
        return response.json();
    },
    
    async getHerbs() {
        const response = await fetch(`${this.BASE_URL}/herbs`);
        return response.json();
    },
    
    async processVoice(transcript, language) {
        const response = await fetch(`${this.BASE_URL}/voice/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript, language })
        });
        return response.json();
    }
};
