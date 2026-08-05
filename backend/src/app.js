const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// ============ DATA STORAGE ============
let analysisHistory = [];
let emergencyContacts = [];

// ============ HOME ROUTE ============
app.get('/', (req, res) => {
    res.json({
        success: true,
        name: 'EthioHealth AI API',
        version: '2.0.0',
        status: 'healthy',
        features: ['health-analysis', 'ai-chat', 'symptom-diagnosis', 'herb-interactions', 'traditional-medicine'],
        timestamp: new Date().toISOString()
    });
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ============================================
// FEATURE 1: AI HEALTH CHAT (GROK AI)
// ============================================
app.post('/api/v1/chat', (req, res) => {
    const { message, language } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            message: 'Message is required'
        });
    }

    const lower = message.toLowerCase().trim();
    let response = '';

    // ===== HEADACHE =====
    if (lower.includes('headache') || lower.includes('ራስ') || lower.includes('mataa')) {
        response = {
            en: '🩺 Headaches can be caused by stress, dehydration, high blood pressure, or altitude (common in Ethiopia).\n\n💧 TIPS:\n1. Drink 2-3 liters of water daily\n2. Check your blood pressure at a health center\n3. Rest in a quiet, dark room\n4. Avoid excessive coffee (even Ethiopian buna!)\n\n🌿 TRADITIONAL: Tena Adam tea or Damakese steam inhalation\n\n⚠️ See a doctor if: headache is severe, sudden, or with fever/stiff neck.',
            am: '🩺 ራስ ምታት በጭንቀት፣ በውሃ እጥረት፣ በደም ግፊት ወይም በከፍታ (በኢትዮጵያ የተለመደ) ሊከሰት ይችላል።\n\n💧 ምክሮች:\n1. በቀን 2-3 ሊትር ውሃ ይጠጡ\n2. የደም ግፊትዎን በጤና ጣቢያ ያረጋግጡ\n3. ጸጥ ባለ ጨለማ ክፍል ያርፉ\n\n🌿 ባህላዊ: ጤና አዳም ሻይ ወይም ዳማከሴ እንፋሎት\n\n⚠️ ከሆነ ሐኪም ያማክሩ: ከባድ፣ ድንገተኛ ወይም ከትኩሳት/የአንገት መቆጣት ጋር',
            om: '🩺 Mataa bowwuun dhiphina, dheebuu, dhiibbaa dhiigaa ykn olka\'iinsa (Itoophiyaa keessatti beekamaa) irraa dhufuu danda\'a.\n\n💧 GORSA:\n1. Guyyaatti liitira 2-3 bishaan dhugi\n2. Dhiibbaa dhiigaa kee buufata fayyaatti ilaali\n3. Kutaa callisaa fi dukkanaa\'aa keessatti boqodhu\n\n🌿 AADAA: Shaayii Tena Adam ykn hurka Damakese\n\n⚠️ Yoo ta\'e doktara ilaali: cimaa, tasa, ykn ho\'ina qaamaa/morma qabanaa\'aa wajjin'
        };
    }
    // ===== MALARIA =====
    else if (lower.includes('malaria') || lower.includes('ወባ') || lower.includes('busaa') || (lower.includes('fever') && lower.includes('chills'))) {
        response = {
            en: '🦟 MALARIA - Serious concern in Ethiopia (60% of population at risk)\n\n🔴 SYMPTOMS: Fever, chills, sweating, headache, muscle pain, fatigue, nausea\n\n✅ ACTION:\n1. Get FREE RDT test at any Ethiopian health center\n2. Treatment: Coartem (Artemether-Lumefantrine) - available free at public facilities\n3. Start treatment within 24 hours of symptoms\n\n🛡️ PREVENTION:\n• Sleep under insecticide-treated nets\n• Eliminate standing water around home\n• Indoor residual spraying\n\n🌿 TRADITIONAL SUPPORT (NOT replacement): Neem tea, Gesho tea\n\n⚠️ WARNING: Malaria can be fatal if untreated. Seek testing immediately!',
            am: '🦟 ወባ - በኢትዮጵያ ከባድ ችግር (60% ህዝብ ለአደጋ ተጋላጭ)\n\n🔴 ምልክቶች: ትኩሳት፣ ብርድ ብርድ፣ ላብ፣ ራስ ምታት፣ የጡንቻ ህመም፣ ድካም፣ ማቅለሽለሽ\n\n✅ እርምጃ:\n1. በማንኛውም የኢትዮጵያ ጤና ጣቢያ ነፃ ምርመራ ያድርጉ\n2. ህክምና: Coartem - በመንግስት ተቋማት በነፃ ይገኛል\n\n🛡️ መከላከያ:\n• በታከመ አጎበር ስር ይተኙ\n• የቆመ ውሃ ያስወግዱ\n\n🌿 ባህላዊ ድጋፍ: ኒም ሻይ፣ ጌሾ ሻይ\n\n⚠️ ማስጠንቀቂያ: ወባ ህክምና ካልተደረገለት ለሞት ሊዳርግ ይችላል!',
            om: '🦟 BUSAA - Itoophiyaa keessatti rakkoo guddaa (60% uummataa balaaf saaxilama)\n\n🔴 MALLATTOOLEE: Ho\'ina qaamaa, qorramuu, dafqii, mataa bowwuu, dhukkubbii maashaa, dadhabbii, lololaa\n\n✅ GOCHA:\n1. Buufata fayyaa Itoophiyaa kamiyyuu keessatti qormaata RDT tolaa argadhu\n2. Wal\'aansa: Coartem - buufata mootummaa keessatti tolaan argama\n\n🛡️ ITTISA:\n• Saaftuu busaa fayyadamaa\n• Bishaan dhaabatuu balleessaa\n\n⚠️ AKEekKACHIISA: Busaan yoo wal\'aansi hin godhamin du\'a fiduu danda\'a!'
        };
    }
    // ===== BLOOD PRESSURE =====
    else if (lower.includes('pressure') || lower.includes('bp') || lower.includes('የደም') || lower.includes('dhiibbaa')) {
        response = {
            en: '🩸 BLOOD PRESSURE - 16-20% of Ethiopian adults affected\n\n📊 NORMAL: Below 120/80 mmHg\n⚠️ ELEVATED: 120-129/<80\n🔴 HIGH: 130+/80+\n\n✅ MANAGEMENT:\n1. Reduce salt in wot and injera\n2. Walk 30 minutes daily\n3. Check BP weekly at health center (free)\n4. Limit coffee to 2 cups/day\n\n💊 MEDICINES: Enalapril, Amlodipine (available at Ethiopian pharmacies)\n\n🌿 TRADITIONAL: Moringa leaf powder, Tosign tea\n\n⚠️ Untreated hypertension causes stroke, heart attack, kidney failure.',
            am: '🩸 የደም ግፊት - 16-20% የኢትዮጵያ አዋቂዎች ይጎዳሉ\n\n📊 መደበኛ: ከ120/80 በታች\n⚠️ ከፍ ያለ: 120-129/<80\n🔴 ከፍተኛ: 130+/80+\n\n✅ አያያዝ:\n1. በወጥ እና እንጀራ ውስጥ ጨው ይቀንሱ\n2. በየቀኑ 30 ደቂቃ ይራመዱ\n3. በየሳምንቱ የደም ግፊት ያረጋግጡ (በነፃ)\n\n💊 መድሀኒቶች: Enalapril, Amlodipine\n\n🌿 ባህላዊ: የሞሪንጋ ቅጠል ዱቄት፣ ጦስኝ ሻይ\n\n⚠️ ያልታከመ የደም ግፊት ስትሮክ፣ የልብ ድካም፣ የኩላሊት ችግር ያስከትላል',
            om: '🩸 DHIIBBAA DHIIGAA - 16-20% namoota Itoophiyaa irratti dhiibbaa qaba\n\n📊 IDILEE: 120/80 gad\n⚠️ OLKA\'AA: 120-129/<80\n🔴 GUDDAA: 130+/80+\n\n✅ TO\'ANNNAA:\n1. Wot fi buddeena keessatti soogidda hir\'isi\n2. Guyyaatti daqiiqaa 30 deddeebi\'i\n3. Torbanitti buufata fayyaatti BP ilaali (tola)\n\n💊 QORICHA: Enalapril, Amlodipine\n\n🌿 AADAA: Daakuu baala Moringa, shaayii Tosign\n\n⚠️ Dhiibbaan dhiigaa kan hin yaalamne stroke, dhukkuba onnee, fi rakkoo kalee fida'
        };
    }
    // ===== DIABETES =====
    else if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('ስኳር') || lower.includes('sukkaara')) {
        response = {
            en: '🍬 DIABETES - Growing concern in Ethiopia (5-8% of adults)\n\n🔴 WARNING SIGNS: Frequent urination, excessive thirst, extreme hunger, unexplained weight loss, fatigue, blurred vision\n\n✅ MANAGEMENT:\n1. Exercise 30 minutes daily\n2. Eat teff injera instead of white bread\n3. Add Moringa to your diet\n4. Monitor blood sugar regularly\n\n💊 MEDICINES: Metformin (first-line), Glibenclamide, Insulin\n\n🌿 TRADITIONAL: Grawa tea (very bitter!), Moringa powder\n\n⚠️ Diabetes can cause blindness, kidney failure, and amputation if untreated.',
            am: '🍬 የስኳር ህመም - በኢትዮጵያ እየጨመረ የመጣ (5-8% አዋቂዎች)\n\n🔴 ምልክቶች: ተደጋጋሚ ሽንት፣ ከፍተኛ ጥማት፣ ከፍተኛ ረሃብ፣ ክብደት መቀነስ፣ ድካም፣ የማየት ብዥታ\n\n✅ አያያዝ:\n1. በየቀኑ 30 ደቂቃ የአካል ብቃት\n2. ነጭ ዳቦ ሳይሆን ጤፍ እንጀራ ይብሉ\n3. ሞሪንጋ ወደ ምግብዎ ይጨምሩ\n\n💊 መድሀኒቶች: Metformin, Glibenclamide, Insulin\n\n🌿 ባህላዊ: ግራዋ ሻይ (በጣም መራራ!)፣ የሞሪንጋ ዱቄት',
            om: '🍬 SUKKAARA - Itoophiyaa keessatti dabalaa jira (5-8% namoota)\n\n🔴 MALLATTOOLEE: Finyoo yeroo baay\'ee, dheebuu garmalee, beela garmalee, ulfaatina hir\'achuu, dadhabbii, ija dukkanaa\'uu\n\n✅ TO\'ANNNAA:\n1. Guyyaatti daqiiqaa 30 socho\'i\n2. Buddeena teff fayyadami\n3. Moringa nyaata kee keessatti dabali\n\n💊 QORICHA: Metformin, Glibenclamide, Insulin\n\n🌿 AADAA: Shaayii Grawa (baay\'ee hadhaa!)'
        };
    }
    // ===== DIET & NUTRITION =====
    else if (lower.includes('diet') || lower.includes('food') || lower.includes('eat') || lower.includes('ምግብ') || lower.includes('nyaata')) {
        response = {
            en: '🥗 ETHIOPIAN HEALTHY DIET TIPS\n\n✅ SUPERFOODS:\n• Teff injera - gluten-free, rich in iron and calcium\n• Moringa leaves - vitamins A, C, iron, protein\n• Lentils (Misir) - protein and fiber\n• Kale (Gomen) - iron and vitamins\n• Shiro - chickpea protein\n\n⚠️ REDUCE:\n• Salt in wot and stews\n• Oil in cooking\n• Raw meat (kitfo) consumption\n• Sugary drinks and sweets\n\n💡 TIP: Add Moringa powder to shiro or wot for extra nutrition!\n\n🌿 TRADITIONAL DIGESTION AID: Koseret, Tena Adam tea',
            am: '🥗 የኢትዮጵያ ጤናማ አመጋገብ ምክሮች\n\n✅ ልዩ ምግቦች:\n• ጤፍ እንጀራ - ከግሉተን ነፃ፣ በብረት የበለፀገ\n• የሞሪንጋ ቅጠል - ቫይታሚን ኤ፣ ሲ፣ ብረት፣ ፕሮቲን\n• ምስር - ፕሮቲን እና ፋይበር\n• ጎመን - ብረት እና ቫይታሚኖች\n• ሽሮ - የሽምብራ ፕሮቲን\n\n⚠️ ይቀንሱ:\n• በወጥ ውስጥ ጨው\n• የምግብ ዘይት\n• ጥሬ ስጋ (ክትፎ)\n• ስኳር ያላቸው መጠጦች',
            om: '🥗 GORSA NYAATA FAYYAA ITOOPHIYAA\n\n✅ NYAATA IJOO:\n• Buddeenni Teff - gluten-free, ayirenii fi calcium qaba\n• Baala Moringa - vaayitaamin A, C, ayirenii, pirootiinii\n• Misira - pirootiinii fi fiber\n• Gomeena - ayirenii fi vaayitaaminoota\n• Shiro - pirootiinii shumburaa\n\n⚠️ HIR\'ISI:\n• Wot keessatti soogidda\n• Zayitii nyaataa\n• Foon dheedhii (kitfo)\n• Dhugaatii sukkaara qaban'
        };
    }
    // ===== TRADITIONAL MEDICINE =====
    else if (lower.includes('traditional') || lower.includes('herb') || lower.includes('ባህላዊ') || lower.includes('aadaa') || lower.includes('natural')) {
        response = {
            en: '🌿 ETHIOPIAN TRADITIONAL MEDICINE DATABASE\n\n📚 8 DOCUMENTED HERBS:\n\n1. Tena Adam (Ruta chalepensis) - Stomach pain, headache, fever\n2. Moringa (Moringa stenopetala) - Malnutrition, BP, diabetes\n3. Gesho (Rhamnus prinoides) - Digestion, malaria, worms\n4. Damakese (Ocimum lamiifolium) - Fever, cold, cough\n5. Neem (Azadirachta indica) - Malaria, skin diseases\n6. Tosign (Thymus schimperi) - Cough, BP, digestion\n7. Koseret (Lippia adoensis) - Digestion, parasites\n8. Grawa (Vernonia amygdalina) - Malaria, diabetes\n\n⚠️ IMPORTANT: Always consult healthcare provider before using herbs with modern medicines!',
            am: '🌿 የኢትዮጵያ ባህላዊ ሕክምና ዳታቤዝ\n\n📚 8 የተመዘገቡ እፅዋት:\n\n1. ጤና አዳም - የሆድ ህመም፣ ራስ ምታት፣ ትኩሳት\n2. ሞሪንጋ - የተመጣጠነ ምግብ እጥረት፣ የደም ግፊት፣ ስኳር\n3. ጌሾ - የምግብ መፍጨት፣ ወባ፣ ትሎች\n4. ዳማከሴ - ትኩሳት፣ ጉንፋን፣ ሳል\n5. ኒም - ወባ፣ የቆዳ በሽታዎች\n6. ጦስኝ - ሳል፣ የደም ግፊት፣ የምግብ መፍጨት\n7. ኮሰረት - የምግብ መፍጨት፣ ትሎች\n8. ግራዋ - ወባ፣ ስኳር\n\n⚠️ አስፈላጊ: እፅዋትን ከዘመናዊ መድሀኒቶች ጋር ከመጠቀምዎ በፊት ሐኪም ያማክሩ!',
            om: '🌿 QORICHA AADAA ITOOPHIYAA\n\n📚 MARGOOTA 8 GALMEEFFAMAN:\n\n1. Tena Adam - Dhukkubbii garaa, mataa bowwuu, ho\'ina\n2. Moringa - Hangina soorataa, dhiibbaa dhiigaa, sukkaara\n3. Gesho - Bullaa\'insa, busaa, raammoo\n4. Damakese - Ho\'ina, qufaa, qufaa\n5. Neem - Busaa, dhukkubbii gogaa\n6. Tosign - Qufaa, dhiibbaa dhiigaa, bullaa\'insa\n7. Koseret - Bullaa\'insa, raammoo\n8. Grawa - Busaa, sukkaara\n\n⚠️ BARBAACHISAA: Margoota qoricha ammayyaa wajjin fayyadamuu dura ogeessa fayyaa mari\'adhu!'
        };
    }
    // ===== EMERGENCY =====
    else if (lower.includes('emergency') || lower.includes('help') || lower.includes('አደጋ') || lower.includes('tasgabbii')) {
        response = {
            en: '🚨 ETHIOPIAN EMERGENCY NUMBERS:\n\n• Ambulance: 907\n• Police: 991\n• Fire: 939\n• Red Cross: 011-552-72-22\n\n🏥 MAJOR HOSPITALS:\n• Black Lion Hospital (Addis): 011-551-1211\n• St. Paul\'s Hospital (Addis): 011-275-1111\n\n⚠️ For immediate emergencies, call 907 now!',
            am: '🚨 የኢትዮጵያ የአደጋ ጊዜ ስልክ ቁጥሮች:\n\n• አምቡላንስ: 907\n• ፖሊስ: 991\n• እሳት አደጋ: 939\n• ቀይ መስቀል: 011-552-72-22\n\n🏥 ዋና ሆስፒታሎች:\n• ጥቁር አንበሳ ሆስፒታል: 011-551-1211\n• ቅዱስ ጳውሎስ ሆስፒታል: 011-275-1111\n\n⚠️ ለአስቸኳይ አደጋዎች፣ አሁን 907 ይደውሉ!',
            om: '🚨 LAKKOOFSOTA TASGABBII ITOOPHIYAA:\n\n• Ambulaansii: 907\n• Poolisii: 991\n• Abidda: 939\n• Adii Dhiiga: 011-552-72-22\n\n🏥 HOSPITAALOTA GUGUDDAA:\n• Black Lion (Finfinne): 011-551-1211\n• St. Paul (Finfinne): 011-275-1111\n\n⚠️ Tasgabbii hatattamaaf, amma 907 bilbili!'
        };
    }
    // ===== GREETING =====
    else if (lower.includes('hello') || lower.includes('hi') || lower.includes('ሰላም') || lower.includes('akkam') || lower.includes('selam')) {
        response = {
            en: '👋 Hello! I am your Grok AI Health Assistant.\n\nI can help you with:\n🩺 Blood pressure & health analysis\n🦟 Malaria information\n🍬 Diabetes management\n🌿 Ethiopian traditional medicine\n🥗 Diet & nutrition advice\n🚨 Emergency information\n\nJust type your health question!',
            am: '👋 ሰላም! እኔ የእርስዎ Grok AI የጤና ረዳት ነኝ።\n\nእንዲህ ልረዳዎ እችላለሁ:\n🩺 የደም ግፊት እና የጤና ትንተና\n🦟 የወባ መረጃ\n🍬 የስኳር አያያዝ\n🌿 የኢትዮጵያ ባህላዊ ሕክምና\n🥗 የአመጋገብ ምክር\n🚨 የአደጋ ጊዜ መረጃ\n\nየጤና ጥያቄዎን ብቻ ይጻፉ!',
            om: '👋 Akkam! Ani gargaaraa fayyaa Grok AI keeti.\n\nWaanan si gargaaruu danda\'u:\n🩺 Dhiibbaa dhiigaa fi xiinxala fayyaa\n🦟 Odeeffannoo busaa\n🍬 To\'annaa sukkaara\n🌿 Qoricha aadaa Itoophiyaa\n🥗 Gorsa nyaataa\n🚨 Odeeffannoo tasgabbii\n\nGaaffii fayyaa kee barreessi!'
        };
    }
    // ===== DEFAULT =====
    else {
        response = {
            en: '🤔 I understand your question. Here are topics I can help with:\n\n• "I have a headache" - Headache advice\n• "Tell me about malaria" - Malaria info\n• "Blood pressure tips" - BP management\n• "Diabetes diet" - Diabetes nutrition\n• "Traditional herbs" - Ethiopian medicine\n• "Emergency numbers" - Emergency info\n• "Healthy Ethiopian food" - Diet advice\n\nWhat would you like to know?',
            am: '🤔 ጥያቄዎን ተረድቻለሁ። ልረዳዎ የምችልባቸው ርዕሶች:\n\n• "ራስ ምታት አለብኝ" - የራስ ምታት ምክር\n• "ስለ ወባ ንገረኝ" - የወባ መረጃ\n• "የደም ግፊት ምክሮች" - የደም ግፊት አያያዝ\n• "የስኳር አመጋገብ" - የስኳር አመጋገብ\n• "ባህላዊ እፅዋት" - የኢትዮጵያ ሕክምና\n• "የአደጋ ጊዜ ቁጥሮች" - የአደጋ ጊዜ መረጃ\n\nምን ማወቅ ይፈልጋሉ?',
            om: '🤔 Gaaffii kee nan hubadha. Mata dureewwan ani si gargaaruu danda\'u:\n\n• "Mataa bowwuu qaba" - Gorsa mataa bowwuu\n• "Waa\'ee busaa natti himi" - Odeeffannoo busaa\n• "Gorsa dhiibbaa dhiigaa" - To\'annaa dhiibbaa dhiigaa\n• "Nyaata sukkaara" - Nyaata sukkaara\n• "Margoota aadaa" - Qoricha Itoophiyaa\n• "Lakk. tasgabbii" - Odeeffannoo tasgabbii\n\nMaal barbaaddu?'
        };
    }

    res.json({
        success: true,
        data: {
            message: message,
            response: response[language] || response.en,
            language: language || 'en',
            timestamp: new Date().toISOString()
        }
    });
});

