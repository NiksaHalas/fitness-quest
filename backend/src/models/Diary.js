 
// backend/src/models/Diary.js
const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    feeling: { // Emojiji ili tekstualni opis raspoloženja
        type: String,
        required: true
    },
    notes: {
        type: String,
        maxlength: 500
    }
});

module.exports = mongoose.model('Diary', DiarySchema);