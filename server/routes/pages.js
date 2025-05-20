const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('LoginPage'));
router.get('/register', (req, res) => res.render('RegisterPage'));
router.get('/dashboard', (req, res) => res.render('DashboardPage'));
router.get('/portfolio', (req, res) => res.render('PortfolioPage'));
router.get('/bot-config', (req, res) => res.render('BotConfigPage'));

module.exports = router;
