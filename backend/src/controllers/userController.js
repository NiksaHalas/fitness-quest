// backend/src/controllers/userController.js
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Kontroleri za upravljanje korisničkim podacima i statistikama.

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Diary = require('../models/Diary');
const Badge = require('../models/Badge'); // DODATO: Uvezi Badge model

// @desc    Dohvati podatke o prijavljenom korisniku i njegove statistike
// @route   GET /api/user/profile
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Dohvati korisnika i populiraj osvojene značke
    const user = await User.findById(userId)
                           .populate('badges') // DODATO: Populiraj 'badges' polje
                           .select('-password');

    if (!user) {
        res.status(404);
        throw new Error('Korisnik nije pronađen');
    }

    const activities = await Activity.find({ userId }).sort({ date: -1 });
    const diaryEntries = await Diary.find({ userId }).sort({ date: -1 });

    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        badges: user.badges || [], // Vrati populirane značke
        activities: activities || [],
        diaryEntries: diaryEntries || []
    });
});

module.exports = {
    getMe,
};
