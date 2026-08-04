const herbs = [
    {
        id: 'tena_adam', name: 'Tena Adam', scientific: 'Ruta chalepensis',
        category: ['respiratory', 'digestive', 'skin'], icon: 'fa-leaf',
        description: 'One of the most widely used medicinal plants in Ethiopian highlands.',
        uses: ['Stomach pain', 'Headache', 'Fever', 'Cough', 'Ear infection', 'Intestinal worms'],
        preparations: [
            { method: 'Tea', directions: 'Boil 5-10 leaves in 2 cups water for 10 min', dosage: '1 cup, 2-3x daily' }
        ],
        warnings: ['Avoid during pregnancy', 'Avoid with blood thinners', 'May cause photosensitivity'],
        regions: 'Ethiopian highlands (1,500-3,000m)'
    },
    {
        id: 'moringa', name: 'Moringa', scientific: 'Moringa stenopetala',
        category: ['nutrition', 'chronic', 'womens'], icon: 'fa-seedling',
        description: 'Miracle tree - extremely nutritious with larger leaves than Indian variety.',
        uses: ['Malnutrition', 'High blood pressure', 'Diabetes', 'Anemia', 'Breastfeeding support'],
        preparations: [
            { method: 'Fresh leaves', directions: 'Wash and add to soups/stews', dosage: '1/2 cup daily' },
            { method: 'Powder', directions: 'Dry leaves, grind to powder', dosage: '1-2 tsp daily' }
        ],
        warnings: ['May lower blood sugar', 'Avoid root during pregnancy'],
        regions: 'Southern Ethiopia (Konso, Gamo Gofa)'
    },
    {
        id: 'gesho', name: 'Gesho', scientific: 'Rhamnus prinoides',
        category: ['digestive', 'malaria'], icon: 'fa-tree',
        description: 'Essential in traditional Tella and Tej brewing. Medicinally used for digestion.',
        uses: ['Digestive aid', 'Malaria', 'Intestinal worms', 'Tonsillitis', 'Fever'],
        preparations: [
            { method: 'Tea', directions: 'Boil 10-15 leaves in 1L water for 15 min', dosage: '1 cup, 2-3x daily' }
        ],
        warnings: ['May interact with diabetes medications', 'Avoid excessive use with alcohol'],
        regions: 'Ethiopian highlands (1,800-3,200m)'
    },
    {
        id: 'damakese', name: 'Damakese', scientific: 'Ocimum lamiifolium',
        category: ['respiratory'], icon: 'fa-leaf',
        description: 'Common in Ethiopian gardens. Used for respiratory conditions.',
        uses: ['Fever', 'Headache', 'Common cold', 'Cough', 'Eye infection'],
        preparations: [
            { method: 'Steam inhalation', directions: 'Crush fresh leaves, inhale vapor', dosage: '5-10 min as needed' }
        ],
        warnings: ['Generally safe', 'Avoid excessive use during pregnancy'],
        regions: 'Common in Ethiopian gardens and highlands'
    },
    {
        id: 'neem', name: 'Neem', scientific: 'Azadirachta indica',
        category: ['malaria', 'skin'], icon: 'fa-tree',
        description: 'Powerful anti-malarial and anti-bacterial properties.',
        uses: ['Malaria', 'Fever', 'Skin diseases', 'Dental problems', 'Intestinal worms'],
        preparations: [
            { method: 'Tea', directions: 'Boil leaves in water', dosage: '1 cup daily, max 2 weeks' }
        ],
        warnings: ['Not for pregnant or breastfeeding women', 'May affect fertility', 'Avoid long-term use'],
        regions: 'Lower altitude areas, Eastern Ethiopia'
    },
    {
        id: 'tosign', name: 'Tosign', scientific: 'Thymus schimperi',
        category: ['respiratory', 'chronic'], icon: 'fa-leaf',
        description: 'Ethiopian wild thyme with powerful medicinal properties.',
        uses: ['Cough', 'Cold', 'Respiratory infections', 'Digestive problems', 'High blood pressure'],
        preparations: [
            { method: 'Tea', directions: 'Add to tea or food as spice', dosage: '1-2 cups daily' }
        ],
        warnings: ['Generally safe', 'May slightly lower blood pressure'],
        regions: 'Ethiopian highlands'
    },
    {
        id: 'koseret', name: 'Koseret', scientific: 'Lippia adoensis',
        category: ['digestive'], icon: 'fa-leaf',
        description: 'Traditional Ethiopian herb used in butter preparation and medicine.',
        uses: ['Digestive problems', 'Stomach ache', 'Intestinal parasites', 'Fever'],
        preparations: [
            { method: 'Spice', directions: 'Add to cooking as spice', dosage: 'Culinary amounts' }
        ],
        warnings: ['Safe in culinary amounts', 'Medicinal doses should be monitored'],
        regions: 'Ethiopian highlands'
    },
    {
        id: 'grawa', name: 'Grawa', scientific: 'Vernonia amygdalina',
        category: ['malaria', 'chronic'], icon: 'fa-leaf',
        description: 'Extremely bitter but highly effective medicinal plant.',
        uses: ['Malaria', 'Fever', 'Diabetes', 'Digestive problems', 'Intestinal parasites'],
        preparations: [
            { method: 'Tea', directions: 'Boil leaves in water, drink small amounts', dosage: '½ cup daily, max 7 days' }
        ],
        warnings: ['Very bitter', 'May lower blood sugar significantly', 'Monitor if diabetic'],
        regions: 'Various regions of Ethiopia'
    }
];

function getAll(category) {
    if (category && category !== 'all') {
        return herbs.filter(h => h.category.includes(category));
    }
    return herbs;
}

function search(query) {
    const q = query.toLowerCase();
    return herbs.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.scientific.toLowerCase().includes(q) ||
        h.uses.some(u => u.toLowerCase().includes(q)) ||
        h.category.some(c => c.toLowerCase().includes(q))
    );
}

function getById(id) {
    return herbs.find(h => h.id === id) || null;
}

module.exports = { getAll, search, getById };
