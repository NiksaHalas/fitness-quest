// backend/src/controllers/missionController.js (primer, možeš dodati prave podatke iz baze)
const asyncHandler = require('express-async-handler');
const Mission = require('../models/Mission'); // Pretpostavljam da imaš Mission model

// @desc    Dohvati sve misije
// @route   GET /api/missions
// @access  Private
const getMissions = asyncHandler(async (req, res) => {
    // Za početak, možemo vratiti hardkodovane misije ili prave iz baze
    // Kasnije možeš da filtriraš po korisniku, dnevnim misijama itd.
    const missions = await Mission.find({}); // Dohvati sve misije iz baze

    // Ako baza nema misija, dodaj par dummy misija za test
    if (missions.length === 0) {
        // Ovo je samo za demonstraciju, inače bi misije dodavao preko admin panela
        const dummyMissions = [
            { name: 'Dnevna Misija: 30 čučnjeva', description: 'Uradi 30 čučnjeva.', xpReward: 10, type: 'daily', isCompleted: false },
            { name: 'Vežba Snage: 50 sklekova', description: 'Uradi 50 sklekova u jednom danu.', xpReward: 25, type: 'weekly', isCompleted: false },
            { name: 'Kardio Izazov: 30 min trčanja', description: 'Trči 30 minuta bez prestanka.', xpReward: 20, type: 'daily', isCompleted: false },
        ];
        // Možeš ih i sačuvati u bazu ako želiš da budu trajne
        // await Mission.insertMany(dummyMissions);
        // res.status(200).json(dummyMissions);
        res.status(200).json(dummyMissions); // Vrati dummy misije bez snimanja
    } else {
        res.status(200).json(missions);
    }
});

// @desc    Kompletiraj misiju
// @route   POST /api/missions/complete/:id
// @access  Private
const completeMission = asyncHandler(async (req, res) => {
    const missionId = req.params.id;
    const userId = req.user._id; // ID prijavljenog korisnika

    const mission = await Mission.findById(missionId);
    if (!mission) {
        res.status(404);
        throw new Error('Misija nije pronađena');
    }

    // Proveriti da li je misija već kompletirana od strane korisnika,
    // i da li korisnik ima pravo da je kompletira (npr. samo jednom dnevno)
    // Za sada samo simuliramo uspeh
    const user = await User.findById(userId);
    if (user) {
        user.xp += mission.xpReward; // Dodaj XP
        // Logika za level up ako je potrebno
        if (user.xp >= (user.level * 100)) { // Primer: 100 XP po nivou
            user.level += 1;
            user.xp = user.xp - ((user.level -1) * 100); // Resetuj XP za novi nivo
        }
        await user.save();
    }


    res.status(200).json({ message: `Misija "${mission.name}" kompletirana! Dobio si ${mission.xpReward} XP.`, xpGained: mission.xpReward });
});

// @desc    Kreiraj novu misiju (Opciono, samo za admina)
// @route   POST /api/missions
// @access  Private/Admin
const createMission = asyncHandler(async (req, res) => {
    const { name, description, xpReward, type } = req.body;

    if (!name || !description || !xpReward || !type) {
        res.status(400);
        throw new Error('Molimo unesite sva polja za misiju');
    }

    const mission = await Mission.create({
        name,
        description,
        xpReward,
        type,
        isCompleted: false // Podrazumevano nije kompletirana
    });

    res.status(201).json(mission);
});


module.exports = {
    getMissions,
    createMission,
    completeMission,
};