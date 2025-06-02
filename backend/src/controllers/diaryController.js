 
// backend/src/controllers/diaryController.js
const Diary = require('../models/Diary');

// @desc    Create a new diary entry
// @route   POST /api/diary
// @access  Private
exports.createDiaryEntry = async (req, res) => {
    const { feeling, notes } = req.body;
    const userId = req.user.id; // Dobijamo ID korisnika iz auth middleware-a

    try {
        const newEntry = new Diary({
            userId,
            feeling,
            notes
        });

        const entry = await newEntry.save();
        res.status(201).json(entry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greška pri kreiranju unosa u dnevnik' });
    }
};

// @desc    Get all diary entries for a user
// @route   GET /api/diary
// @access  Private
exports.getDiaryEntries = async (req, res) => {
    const userId = req.user.id;

    try {
        const entries = await Diary.find({ userId }).sort({ date: -1 });
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Greška pri dobavljanju unosa iz dnevnika' });
    }
};