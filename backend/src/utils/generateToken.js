// backend/src/utils/generateToken.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Funkcija za generisanje JSON Web Tokena (JWT).

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token ističe za 30 dana
    });
};

module.exports = generateToken;

