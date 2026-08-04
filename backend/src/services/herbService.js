/**
 * Ethiopian Traditional Medicine Database Service
 */

const herbs = [
    {
        id: 'tena_adam',
        name: { en: 'Tena Adam', am: 'ጤና አዳም', om: 'Tena Adam' },
        scientific: 'Ruta chalepensis',
        family: 'Rutaceae',
        category: ['respiratory', 'digestive', 'skin'],
        icon: 'fa-leaf',
        description: {
            en: 'Widely used medicinal plant in Ethiopian highlands for respiratory and digestive issues.',
            am: 'በኢትዮጵያ ደጋማ አካባቢዎች ለመተንፈሻ እና ለምግብ መፍጫ ችግሮች በስፋት ጥቅም ላይ የሚውል መድኃኒት ተክል።',
            om: 'Biqiltuu qorichummaa Itoophiyaa olka\'aa keessatti bal\'inaan fayyadamamu.'
        },
        uses: {
            en: ['Stomach pain', 'Headache', 'Fever', 'Cough', 'Ear infection', 'Intestinal worms'],
            am: ['የሆድ ህመም', 'ራስ ምታት', 'ትኩሳት', 'ሳል', 'የጆሮ ኢንፌክሽን', 'የአንጀት ትሎች'],
            om: ['Dhukkubbii garaa', 'Mataa bowwuu', 'Ho\'ina qaamaa', 'Qufaa', 'Infekshinii gurraa', 'Raammoo garaa']
        },
        preparations: [
            { method: 'Tea', directions: 'Boil 5-10 leaves in 2 cups water for 10 min', dosage: '1 cup, 2-3x daily' },
            { method: 'Steam', directions: 'Add leaves to boiling water, inhale steam', dosage: '5-10 min, 1-2x daily' }
        ],
        warnings: {
            en: ['Avoid during pregnancy', 'Avoid with blood thinners', 'May cause photosensitivity'],
            am: ['በእርግዝና ወቅት አይጠቀሙ', 'ደም ከሚያቀጭኑ መድሃኒቶች ጋር አይጠቀሙ'],
            om: ['Ulfa yeroo hin fayyadaminaa', 'Qoricha dhiiga qallisan wajjin hin fayyadaminaa']
        },
        interactions: [
            { drug: 'Warfarin', severity: 'high', effect: 'Increased bleeding risk' },
            { drug: 'Aspirin', severity: 'medium', effect: 'Increased bleeding risk' }
        ],
        regions: 'Ethiopian highlands (1,500-3,000m)'
    },
    {
        id: 'moringa',
        name: { en: 'Moringa', am: 'ሞሪንጋ', om: 'Moringa' },
        scientific: 'Moringa stenopetala',
        family: 'Moringaceae',
        category: ['nutrition', 'chronic', 'womens'],
        icon: 'fa-seedling',
        description: {
            en: 'Miracle tree - extremely nutritious with larger leaves than Indian variety.',
            am: 'የተአምር ዛፍ - ከህንድ ዝርያ የበለጠ ትላልቅ ቅጠሎች ያሉት እጅግ ገንቢ ተክል።',
            om: 'Muka dinqii - baala gurguddaa qabu.'
        },
        uses: {
            en: ['Malnutrition', 'High BP', 'Diabetes', 'Anemia', 'Breastfeeding support'],
            am: ['የተመጣጠነ ምግብ እጥረት', 'የደም ግፊት', 'ስኳር', 'የደም ማነስ', 'የጡት ወተት ማሳደግ'],
            om: ['Hangina soorataa', 'Dhiibbaa dhiigaa', 'Sukkaara', 'Dhiiga hanqina', 'Annana harmaa dabaluu']
        },
        preparations: [
            { method: 'Fresh leaves', directions: 'Wash and add to soups/stews', dosage: '1/2 cup daily' },
            { method: 'Powder', directions: 'Dry leaves, grind to powder', dosage: '1-2 tsp daily' }
        ],
        warnings: {
            en: ['May lower blood sugar', 'Avoid root during pregnancy', 'Start with small doses'],
            am: ['የስኳር መጠንን ሊቀንስ ይችላል', 'በእርግዝና ወቅት ስር አይጠቀሙ'],
            om: ['Sukkaara dhiigaa hir\'isuu danda\'a', 'Ulfa yeroo hidda hin fayyadaminaa']
        },
        interactions: [
            { drug: 'Insulin', severity: 'high', effect: 'May cause hypoglycemia' },
            { drug: 'Metformin', severity: 'medium', effect: 'Additive glucose-lowering effect' }
        ],
        regions: 'Southern Ethiopia (Konso, Gamo Gofa)'
    }
];

function getAll(category, language) {
    let result = [...herbs];
    if (category && category !== 'all') {
        result = result.filter(h => h.category.includes(category));
    }
    return result.map(h => formatHerb(h, language));
}

function search(query, language) {
    const q = query.toLowerCase();
    return herbs.filter(h => 
        h.name.en.toLowerCase().includes(q) ||
        h.name.am.includes(q) ||
        h.scientific.toLowerCase().includes(q) ||
        h.uses.en.some(u => u.toLowerCase().includes(q))
    ).map(h => formatHerb(h, language));
}

function getById(id) {
    const herb = herbs.find(h => h.id === id);
    return herb ? formatHerb(herb, 'en') : null;
}

function checkInteractions(herbId, medications) {
    const herb = herbs.find(h => h.id === herbId);
    if (!herb) return { found: false };
    
    const interactions = herb.interactions?.filter(i => 
        medications.some(m => m.toLowerCase().includes(i.drug.toLowerCase()))
    ) || [];
    
    return {
        herb: herb.name.en,
        interactions,
        warningLevel: interactions.some(i => i.severity === 'high') ? 'danger' :
                      interactions.length > 0 ? 'warning' : 'safe'
    };
}

function formatHerb(herb, language) {
    return {
        id: herb.id,
        name: herb.name[language] || herb.name.en,
        scientific: herb.scientific,
        category: herb.category,
        icon: herb.icon,
        description: herb.description[language] || herb.description.en,
        uses: herb.uses[language] || herb.uses.en,
        preparations: herb.preparations,
        warnings: herb.warnings[language] || herb.warnings.en,
        regions: herb.regions
    };
}

module.exports = { getAll, search, getById, checkInteractions };
