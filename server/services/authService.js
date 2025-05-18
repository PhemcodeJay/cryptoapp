const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

exports.register = async (email, password) => {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    return { id: user.id, email: user.email };
};

exports.login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    return jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: config.jwtExpires });
};