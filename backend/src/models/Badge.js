 
// backend/src/models/Badge.js
const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: { // URL do slike značke
        type: String,
        default: 'default_badge.png'
    },
    type: { // Npr. 'continuity', 'milestone', 'challenge'
        type: String,
        enum: ['continuity', 'milestone', 'challenge'],
        default: 'milestone'
    },
    criteria: { // Opis kriterijuma za dodelu značke (npr. '7 dana uzastopnog vežbanja')
        type: String
    }
});

module.exports = mongoose.model('Badge', BadgeSchema);