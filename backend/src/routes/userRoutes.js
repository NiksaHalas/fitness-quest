// backend/src/routes/userRoutes.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Rute za upravljanje korisnicima (registracija, prijava, profil).

const express = require('express');
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController'); // Uvezi funkcije iz userController
const protect = require('../middleware/authMiddleware'); // Za zaštitu ruta

const router = express.Router();

// Registracija novog korisnika
router.post('/', registerUser);

// Prijava korisnika
router.post('/login', authUser);

// Dohvatanje i ažuriranje korisničkog profila (zaštićeno)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
