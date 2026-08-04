const herbService = require('../services/herbService');

/**
 * Get all herbs
 */
exports.getAllHerbs = async (req, res, next) => {
    try {
        const { category, language } = req.query;
        const herbs = herbService.getAll(category, language || 'en');
        
        res.json({
            success: true,
            count: herbs.length,
            data: herbs
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Search herbs
 */
exports.searchHerbs = async (req, res, next) => {
    try {
        const { q, language } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query required'
            });
        }
        
        const results = herbService.search(q, language || 'en');
        
        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single herb
 */
exports.getHerb = async (req, res, next) => {
    try {
        const herb = herbService.getById(req.params.id);
        
        if (!herb) {
            return res.status(404).json({
                success: false,
                message: 'Herb not found'
            });
        }
        
        res.json({
            success: true,
            data: herb
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Check herb-drug interactions
 */
exports.checkInteractions = async (req, res, next) => {
    try {
        const { herbId, medications } = req.body;
        
        if (!herbId || !medications) {
            return res.status(400).json({
                success: false,
                message: 'Herb ID and medications required'
            });
        }
        
        const interactions = herbService.checkInteractions(herbId, medications);
        
        res.json({
            success: true,
            data: interactions
        });
    } catch (error) {
        next(error);
    }
};
