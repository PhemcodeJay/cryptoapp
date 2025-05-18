const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.register(email, password);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);
        res.cookie('token', token, require('../config').cookieOptions);
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};