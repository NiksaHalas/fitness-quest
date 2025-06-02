 
// backend/src/models/Activity.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    caloriesBurned: {
        type: Number
    },
    intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);