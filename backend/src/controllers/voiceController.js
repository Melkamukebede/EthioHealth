exports.processVoice = (req, res) => {
    const { transcript, language } = req.body;

    if (!transcript) {
        return res.status(400).json({
            success: false,
            message: 'Transcript is required'
        });
    }

    const lower = transcript.toLowerCase();
    let response = '';
    let action = null;

    // Detect intent
    if (lower.includes('pressure') || lower.includes('bp') || lower.includes('dhiibbaa') || lower.includes('ግፊት')) {
        response = getLocalizedResponse('bp', language);
        action = 'navigate_home';
    } else if (lower.includes('symptom') || lower.includes('pain') || lower.includes('mallattoo') || lower.includes('ምልክት')) {
        response = getLocalizedResponse('symptoms', language);
        action = 'navigate_symptoms';
    } else if (lower.includes('herb') || lower.includes('traditional') || lower.includes('aadaa') || lower.includes('ባህላዊ')) {
        response = getLocalizedResponse('herbs', language);
        action = 'navigate_herbs';
    } else if (lower.includes('emergency') || lower.includes('help') || lower.includes('tasgabbii') || lower.includes('አደጋ')) {
        response = getLocalizedResponse('emergency', language);
        action = 'call_emergency';
    } else {
        response = getLocalizedResponse('unknown', language);
    }

    res.json({
        success: true,
        data: {
            transcript,
            response,
            action,
            language: language || 'en',
            timestamp: new Date().toISOString()
        }
    });
};

function getLocalizedResponse(type, lang) {
    const responses = {
        bp: {
            en: 'Opening blood pressure check. Please enter your readings.',
            am: 'የደም ግፊት ምርመራ በመክፈት ላይ። እባክዎ ንባቦችዎን ያስገቡ።',
            om: 'Qormaata dhiibbaa dhiigaa banaa jira. Maaloo galtee kee galchi.'
        },
        symptoms: {
            en: 'Opening symptom checker. Select your symptoms.',
            am: 'የምልክት ማረጋገጫ በመክፈት ላይ። ምልክቶችዎን ይምረጡ።',
            om: 'Mallattoolee ilaaluu banaa jira. Mallattoolee kee filadhu.'
        },
        herbs: {
            en: 'Opening Ethiopian traditional medicine database.',
            am: 'የኢትዮጵያ ባህላዊ ሕክምና ዳታቤዝ በመክፈት ላይ።',
            om: 'Qoricha aadaa Itoophiyaa banaa jira.'
        },
        emergency: {
            en: 'EMERGENCY: Calling Ethiopian emergency services (907).',
            am: 'አደጋ፡ የኢትዮጵያ የአደጋ ጊዜ አገልግሎት (907) በመደወል ላይ።',
            om: 'TASGABBII: Tajaajila tasgabbii Itoophiyaa (907) bilbilaa jira.'
        },
        unknown: {
            en: 'I understand. Please try saying "check blood pressure", "I have symptoms", or "traditional herbs".',
            am: 'ገብቶኛል። እባክዎ "የደም ግፊት አረጋግጥ"፣ "ምልክቶች አሉኝ" ወይም "ባህላዊ እፅዋት" ብለው ይሞክሩ።',
            om: 'Nan hubadha. "Dhiibbaa dhiigaa ilaali", "Mallattoolee qaba", ykn "Margoota aadaa" jedhi yaali.'
        }
    };

    return responses[type]?.[lang || 'en'] || responses[type]?.en || 'Processing...';
}
