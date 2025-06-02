// backend/src/routes/missionRoutes.js (proveri da li je ovakav)
const express = require('express');
const { getMissions, createMission, completeMission } = require('../controllers/missionController'); // Proveri funkcije
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getMissions); // Ruta za dohvatanje svih misija, zaštićena
router.post('/', protect, createMission); // Ruta za kreiranje misije (admin, ako postoji)
router.post('/complete/:id', protect, completeMission); // Ruta za kompletiranje misije

module.exports = router;