// ============================================
// FEATURE 2: SYMPTOM-TO-DISEASE AI DIAGNOSIS
// ============================================
app.post('/api/v1/symptoms/analyze', (req, res) => {
    const { symptoms, duration, severity } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Symptoms array is required'
        });
    }

    const findings = [];
    const sympStr = symptoms.join(' ').toLowerCase();
    const sev = severity || 5;

    // ===== MALARIA =====
    if ((sympStr.includes('fever') || sympStr.includes('chills')) &&
        (sympStr.includes('headache') || sympStr.includes('muscle') || sympStr.includes('fatigue'))) {
        findings.push({
            disease: 'Malaria',
            icon: 'fa-mosquito',
            confidence: Math.min(95, 50 + (sev >= 7 ? 25 : 0) + (sympStr.includes('chills') ? 15 : 0)),
            urgency: sev >= 7 ? 'urgent' : 'moderate',
            message: 'Seek FREE RDT test at nearest Ethiopian health center immediately.',
            action: 'Visit health center for free malaria test',
            medicines: ['Artemether-Lumefantrine (Coartem)'],
            traditional: ['Neem tea', 'Gesho tea'],
            followUp: 'Within 24 hours'
        });
    }

    // ===== TUBERCULOSIS =====
    if ((sympStr.includes('cough') || sympStr.includes('chest_pain')) &&
        (sympStr.includes('fever') || sympStr.includes('night_sweats') || sympStr.includes('weight_loss'))) {
        const isTB = sympStr.includes('night_sweats') || sympStr.includes('weight_loss') || duration === 'weeks';
        findings.push({
            disease: isTB ? 'Possible Tuberculosis (TB)' : 'Respiratory Infection',
            icon: 'fa-lungs',
            confidence: isTB ? 70 : 55,
            urgency: isTB ? 'immediate' : 'moderate',
            message: isTB ? 'Free TB testing and treatment at government clinics via DOTS program.' : 'Rest and hydrate. Seek care if breathing difficulty worsens.',
            action: isTB ? 'Visit health center for free sputum test' : 'Monitor and rest',
            medicines: isTB ? ['Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol'] : ['Amoxicillin', 'Paracetamol'],
            traditional: isTB ? [] : ['Damakese steam', 'Tosign tea'],
            followUp: isTB ? 'Immediately' : 'If symptoms worsen'
        });
    }

    // ===== TYPHOID =====
    if (sympStr.includes('fever') && (sympStr.includes('abdominal') || sympStr.includes('stomach') || sympStr.includes('constipation') || sympStr.includes('diarrhea'))) {
        findings.push({
            disease: 'Possible Typhoid Fever',
            icon: 'fa-temperature-high',
            confidence: Math.min(85, 40 + (sev >= 6 ? 20 : 0)),
            urgency: 'urgent',
            message: 'Requires antibiotic treatment. Drink only boiled or treated water.',
            action: 'Visit health center for Widal test',
            medicines: ['Ciprofloxacin', 'Ceftriaxone', 'Azithromycin'],
            traditional: [],
            followUp: 'Within 48 hours'
        });
    }

    // ===== HYPERTENSION =====
    if ((sympStr.includes('headache') && (sympStr.includes('dizziness') || sympStr.includes('blurred_vision'))) ||
        sympStr.includes('chest_pain') && sympStr.includes('shortness_breath')) {
        findings.push({
            disease: 'Possible Hypertension',
            icon: 'fa-tint',
            confidence: Math.min(75, 35 + (sev >= 6 ? 20 : 0)),
            urgency: 'moderate',
            message: 'Check blood pressure at nearest health post (free service in Ethiopia).',
            action: 'Check BP at health center',
            medicines: ['Enalapril', 'Amlodipine', 'Hydrochlorothiazide'],
            traditional: ['Moringa leaf powder', 'Tosign tea', 'Gesho'],
            followUp: 'Weekly monitoring'
        });
    }

    // ===== DIABETES =====
    if ((sympStr.includes('frequent_urination') || sympStr.includes('thirst') || sympStr.includes('hunger')) &&
        (sympStr.includes('fatigue') || sympStr.includes('weight_loss') || sympStr.includes('blurred_vision'))) {
        findings.push({
            disease: 'Possible Type 2 Diabetes',
            icon: 'fa-candy-cane',
            confidence: Math.min(70, 35 + (sev >= 6 ? 15 : 0)),
            urgency: 'moderate',
            message: 'Get fasting glucose test at health center. Reduce sugar and refined carbs.',
            action: 'Fasting glucose test at health center',
            medicines: ['Metformin', 'Glibenclamide'],
            traditional: ['Moringa', 'Grawa tea (very bitter!)'],
            followUp: 'Within 1 week'
        });
    }

    // ===== ANEMIA =====
    if ((sympStr.includes('fatigue') || sympStr.includes('pale') || sympStr.includes('dizziness')) &&
        (sympStr.includes('shortness_breath') || sympStr.includes('weakness'))) {
        findings.push({
            disease: 'Possible Anemia',
            icon: 'fa-tint',
            confidence: Math.min(65, 30 + (sev >= 5 ? 15 : 0)),
            urgency: 'moderate',
            message: 'Common in Ethiopia (24% of women affected). Get iron supplements at health center (free for pregnant women).',
            action: 'Blood test at health center',
            medicines: ['Iron + Folic Acid', 'Vitamin B12'],
            traditional: ['Moringa', 'Teff-based foods', 'Lentils (Misir)'],
            followUp: 'Within 2 weeks'
        });
    }

    // ===== GASTROENTERITIS =====
    if ((sympStr.includes('diarrhea') || sympStr.includes('vomiting')) &&
        (sympStr.includes('abdominal') || sympStr.includes('nausea') || sympStr.includes('cramps'))) {
        findings.push({
            disease: 'Gastroenteritis',
            icon: 'fa-water',
            confidence: Math.min(80, 40 + (sev >= 6 ? 20 : 0)),
            urgency: sev >= 7 ? 'urgent' : 'moderate',
            message: 'Start ORS (Oral Rehydration Salts) immediately. Available free at Ethiopian health posts.',
            action: 'Use ORS, continue feeding, seek care if severe',
            medicines: ['ORS', 'Zinc supplements'],
            traditional: ['Tena Adam tea', 'Gesho tea'],
            followUp: 'If not improving in 24 hours'
        });
    }

    // If no specific match
    if (findings.length === 0) {
        findings.push({
            disease: 'General Symptoms',
            icon: 'fa-clipboard-list',
            confidence: 30,
            urgency: 'low',
            message: 'No specific disease pattern detected. Monitor your symptoms and consult a healthcare provider if they persist or worsen.',
            action: 'Rest, hydrate, monitor for 48 hours',
            medicines: ['Paracetamol (if fever/pain)'],
            traditional: ['Rest and hydration'],
            followUp: 'If symptoms persist beyond 3 days'
        });
    }

    // Sort by confidence (highest first)
    findings.sort((a, b) => b.confidence - a.confidence);

    res.json({
        success: true,
        data: {
            symptoms: symptoms,
            duration: duration || 'unknown',
            severity: sev,
            findings: findings,
            totalConditions: findings.length,
            topDiagnosis: findings[0],
            disclaimer: 'This is AI-assisted screening. Always consult a qualified healthcare provider for diagnosis.',
            analyzedAt: new Date().toISOString()
        }
    });
});

