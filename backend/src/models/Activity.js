// backend/src/models/Activity.js
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Model za aktivnosti korisnika.

const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { // Npr. "Trčanje", "Dizanje tegova", "Joga"
        type: String,
        required: true
    },
    activityType: { // Npr. "Kardio", "Snaga", "Fleksibilnost"
        type: String,
        required: true
    },
    duration: { // Trajanje aktivnosti u minutama
        type: Number,
        required: true,
        min: 0
    },
    caloriesBurned: { // Opciono
        type: Number
    },
    intensity: { // Npr. "Nizak", "Srednji", "Visok"
        type: String,
        enum: ['Nizak', 'Srednji', 'Visok'],
        default: 'Srednji'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);
