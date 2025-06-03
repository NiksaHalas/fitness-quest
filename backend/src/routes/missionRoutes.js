// backend/src/routes/missionRoutes.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Rute za upravljanje misijama.

const express = require('express');
const { getMissions, completeMission } = require('../controllers/missionController'); // KLJUČNO: Proveri da li su funkcije ispravno destrukturirane
const protect = require('../middleware/authMiddleware'); // Za zaštitu ruta
const router = express.Router();

// Ruta za dohvatanje svih misija
router.get('/', protect, getMissions);

// Ruta za kompletiranje misije
router.post('/complete/:id', protect, completeMission); // OVO JE LINIJA KOJA JE IZAZVALA GREŠKU

module.exports = router;
