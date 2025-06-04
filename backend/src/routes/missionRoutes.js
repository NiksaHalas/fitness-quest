// backend/src/routes/missionRoutes.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Rute za upravljanje misijama, uključujući resetovanje dnevnih misija.

const express = require('express');
const { getMissions, completeMission, resetDailyMissions } = require('../controllers/missionController'); // KLJUČNO: Uvezi resetDailyMissions
const protect = require('../middleware/authMiddleware'); // Za zaštitu ruta
const router = express.Router();

// Ruta za dohvatanje svih misija
router.get('/', protect, getMissions);

// Ruta za kompletiranje misije
router.post('/complete/:id', protect, completeMission);

// Ruta za resetovanje dnevnih misija (za demo, dostupna prijavljenim korisnicima)
router.post('/reset-daily', protect, resetDailyMissions);

module.exports = router;
