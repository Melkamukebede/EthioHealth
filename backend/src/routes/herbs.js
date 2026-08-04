const express = require('express');
const router = express.Router();
const herbController = require('../controllers/herbController');

router.get('/', herbController.getAllHerbs);
router.get('/search', herbController.searchHerbs);
router.get('/:id', herbController.getHerbById);

module.exports = router;
