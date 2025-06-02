 
// backend/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Dodaj validaciju ovde (npr. proveri da li korisnik već postoji)
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Korisnik sa datim emailom već postoji' });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        // Generiši token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greška pri registraciji korisnika' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Nevažeći kredencijali' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greška pri prijavi korisnika' });
    }
};