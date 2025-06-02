 // backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    totalXpNeededForNextLevel: {
        type: Number,
        default: 100 // Primer, ovo se može dinamički izračunavati
    },
    badges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    }],
    avatarProgression: { // Može biti string (URL do slike) ili broj koji predstavlja fazu avatara
        type: String,
        default: 'default_avatar_stage_1.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Enkripcija lozinke pre snimanja
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Metoda za poređenje lozinki
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
