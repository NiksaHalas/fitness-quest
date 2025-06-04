// backend/src/models/Mission.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Mongoose model za misije sa dodatnim poljem za datum poslednjeg resetovanja.

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
            default: 150, // Podrazumevana XP nagrada
        },
        isDaily: { // Da li je misija dnevna (treba da se resetuje)
            type: Boolean,
            default: false,
        },
        completedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        lastResetDate: { // Datum poslednjeg resetovanja za dnevne misije
            type: Date,
            default: Date.now, // KLJUČNA PROMENA: Uvek inicijalizuj na trenutni datum
        },
    },
    {
        timestamps: true,
    }
);

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
