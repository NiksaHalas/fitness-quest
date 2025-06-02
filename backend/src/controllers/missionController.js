// backend/src/controllers/missionController.js
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Kontroleri za upravljanje misijama (dohvatanje, kompletiranje, kreiranje).

const asyncHandler = require('express-async-handler');
const Mission = require('../models/Mission'); // Uvezi Mission model
const User = require('../models/User');     // Uvezi User model (za ažuriranje XP-a)

// @desc    Dohvati sve misije
// @route   GET /api/missions
// @access  Private
const getMissions = asyncHandler(async (req, res) => {
    let missions = await Mission.find({}); // Pokušaj da dohvatiš misije iz baze

    // Ako baza nema misija, kreiraj i sačuvaj dummy misije
    if (missions.length === 0) {
        const dummyMissions = [
            { name: 'Dnevna Misija: 30 čučnjeva', description: 'Uradi 30 čučnjeva.', xpReward: 10, type: 'daily' },
            { name: 'Vežba Snage: 50 sklekova', description: 'Uradi 50 sklekova u jednom danu.', xpReward: 25, type: 'weekly' },
            { name: 'Kardio Izazov: 30 min trčanja', description: 'Trči 30 minuta bez prestanka.', xpReward: 20, type: 'daily' },
            { name: 'Meditacija: 15 minuta', description: 'Posvetite 15 minuta meditaciji ili vežbama disanja.', xpReward: 15, type: 'daily' },
            { name: 'Hidratacija: 2L vode', description: 'Popij 2 litre vode tokom dana.', xpReward: 5, type: 'daily' },
        ];
        
        // Sačuvaj dummy misije u bazu
        missions = await Mission.insertMany(dummyMissions);
        console.log('Dummy misije kreirane i sačuvane u bazi.');
    }

    // Sada kada smo sigurni da misije postoje u bazi, dohvati ih ponovo
    // ili koristi već dohvaćene ako su upravo kreirane.
    // Za demo, pretpostavljamo da su sve misije dostupne i da se isCompleted status prati na frontendu
    // ili u nekom drugom modelu (npr. UserMissionStatus).
    // Za sada, isCompleted je default false u Mission modelu.
    res.status(200).json(missions);
});

// @desc    Kompletiraj misiju
// @route   POST /api/missions/complete/:id
// @access  Private
const completeMission = asyncHandler(async (req, res) => {
    const missionId = req.params.id; // ID misije iz URL-a
    const userId = req.user._id;     // ID prijavljenog korisnika iz auth middleware-a

    // Pronađi misiju u bazi
    const mission = await Mission.findById(missionId);

    if (!mission) {
        res.status(404);
        throw new Error('Misija nije pronađena.');
    }

    // Pronađi korisnika
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('Korisnik nije pronađen.');
    }

    // Ažuriraj korisnikov XP
    user.xp = (user.xp || 0) + mission.xpReward;

    // Logika za level up
    // Pretpostavljamo da je za svaki nivo potrebno 100 XP
    // Ovo se može prilagoditi (npr. eksponencijalno povećanje XP-a po nivou)
    const xpNeededForNextLevel = user.level * 100; // Primer: 100 XP za nivo 1, 200 za nivo 2, itd.
    if (user.xp >= xpNeededForNextLevel) {
        user.level += 1;
        user.xp -= xpNeededForNextLevel; // Oduzmi XP potreban za prethodni nivo
        // Ažuriraj xpNeededForNextLevel u User modelu ako je potrebno
        // user.xpToNextLevel = (user.level + 1) * 100;
    }

    await user.save(); // Sačuvaj ažuriranog korisnika u bazi

    // Opciono: Ažurirati status misije za korisnika (npr. u zasebnoj kolekciji UserMissionStatus)
    // Za sada, samo vraćamo poruku o uspehu i ažurirani XP.

    res.status(200).json({
        message: `Misija "${mission.name}" kompletirana! Dobio si ${mission.xpReward} XP.`,
        userXp: user.xp,
        userLevel: user.level
    });
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
