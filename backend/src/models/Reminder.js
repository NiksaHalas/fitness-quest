// backend/src/models/Reminder.js
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Model za podsetnike korisnika.

const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { // Npr. "Podsetnik za trčanje", "Podsetnik za jogu"
        type: String,
        required: true,
        maxlength: 100
    },
    description: { // Dodatni opis podsetnika
        type: String,
        maxlength: 500
    },
    dateTime: { // Datum i vreme podsetnika
        type: Date,
        required: true
    },
    isCompleted: { // Da li je podsetnik "odrađen"
        type: Boolean,
        default: false
    },
    // Opciono: Polja za ponavljanje podsetnika (npr. daily, weekly)
    // repeat: {
    //     type: String,
    //     enum: ['none', 'daily', 'weekly', 'monthly'],
    //     default: 'none'
    // },
    // lastTriggered: { // Poslednji put kada je podsetnik "aktiviran"
    //     type: Date
    // }
}, {
    timestamps: true // Dodaje createdAt i updatedAt
});

module.exports = mongoose.model('Reminder', ReminderSchema);
