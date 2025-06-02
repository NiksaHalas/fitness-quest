// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Uzmi token iz headera
            token = req.headers.authorization.split(' ')[1];

            // Verifikuj token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Pronađi korisnika po ID-u iz tokena i dodaj ga u request objekat
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Nije autorizovano, token nevažeći' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Nije autorizovano, token nije pronađen' });
    }
};

module.exports = protect;