// ============================================
// FEATURE 3: HERB-DRUG INTERACTION CHECKER
// ============================================
app.post('/api/v1/herbs/check-interactions', (req, res) => {
    const { herbId, medications } = req.body;

    if (!herbId) {
        return res.status(400).json({
            success: false,
            message: 'Herb ID is required. Available: tena_adam, moringa, gesho, damakese, neem, tosign, koseret, grawa'
        });
    }

    // Complete interaction database
    const interactionDB = {
        tena_adam: {
            name: 'Tena Adam',
            scientific: 'Ruta chalepensis',
            interactions: [
                { drug: 'Warfarin', severity: 'high', effect: 'Increased bleeding risk. Can cause dangerous hemorrhage.', recommendation: 'AVOID combination completely.' },
                { drug: 'Aspirin', severity: 'high', effect: 'Increased bleeding risk and stomach irritation.', recommendation: 'Avoid combination.' },
                { drug: 'Clopidogrel', severity: 'high', effect: 'Additive blood-thinning effect.', recommendation: 'Avoid combination.' },
                { drug: 'Blood Pressure Medications', severity: 'medium', effect: 'May increase BP-lowering effect.', recommendation: 'Monitor BP closely.' },
                { drug: 'Antidepressants (MAOIs)', severity: 'medium', effect: 'May cause dangerous interaction.', recommendation: 'Consult doctor before use.' }
            ]
        },
        moringa: {
            name: 'Moringa',
            scientific: 'Moringa stenopetala',
            interactions: [
                { drug: 'Insulin', severity: 'high', effect: 'May cause severe hypoglycemia (dangerously low blood sugar).', recommendation: 'Monitor blood sugar closely. Adjust insulin dose with doctor.' },
                { drug: 'Metformin', severity: 'medium', effect: 'Additive glucose-lowering effect.', recommendation: 'Monitor blood sugar regularly.' },
                { drug: 'Blood Pressure Medications', severity: 'medium', effect: 'May lower blood pressure further.', recommendation: 'Monitor BP. May need dose adjustment.' },
                { drug: 'Thyroid Medications (Levothyroxine)', severity: 'medium', effect: 'May reduce thyroid medication absorption.', recommendation: 'Take Moringa at least 4 hours apart from thyroid meds.' },
                { drug: 'Warfarin', severity: 'low', effect: 'Moringa contains vitamin K which may reduce warfarin effectiveness.', recommendation: 'Monitor INR levels.' }
            ]
        },
        gesho: {
            name: 'Gesho',
            scientific: 'Rhamnus prinoides',
            interactions: [
                { drug: 'Diabetes Medications', severity: 'high', effect: 'May significantly lower blood sugar leading to hypoglycemia.', recommendation: 'Monitor blood sugar carefully.' },
                { drug: 'Alcohol', severity: 'high', effect: 'Increased liver stress. Gesho is used in alcoholic beverages (Tella/Tej).', recommendation: 'Avoid combining with alcohol.' },
                { drug: 'Blood Pressure Medications', severity: 'medium', effect: 'May have additive BP-lowering effects.', recommendation: 'Monitor BP regularly.' },
                { drug: 'Laxatives', severity: 'medium', effect: 'Gesho has laxative properties. Combining may cause severe diarrhea.', recommendation: 'Avoid combining with other laxatives.' }
            ]
        },
        neem: {
            name: 'Neem',
            scientific: 'Azadirachta indica',
            interactions: [
                { drug: 'Diabetes Medications', severity: 'high', effect: 'Can cause severe hypoglycemia. Neem strongly lowers blood sugar.', recommendation: 'AVOID combination or monitor glucose extremely closely.' },
                { drug: 'Lithium', severity: 'high', effect: 'Neem may increase lithium levels to dangerous levels.', recommendation: 'AVOID combination.' },
                { drug: 'Immunosuppressants', severity: 'high', effect: 'Neem may stimulate immune system, counteracting immunosuppressants.', recommendation: 'AVOID if taking immunosuppressants (organ transplant, autoimmune).' },
                { drug: 'Sedatives', severity: 'medium', effect: 'May increase drowsiness when combined with sedatives.', recommendation: 'Use caution when driving or operating machinery.' }
            ]
        },
        damakese: {
            name: 'Damakese',
            scientific: 'Ocimum lamiifolium',
            interactions: [
                { drug: 'Blood Pressure Medications', severity: 'low', effect: 'May have mild BP-lowering effect.', recommendation: 'Generally safe. Monitor BP.' },
                { drug: 'Blood Thinners', severity: 'low', effect: 'Minimal interaction risk.', recommendation: 'Generally considered safe.' }
            ]
        },
        tosign: {
            name: 'Tosign',
            scientific: 'Thymus schimperi',
            interactions: [
                { drug: 'Blood Pressure Medications', severity: 'medium', effect: 'May lower blood pressure further.', recommendation: 'Monitor BP. Adjust medication if needed.' },
                { drug: 'Blood Thinners', severity: 'low', effect: 'Mild blood-thinning properties.', recommendation: 'Monitor if on high-dose blood thinners.' }
            ]
        },
        koseret: {
            name: 'Koseret',
            scientific: 'Lippia adoensis',
            interactions: [
                { drug: 'No known serious interactions', severity: 'low', effect: 'Generally safe in culinary amounts.', recommendation: 'Safe for most people.' }
            ]
        },
        grawa: {
            name: 'Grawa',
            scientific: 'Vernonia amygdalina',
            interactions: [
                { drug: 'Diabetes Medications', severity: 'high', effect: 'Can cause dangerous hypoglycemia. Grawa strongly lowers blood sugar.', recommendation: 'AVOID or monitor glucose extremely closely.' },
                { drug: 'Blood Pressure Medications', severity: 'medium', effect: 'May lower blood pressure.', recommendation: 'Monitor BP regularly.' },
                { drug: 'Antimalarials', severity: 'low', effect: 'May have additive anti-malarial effect.', recommendation: 'Do not use as replacement for prescribed antimalarials.' }
            ]
        }
    };

    const herbData = interactionDB[herbId];

    if (!herbData) {
        return res.status(404).json({
            success: false,
            message: 'Herb not found. Available IDs: ' + Object.keys(interactionDB).join(', ')
        });
    }

    // Find relevant interactions
    let relevantInteractions = herbData.interactions;

    if (medications && Array.isArray(medications) && medications.length > 0) {
        relevantInteractions = herbData.interactions.filter(interaction =>
            medications.some(med =>
                interaction.drug.toLowerCase().includes(med.toLowerCase()) ||
                med.toLowerCase().includes(interaction.drug.toLowerCase())
            )
        );
    }

    const hasHighRisk = relevantInteractions.some(i => i.severity === 'high');
    const hasMediumRisk = relevantInteractions.some(i => i.severity === 'medium');

    res.json({
        success: true,
        data: {
            herb: {
                id: herbId,
                name: herbData.name,
                scientific: herbData.scientific
            },
            interactions: relevantInteractions,
            totalInteractions: relevantInteractions.length,
            warningLevel: hasHighRisk ? 'danger' : hasMediumRisk ? 'warning' : 'safe',
            message: relevantInteractions.length === 0
                ? `No known interactions found. ${herbData.name} appears safe with your medications.`
                : `⚠️ ${relevantInteractions.length} interaction(s) found! ${hasHighRisk ? 'HIGH RISK - Consult your doctor immediately!' : 'Exercise caution.'}`,
            disclaimer: 'Always consult a qualified healthcare provider before combining herbs with medications.',
            checkedAt: new Date().toISOString()
        }
    });
});

