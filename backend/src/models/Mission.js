 
// backend/src/models/Mission.js
const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    xpReward: {
        type: Number,
        required: true
    },
    type: { // 'daily' ili 'weekly'
        type: String,
        enum: ['daily', 'weekly'],
        required: true
    },
    isCompleted: { // Da li je misija kompletirana za datog korisnika u tekućem periodu
        type: Boolean,
        default: false
    },
    lastCompleted: { // Kada je misija poslednji put kompletirana (za resetovanje)
        type: Date
    },
    category: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility', 'nutrition', 'mindfulness'], // Primer kategorija
        default: 'strength'
    },
    // Referenca na korisnika za koga je misija vezana (ako su misije specifične za korisnike)
    // Ako su misije globalne, ali se status completion prati po korisniku, ovo može biti u User modelu
    // Za sada, pretpostavljamo da će se isCompleted i lastCompleted pratiti unutar User objekta,
    // ili u zasebnom junction modelu (UserMissionStatus) ako su misije fiksne.
    // Za jednostavnost, držimo ih kao fiksne misije, a user će imati referencu na completed ones.
});

module.exports = mongoose.model('Mission', MissionSchema);