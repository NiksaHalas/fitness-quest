// backend/src/controllers/missionController.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Kontroleri za upravljanje misijama i logikom kompletiranja sa dodatnim logovanjem za debagovanje.

const asyncHandler = require('express-async-handler');
const Mission = require('../models/Mission');
const User = require('../models/User');
const Badge = require('../models/Badge'); // Ispravna putanja za Badge model

// Funkcija za izračunavanje XP-a potrebnog za sledeći nivo
const calculateXpToNextLevel = (level) => {
    return level * 100;
};

// @desc    Get all missions
// @route   GET /api/missions
// @access  Private
const getMissions = asyncHandler(async (req, res) => {
    const missions = await Mission.find({});
    res.json(missions);
});

// @desc    Complete a mission
// @route   POST /api/missions/complete/:id
// @access  Private
const completeMission = asyncHandler(async (req, res) => {
    const missionId = req.params.id;
    const userId = req.user.id;

    console.log(`[DEBUG] Attempting to complete mission: ${missionId} for user: ${userId}`);

    const mission = await Mission.findById(missionId);
    if (!mission) {
        console.error(`[DEBUG] Mission not found: ${missionId}`);
        res.status(404);
        throw new Error('Misija nije pronađena.');
    }
    console.log(`[DEBUG] Mission found: ${mission.name}`);

    const user = await User.findById(userId);
    if (!user) {
        console.error(`[DEBUG] User not found: ${userId}`);
        res.status(404);
        throw new Error('Korisnik nije pronađen.');
    }
    console.log(`[DEBUG] User found: ${user.username}, current XP: ${user.xp}, level: ${user.level}`);

    // Proveri da li je misija već kompletirana od strane ovog korisnika
    if (mission.completedBy && mission.completedBy.includes(userId)) {
        console.warn(`[DEBUG] Mission ${missionId} already completed by user ${userId}`);
        res.status(400);
        throw new Error('Misija je već kompletirana.');
    }
    console.log(`[DEBUG] Mission not yet completed by user. Proceeding.`);

    // Ažuriraj misiju: dodaj korisnika u completedBy
    mission.completedBy.push(userId);
    await mission.save();
    console.log(`[DEBUG] Mission ${mission.name} updated with completedBy user.`);

    // Ažuriraj korisnika: dodaj XP, proveri nivo, dodeli značke
    user.xp += mission.xpReward;
    user.completedMissionsCount += 1;

    let xpGained = mission.xpReward;
    let newlyAwardedBadges = [];
    let userLevelBefore = user.level;

    console.log(`[DEBUG] User XP after mission: ${user.xp}, completed missions count: ${user.completedMissionsCount}`);

    // Logika za level up
    let xpRequiredForCurrentLevel = calculateXpToNextLevel(user.level);
    console.log(`[DEBUG] Initial XP required for current level (${user.level}): ${xpRequiredForCurrentLevel}`);

    while (user.xp >= xpRequiredForCurrentLevel) {
        console.log(`[DEBUG] User XP (${user.xp}) >= XP required for level ${user.level} (${xpRequiredForCurrentLevel}). Leveling up!`);
        user.xp -= xpRequiredForCurrentLevel;
        user.level += 1;
        xpRequiredForCurrentLevel = calculateXpToNextLevel(user.level);
        console.log(`[DEBUG] New level: ${user.level}, XP remaining: ${user.xp}, XP required for next level: ${xpRequiredForCurrentLevel}`);

        // Proveri da li novi nivo donosi značku
        const badgeForLevel = await Badge.findOne({ requiredLevel: user.level });
        if (badgeForLevel) {
            console.log(`[DEBUG] Found badge for new level ${user.level}: ${badgeForLevel.name}`);
            if (!user.badges.includes(badgeForLevel._id)) {
                user.badges.push(badgeForLevel._id);
                newlyAwardedBadges.push(badgeForLevel);
                console.log(`[DEBUG] Awarded new level badge: ${badgeForLevel.name}`);
            } else {
                console.log(`[DEBUG] User already has badge for level ${user.level}.`);
            }
        } else {
            console.log(`[DEBUG] No badge found for new level ${user.level}.`);
        }
    }

    // Proveri značke koje se dodeljuju na osnovu broja završenih misija
    console.log(`[DEBUG] Checking for badges based on completed missions count (${user.completedMissionsCount}).`);
    const badgesForCompletedMissions = await Badge.find({ requiredMissions: { $lte: user.completedMissionsCount } });
    for (const badge of badgesForCompletedMissions) {
        if (!user.badges.includes(badge._id)) {
            user.badges.push(badge._id);
            newlyAwardedBadges.push(badge);
            console.log(`[DEBUG] Awarded new mission count badge: ${badge.name}`);
        } else {
            console.log(`[DEBUG] User already has badge for mission count: ${badge.name}.`);
        }
    }
    console.log(`[DEBUG] Newly awarded badges (IDs): ${newlyAwardedBadges.map(b => b._id)}`);

    await user.save();
    console.log(`[DEBUG] User saved successfully.`);

    const xpToNextLevel = calculateXpToNextLevel(user.level);

    // Popuni značke da bi se na frontendu prikazali detalji
    const populatedBadges = await Promise.all(newlyAwardedBadges.map(async badge => {
        return await Badge.findById(badge._id);
    }));
    console.log(`[DEBUG] Populated badges for response: ${populatedBadges.map(b => b.name)}`);

    res.json({
        message: 'Misija uspešno kompletirana!',
        userXp: user.xp,
        userLevel: user.level,
        xpToNextLevel: xpToNextLevel,
        xpGained: xpGained,
        newlyAwardedBadges: populatedBadges,
        userLevelBefore: userLevelBefore
    });
    console.log(`[DEBUG] Response sent.`);
});

module.exports = {
    getMissions,
    completeMission,
};
