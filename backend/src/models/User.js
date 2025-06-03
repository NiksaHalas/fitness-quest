// backend/src/models/User.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Mongoose model za korisnika sa XP-om, nivoom, značkama i brojačem misija.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        xp: {
            type: Number,
            default: 0,
        },
        level: {
            type: Number,
            default: 1,
        },
        badges: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Badge', // Referencira Badge model
            },
        ],
        completedMissionsCount: { // Dodato za statistiku
            type: Number,
            default: 0,
        },
        // Dodaj druga polja ako su potrebna (npr. avatar_url, goals, etc.)
    },
    {
        timestamps: true, // Automatski dodaje createdAt i updatedAt
    }
);

// Hashovanje lozinke pre čuvanja
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Metoda za poređenje lozinki
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
