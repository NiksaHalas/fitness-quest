// backend/src/models/Diary.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Mongoose model za unos u dnevnik (Diary).

const mongoose = require('mongoose');

const diarySchema = mongoose.Schema( // Promenjeno u diarySchema
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Referencira User model
        },
        title: {
            type: String,
            required: [true, 'Molimo dodajte naslov unosa'],
        },
        notes: {
            type: String,
            required: false, // Beleške nisu obavezne
        },
        mood: {
            type: String,
            required: [true, 'Molimo odaberite raspoloženje'],
            enum: ['Odlično', 'Dobro', 'Neutralno', 'Loše', 'Užasno'], // Dozvoljene vrednosti raspoloženja
        },
        date: {
            type: Date,
            default: Date.now, // Podrazumevano trenutni datum i vreme
        },
    },
    {
        timestamps: true, // Automatski dodaj createdAt i updatedAt polja
    }
);

const Diary = mongoose.model('Diary', diarySchema); // Promenjeno u Diary model

module.exports = Diary;
