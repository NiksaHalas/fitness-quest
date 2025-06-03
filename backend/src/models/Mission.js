// backend/src/models/Mission.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Mongoose model za misije.

const mongoose = require('mongoose');

const missionSchema = mongoose.Schema(
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
        xpReward: {
            type: Number,
            required: true,
            default: 10, // Podrazumevana XP nagrada
        },
        isDaily: {
            type: Boolean,
            default: false,
        },
        completedBy: [ // KLJUČNA PROMENA: Definisano kao niz ObjectId-ja korisnika
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        // Dodaj druga polja ako su potrebna (npr. category, prerequisites, etc.)
    },
    {
        timestamps: true,
    }
);

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
