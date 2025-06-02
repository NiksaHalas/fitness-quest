// backend/src/models/Diary.js
const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Dodao sam polja za aktivnost, trajanje i intenzitet, kao što smo pominjali
    // Ako ne želiš ova polja, možeš ih ukloniti
    activityType: { // Npr. "Kardio", "Snaga", "Meditacija", "Šetnja", "Odmaranje"
        type: String,
        required: true
    },
    duration: { // Trajanje aktivnosti u minutama
        type: Number,
        required: true,
        min: 0
    },
    intensity: { // Npr. "Lako", "Srednje", "Visoko" ili brojčana skala
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    feeling: { // Emojiji ili tekstualni opis raspoloženja (npr. "srećan", "umoran", "energizovan")
        type: String,
        required: true
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true // Dodaje createdAt i updatedAt polja automatski
});

module.exports = mongoose.model('Diary', DiarySchema);
