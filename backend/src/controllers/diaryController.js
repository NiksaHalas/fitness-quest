// backend/src/controllers/diaryController.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Kontroleri za upravljanje unosima u dnevnik.

const asyncHandler = require('express-async-handler');
const Diary = require('../models/Diary'); // KLJUČNA PROMENA: Uvezi Diary model

// @desc    Create a new diary entry
// @route   POST /api/diary
// @access  Private
const createDiaryEntry = asyncHandler(async (req, res) => {
    const { title, notes, mood, date } = req.body;
    const userId = req.user.id;

    if (!title || !mood) {
        res.status(400);
        throw new Error('Molimo unesite naslov i raspoloženje za unos u dnevnik.');
    }

    const newEntry = new Diary({ // KLJUČNA PROMENA: Koristi Diary
        userId,
        title,
        notes,
        mood,
        date: date || Date.now()
    });

    const entry = await newEntry.save();
    res.status(201).json(entry);
});

// @desc    Get all diary entries for a user
// @route   GET /api/diary
// @access  Private
const getDiaryEntries = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const entries = await Diary.find({ userId }).sort({ date: -1 }); // KLJUČNA PROMENA: Koristi Diary
    res.status(200).json(entries);
});

// @desc    Update a diary entry
// @route   PUT /api/diary/:id
// @access  Private
const updateDiaryEntry = asyncHandler(async (req, res) => {
    const { title, notes, mood, date } = req.body;
    const entryId = req.params.id;
    const userId = req.user.id;

    let entry = await Diary.findById(entryId); // KLJUČNA PROMENA: Koristi Diary

    if (!entry) {
        res.status(404);
        throw new Error('Unos u dnevnik nije pronađen.');
    }

    if (entry.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da ažurirate ovaj unos.');
    }

    entry.title = title || entry.title;
    entry.notes = notes !== undefined ? notes : entry.notes;
    entry.mood = mood || entry.mood;
    entry.date = date ? new Date(date) : entry.date;

    const updatedEntry = await entry.save();
    res.status(200).json(updatedEntry);
});

// @desc    Delete a diary entry
// @route   DELETE /api/diary/:id
// @access  Private
const deleteDiaryEntry = asyncHandler(async (req, res) => {
    const entryId = req.params.id;
    const userId = req.user.id;

    const entry = await Diary.findById(entryId); // KLJUČNA PROMENA: Koristi Diary

    if (!entry) {
        res.status(404);
        throw new Error('Unos u dnevnik nije pronađen.');
    }

    if (entry.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da obrišete ovaj unos.');
    }

    await entry.deleteOne();
    res.status(200).json({ message: 'Unos u dnevnik uspešno obrisan.' });
});

module.exports = {
    createDiaryEntry,
    getDiaryEntries,
    updateDiaryEntry,
    deleteDiaryEntry
};