const express = require('express');
const router = express.Router();
const herbController = require('../controllers/herbController');

// Get all herbs
router.get('/', herbController.getAllHerbs);

// Search herbs
router.get('/search', herbController.searchHerbs);

// Get single herb
router.get('/:id', herbController.getHerb);

// Check herb-drug interactions
router.post('/check-interactions', herbController.checkInteractions);

module.exports = router;
