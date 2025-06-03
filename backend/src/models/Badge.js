// backend/src/models/Badge.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Mongoose model za značke (Achievements).

const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: { // URL ili referenca na SVG ikonu (može biti i prazno ako je inline SVG)
            type: String,
            required: false,
        },
        requiredLevel: { // Nivo koji je potreban za ovu značku
            type: Number,
            required: false, // Neke značke možda nisu vezane za nivo
            default: 0,
        },
        requiredMissions: { // Broj završenih misija za ovu značku
            type: Number,
            required: false,
            default: 0,
        },
        // Mogu se dodati i drugi kriterijumi za značke (npr. requiredActivities, etc.)
    },
    {
        timestamps: true,
    }
);

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
