 // backend/src/routes/diaryRoutes.js
const express = require('express');
const { createDiaryEntry, getDiaryEntries } = require('../controllers/diaryController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, createDiaryEntry);
router.get('/', auth, getDiaryEntries);

module.exports = router;
