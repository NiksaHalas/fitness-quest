// backend/src/routes/userRoutes.js
const express = require('express');
const { getMe } = require('../controllers/userController'); // Dodato
const protect = require('../middleware/authMiddleware'); // Dodato
const router = express.Router();

// Ruta za dohvatanje podataka o prijavljenom korisniku
router.get('/profile', protect, getMe); // Zaštićena ruta

module.exports = router;