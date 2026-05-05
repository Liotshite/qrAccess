const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Render pages
router.get('/login', authController.renderLogin);
router.get('/dashboard', authController.requireAuth, authController.renderDashboard);

// API/Actions
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Root redirects to dashboard
router.get('/', (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;
