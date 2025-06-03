// backend/src/controllers/reminderController.js
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Kontroleri za upravljanje podsetnicima.

const asyncHandler = require('express-async-handler');
const Reminder = require('../models/Reminder');

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = asyncHandler(async (req, res) => {
    const { title, description, dateTime } = req.body;
    const userId = req.user.id;

    if (!title || !dateTime) {
        res.status(400);
        throw new Error('Molimo unesite naslov i datum/vreme za podsetnik.');
    }

    const newReminder = new Reminder({
        userId,
        title,
        description,
        dateTime: new Date(dateTime) // Konvertuj string u Date objekat
    });

    const reminder = await newReminder.save();
    res.status(201).json(reminder);
});

// @desc    Get all reminders for a user
// @route   GET /api/reminders
// @access  Private
const getReminders = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Dohvati podsetnike, sortiraj po datumu/vremenu uzlazno (najraniji prvi)
    // Možeš dodati filter za isCompleted: false ako želiš samo aktivne podsetnike
    const reminders = await Reminder.find({ userId }).sort({ dateTime: 1 });
    res.status(200).json(reminders);
});

// @desc    Update a reminder (e.g., mark as completed)
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = asyncHandler(async (req, res) => {
    const { title, description, dateTime, isCompleted } = req.body;
    const reminderId = req.params.id;
    const userId = req.user.id;

    let reminder = await Reminder.findById(reminderId);

    if (!reminder) {
        res.status(404);
        throw new Error('Podsetnik nije pronađen.');
    }

    // Proveri da li korisnik poseduje podsetnik
    if (reminder.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da ažurirate ovaj podsetnik.');
    }

    reminder.title = title || reminder.title;
    reminder.description = description || reminder.description;
    reminder.dateTime = dateTime ? new Date(dateTime) : reminder.dateTime;
    reminder.isCompleted = isCompleted !== undefined ? isCompleted : reminder.isCompleted;

    const updatedReminder = await reminder.save();
    res.status(200).json(updatedReminder);
});

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = asyncHandler(async (req, res) => {
    const reminderId = req.params.id;
    const userId = req.user.id;

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
        res.status(404);
        throw new Error('Podsetnik nije pronađen.');
    }

    // Proveri da li korisnik poseduje podsetnik
    if (reminder.userId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error('Niste autorizovani da obrišete ovaj podsetnik.');
    }

    await reminder.deleteOne(); // Koristi deleteOne() za brisanje dokumenta
    res.status(200).json({ message: 'Podsetnik uspešno obrisan.' });
});

module.exports = {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder
};
