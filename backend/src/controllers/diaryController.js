// backend/src/controllers/diaryController.js
const asyncHandler = require('express-async-handler'); // Dodaj asyncHandler
const Diary = require('../models/Diary');

// @desc    Create a new diary entry
// @route   POST /api/diary
// @access  Private
const createDiaryEntry = asyncHandler(async (req, res) => {
    // Dodao sam activityType, duration, intensity
    const { date, feeling, notes, activityType, duration, intensity } = req.body;
    const userId = req.user.id; // Dobijamo ID korisnika iz auth middleware-a

    // Provera da li su sva obavezna polja prisutna
    if (!feeling || !activityType || duration === undefined || !intensity) {
        res.status(400);
        throw new Error('Molimo popunite sva obavezna polja: Raspoloženje, Tip aktivnosti, Trajanje, Intenzitet.');
    }

    // Kreiraj novi unos u dnevnik
    const newEntry = new Diary({
        userId,
        date: date || Date.now(), // Omogući slanje datuma, inače koristi trenutni
        feeling,
        notes,
        activityType,
        duration,
        intensity
    });

    const entry = await newEntry.save();
    res.status(201).json(entry);
});

// @desc    Get all diary entries for a user
// @route   GET /api/diary
// @access  Private
const getDiaryEntries = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const entries = await Diary.find({ userId }).sort({ date: -1 }); // Sortiraj po datumu opadajuće
    res.json(entries);
});

module.exports = {
    createDiaryEntry,
    getDiaryEntries
};