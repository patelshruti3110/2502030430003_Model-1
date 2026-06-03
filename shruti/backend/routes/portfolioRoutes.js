const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/create', auth, portfolioController.createPortfolio);
router.get('/get', auth, portfolioController.getPortfolio);

// Public routes
router.get('/user/:userId', portfolioController.getPortfolioByUserId);

module.exports = router;
