// backend/src/controllers/authController.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Kontroleri za autentifikaciju korisnika (registracija i prijava).

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Proveri da li korisnik postoji
    const user = await User.findOne({ email });

    // Proveri lozinku
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            xp: user.xp,
            level: user.level,
            // Popuni značke samo sa ID-jevima, detalji se popunjavaju na getUserProfile
            badges: user.badges,
            completedMissionsCount: user.completedMissionsCount,
        });
    } else {
        res.status(401);
        throw new Error('Nevažeći email ili lozinka');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('Korisnik sa tim emailom već postoji');
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            xp: user.xp,
            level: user.level,
            badges: user.badges,
            completedMissionsCount: user.completedMissionsCount,
        });
    } else {
        res.status(400);
        throw new Error('Nevažeći korisnički podaci');
    }
});

module.exports = {
    loginUser,
    registerUser,
};
