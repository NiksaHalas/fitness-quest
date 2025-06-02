// backend/src/routes/diaryRoutes.js
const express = require('express');
const { createDiaryEntry, getDiaryEntries } = require('../controllers/diaryController');
const auth = require('../middleware/authMiddleware'); // Pretpostavljam da je auth middleware ispravno podešen
const router = express.Router();

// Ruta za kreiranje novog unosa u dnevnik
router.post('/', auth, createDiaryEntry);

// Ruta za dohvatanje svih unosa u dnevnik za prijavljenog korisnika
router.get('/', auth, getDiaryEntries);

module.exports = router;