// ============================================
// HEALTH ANALYSIS (ORIGINAL FEATURE)
// ============================================
app.post('/api/v1/health/analyze', (req, res) => {
    try {
        const { systolic, diastolic, glucose, bmi, temperature, age, symptoms } = req.body;

        let score = 100;
        const findings = [];

        // Hypertension
        if (systolic >= 140) {
            const risk = Math.min(100, (systolic - 120) * 2 + (diastolic >= 90 ? 20 : 0));
            score -= 25;
            findings.push({
                name: 'Hypertension Risk',
                icon: 'fa-tint',
                color: '#ef4444',
                risk: risk,
                level: risk > 60 ? 'high' : 'medium',
                treatment: {
                    modern: ['Enalapril', 'Amlodipine', 'Hydrochlorothiazide'],
                    traditional: ['Moringa', 'Tosign', 'Gesho'],
                    lifestyle: ['Reduce salt to <5g/day', '30 min daily walk', 'Monitor BP weekly at health center (free)']
                }
            });
        }

        // Diabetes
        if (glucose >= 126) {
            const risk = Math.min(100, (glucose - 100) * 1.5);
            score -= 25;
            findings.push({
                name: 'Diabetes Risk',
                icon: 'fa-candy-cane',
                color: '#f59e0b',
                risk: risk,
                level: risk > 50 ? 'high' : 'medium',
                treatment: {
                    modern: ['Metformin', 'Glibenclamide'],
                    traditional: ['Moringa', 'Grawa', 'Koseret'],
                    lifestyle: ['Exercise 30 min daily', 'Reduce sugar', 'Eat teff injera instead of white bread']
                }
            });
        }

        // Malaria
        if (temperature >= 38) {
            const risk = Math.min(100, (temperature - 36) * 20);
            const month = new Date().getMonth() + 1;
            score -= 20;
            findings.push({
                name: 'Malaria Risk' + ([6,7,8,9].includes(month) ? ' (Peak Season)' : ''),
                icon: 'fa-mosquito',
                color: '#3b82f6',
                risk: Math.min(100, risk + ([6,7,8,9].includes(month) ? 25 : 0)),
                level: risk > 50 ? 'high' : 'medium',
                treatment: {
                    modern: ['Artemether-Lumefantrine (Coartem)', 'Chloroquine'],
                    traditional: ['Neem', 'Gesho', 'Grawa'],
                    lifestyle: ['Sleep under treated nets', 'Eliminate standing water', 'Seek FREE RDT test at health center']
                }
            });
        }

        // Obesity
        if (bmi >= 30) {
            score -= 15;
            findings.push({
                name: 'Obesity',
                icon: 'fa-weight-scale',
                color: '#f59e0b',
                risk: Math.min(100, (bmi - 25) * 4),
                level: bmi >= 35 ? 'high' : 'medium',
                treatment: {
                    modern: ['Weight management program'],
                    traditional: ['Moringa tea', 'Portion control with traditional foods'],
                    lifestyle: ['Exercise 45 min daily', 'Reduce oil in wot', 'Eat more vegetables']
                }
            });
        }

        // Anemia
        if (bmi < 18.5) {
            score -= 15;
            findings.push({
                name: 'Anemia/Malnutrition Risk',
                icon: 'fa-tint',
                color: '#ef4444',
                risk: Math.min(100, (20 - bmi) * 8),
                level: bmi < 16 ? 'high' : 'medium',
                treatment: {
                    modern: ['Iron + Folic Acid (FREE at Ethiopian clinics)', 'Vitamin B12'],
                    traditional: ['Moringa', 'Teff-based foods', 'Lentils (Misir)', 'Spinach (Gomen)'],
                    lifestyle: ['Eat iron-rich foods daily', 'Get free supplements at antenatal clinics', 'Regular deworming']
                }
            });
        }

        score = Math.max(0, Math.min(100, score));

        // Save to history
        analysisHistory.push({
            systolic, diastolic, glucose, bmi, temperature, age,
            score, findings: findings.length,
            timestamp: new Date().toISOString()
        });
        if (analysisHistory.length > 100) analysisHistory.shift();

        res.json({
            success: true,
            data: {
                score,
                findings,
                urgency: score < 50 ? 'urgent' : score < 70 ? 'attention' : 'normal',
                analyzedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// HERB DATABASE
// ============================================
app.get('/api/v1/herbs', (req, res) => {
    const herbs = [
        { id: 'tena_adam', name: 'Tena Adam', scientific: 'Ruta chalepensis', family: 'Rutaceae', icon: 'fa-leaf',
          category: ['respiratory', 'digestive', 'skin'],
          uses: 'Stomach pain, headache, fever, cough, ear infection, intestinal worms, skin conditions, eye infections',
          preparations: [
            { method: 'Tea', directions: 'Boil 5-10 leaves in 2 cups water for 10 min', dosage: '1 cup, 2-3x daily after meals', duration: 'Max 7 days' },
            { method: 'Steam inhalation', directions: 'Add fresh leaves to boiling water, inhale covered with towel', dosage: '5-10 min, 1-2x daily' }
          ],
          warnings: ['Avoid during pregnancy', 'Avoid with blood thinners (Warfarin, Aspirin)', 'May cause photosensitivity', 'Not for children under 5'],
          regions: 'Ethiopian highlands (1,500-3,000m), Tigray, Amhara, Oromia, SNNP' },
        { id: 'moringa', name: 'Moringa', scientific: 'Moringa stenopetala', family: 'Moringaceae', icon: 'fa-seedling',
          category: ['nutrition', 'chronic', 'womens'],
          uses: 'Malnutrition, high blood pressure, diabetes, anemia, breastfeeding support, immune booster, cholesterol reduction',
          preparations: [
            { method: 'Fresh leaves', directions: 'Wash and add to soups, stews, or salads', dosage: '1/2 cup daily with meals', duration: 'Safe for daily long-term use' },
            { method: 'Leaf powder', directions: 'Dry leaves in shade, grind to fine powder', dosage: '1-2 teaspoons daily in water or food', duration: 'Daily supplement' }
          ],
          warnings: ['May significantly lower blood sugar', 'May lower blood pressure', 'Avoid root/bark during pregnancy', 'Start with small doses'],
          regions: 'Southern Ethiopia (Konso, Gamo Gofa, Sidama), cultivated in central and eastern regions' },
        { id: 'gesho', name: 'Gesho', scientific: 'Rhamnus prinoides', family: 'Rhamnaceae', icon: 'fa-tree',
          category: ['digestive', 'malaria'],
          uses: 'Digestive aid, stomach ache, malaria, intestinal worms, tonsillitis, fever, anti-inflammatory',
          preparations: [
            { method: 'Tea', directions: 'Boil 10-15 dried leaves/stems in 1L water for 15-20 min', dosage: '1 cup, 2-3x daily', duration: 'Max 7-10 days' }
          ],
          warnings: ['May interact with diabetes medications', 'Avoid excessive use with alcohol', 'Not recommended during pregnancy', 'May cause stomach upset in high doses'],
          regions: 'Ethiopian highlands (1,800-3,200m), Amhara, Oromia, Tigray, Southern regions' },
        { id: 'damakese', name: 'Damakese', scientific: 'Ocimum lamiifolium', family: 'Lamiaceae', icon: 'fa-leaf',
          category: ['respiratory'],
          uses: 'Fever, headache, common cold, cough, eye infection, skin problems, nasal congestion',
          preparations: [
            { method: 'Steam inhalation', directions: 'Crush fresh leaves, inhale vapor or add to boiling water', dosage: '5-10 min as needed', duration: 'As needed for symptoms' }
          ],
          warnings: ['Generally safe', 'Avoid excessive use during pregnancy'],
          regions: 'Common in Ethiopian gardens and highlands throughout the country' },
        { id: 'neem', name: 'Neem', scientific: 'Azadirachta indica', family: 'Meliaceae', icon: 'fa-tree',
          category: ['malaria', 'skin'],
          uses: 'Malaria, fever, skin diseases, dental problems, intestinal worms, anti-inflammatory, antibacterial',
          preparations: [
            { method: 'Tea', directions: 'Boil leaves in water', dosage: '1 cup daily', duration: 'Max 2 weeks' },
            { method: 'Oil (skin)', directions: 'Apply neem oil to affected skin areas', dosage: '1-2x daily' }
          ],
          warnings: ['NOT for pregnant or breastfeeding women', 'May affect fertility', 'Avoid long-term use', 'Not for infants'],
          regions: 'Lower altitude areas, Eastern Ethiopia, also found in Harar and Dire Dawa' },
        { id: 'tosign', name: 'Tosign', scientific: 'Thymus schimperi', family: 'Lamiaceae', icon: 'fa-leaf',
          category: ['respiratory', 'chronic'],
          uses: 'Cough, cold, respiratory infections, digestive problems, high blood pressure, antimicrobial',
          preparations: [
            { method: 'Tea', directions: 'Add fresh or dried leaves to hot water, steep 5-7 min', dosage: '1-2 cups daily', duration: 'Safe for regular use' },
            { method: 'Spice', directions: 'Add to cooking as flavoring', dosage: 'Culinary amounts' }
          ],
          warnings: ['Generally safe', 'May slightly lower blood pressure', 'Monitor if on BP medications'],
          regions: 'Ethiopian highlands, Bale Mountains, Simien Mountains' },
        { id: 'koseret', name: 'Koseret', scientific: 'Lippia adoensis', family: 'Verbenaceae', icon: 'fa-leaf',
          category: ['digestive'],
          uses: 'Digestive problems, stomach ache, intestinal parasites, fever, cough, used in traditional butter preparation',
          preparations: [
            { method: 'Spice', directions: 'Add to cooking as spice, especially in butter (Kibe)', dosage: 'Culinary amounts', duration: 'Safe for regular use' },
            { method: 'Tea', directions: 'Boil leaves in water', dosage: '1-2 cups daily for medicinal use' }
          ],
          warnings: ['Safe in culinary amounts', 'Medicinal doses should be monitored'],
          regions: 'Ethiopian highlands, commonly cultivated in home gardens' },
        { id: 'grawa', name: 'Grawa', scientific: 'Vernonia amygdalina', family: 'Asteraceae', icon: 'fa-leaf',
          category: ['malaria', 'chronic'],
          uses: 'Malaria, fever, diabetes, digestive problems, intestinal parasites, liver support',
          preparations: [
            { method: 'Tea', directions: 'Boil leaves in water, drink small amounts', dosage: '½ cup daily', duration: 'Max 7 days' },
            { method: 'Fresh leaves', directions: 'Chew fresh leaves (very bitter)', dosage: '2-3 leaves' }
          ],
          warnings: ['Very bitter taste', 'May significantly lower blood sugar', 'Monitor if diabetic', 'Not for long-term use'],
          regions: 'Various regions of Ethiopia, especially mid-altitude areas' }
    ];

    res.json({ success: true, count: herbs.length, data: herbs });
});

// ============================================
// HEALTH TRENDS
// ============================================
app.get('/api/v1/health/trends', (req, res) => {
    if (analysisHistory.length === 0) {
        return res.json({ success: true, data: [], message: 'No analysis history yet' });
    }

    res.json({
        success: true,
        count: analysisHistory.length,
        data: analysisHistory.slice(-20),
        average: {
            score: Math.round(analysisHistory.reduce((s, h) => s + h.score, 0) / analysisHistory.length),
            systolic: Math.round(analysisHistory.reduce((s, h) => s + (h.systolic||0), 0) / analysisHistory.length)
        }
    });
});

// ============================================
// VOICE PROCESSING
// ============================================
app.post('/api/v1/voice/process', (req, res) => {
    const { transcript, language } = req.body;

    const responses = {
        en: 'Processing your health request. How can I help you today?',
        am: 'የጤና ጥያቄዎን በማስኬድ ላይ። ዛሬ እንዴት ልረዳዎ?',
        om: 'Gaaffii fayyaa kee adeessaa jira. Akkamittan si gargaaruu danda\'a?'
    };

    res.json({
        success: true,
        data: {
            transcript,
            response: responses[language] || responses.en,
            language: language || 'en',
            timestamp: new Date().toISOString()
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found: ' + req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

module.exports = app;
