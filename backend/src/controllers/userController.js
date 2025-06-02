// backend/src/controllers/userController.js
const asyncHandler = require('express-async-handler'); // Ako ga koristiš, inače ga ukloni
const User = require('../models/User');

// @desc    Dohvati podatke o prijavljenom korisniku
// @route   GET /api/user/profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user je dostupan zbog authMiddleware-a (protect funkcije)
    // On sadrži korisnika bez passworda
    if (req.user) {
        // Možeš dodati dodatne podatke ako je potrebno
        // Npr. proceniti xpToNextLevel ili poslati samo određene podatke
        res.status(200).json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            xp: req.user.xp,     // Pretpostavljamo da User model ima xp
            level: req.user.level // Pretpostavljamo da User model ima level
            // xpToNextLevel: req.user.level * 100 // Primer izračuna
        });
    } else {
        res.status(404).json({ message: 'Korisnik nije pronađen' });
    }
});

module.exports = {
    getMe,
};