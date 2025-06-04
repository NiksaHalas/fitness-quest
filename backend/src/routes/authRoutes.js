// backend/src/routes/authRoutes.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Rute za autentifikaciju korisnika (registracija i prijava).

const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController'); // Uvezi funkcije iz authController

const router = express.Router();

// Ruta za registraciju
router.post('/register', registerUser);

// Ruta za prijavu
router.post('/login', loginUser);

module.exports = router;
