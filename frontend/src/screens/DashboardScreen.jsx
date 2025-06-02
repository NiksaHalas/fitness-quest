// frontend/src/screens/DashboardScreen.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Glavni dashboard za prijavljenog korisnika, prikazuje XP, Avatar, Misije, Statistiku.

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Alert, Paper, Container } from '@mui/material';
import XPBar from '../components/XPBar';
import AvatarDisplay from '../components/AvatarDisplay';
import MissionCard from '../components/MissionCard';
import StatsDashboard from '../components/StatsDashboard';
import axios from 'axios';

const DashboardScreen = () => {
  // Stanja za podatke korisnika, misije, loading i greške
  const [userInfo, setUserInfo] = useState(null);
  const [missions, setMissions] = useState([]);
  const [activities, setActivities] = useState([]); // DODATO: Stanje za aktivnosti
  const [diaryEntries, setDiaryEntries] = useState([]); // DODATO: Stanje za unose u dnevnik

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Funkcija za dohvatanje podataka sa backend-a
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!storedUserInfo || !storedUserInfo.token) {
          setError('Niste prijavljeni. Molimo prijavite se.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${storedUserInfo.token}`,
          },
        };

        // Dohvatanje podataka o korisniku (npr. nivo, xp)
        const { data: userData } = await axios.get('http://localhost:5000/api/user/profile', config);
        setUserInfo(userData);

        // Dohvatanje misija
        const { data: missionsData } = await axios.get('http://localhost:5000/api/missions', config);
        setMissions(missionsData);

        // DODATO: Dohvatanje unosa iz dnevnika
        const { data: diaryData } = await axios.get('http://localhost:5000/api/diary', config);
        setDiaryEntries(diaryData);

        // Za sada nemamo posebnu rutu za aktivnosti, ali bismo je dodali ovde
        // const { data: activitiesData } = await axios.get('http://localhost:5000/api/activities', config);
        // setActivities(activitiesData);

        setLoading(false);
      } catch (err) {
        console.error("Greška pri dohvatanju podataka:", err);
        setError(err.response && err.response.data.message
          ? err.response.data.message
          : 'Došlo je do greške pri dohvatanju podataka.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCompleteMission = async (missionId) => {
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };

      await axios.post(`http://localhost:5000/api/missions/complete/${missionId}`, {}, config);

      setMissions(prevMissions =>
        prevMissions.map(mission =>
          mission._id === missionId ? { ...mission, isCompleted: true } : mission
        )
      );

      const completedMission = missions.find(m => m._id === missionId);
      if (completedMission) {
        setUserInfo(prevInfo => ({
          ...prevInfo,
          xp: prevInfo.xp + completedMission.xpReward
        }));
      }
    } catch (err) {
      console.error("Greška pri kompletiranju misije:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri kompletiranju misije.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Učitavanje podataka...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Moj Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Kolona za Avatar i XP Bar */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3, borderRadius: '8px' }}>
            {userInfo && <AvatarDisplay level={userInfo.level || 1} />}
            {userInfo && <XPBar
              currentXp={userInfo.xp || 0}
              level={userInfo.level || 1}
              xpToNextLevel={userInfo.xpToNextLevel || 100}
            />}
          </Paper>
        </Grid>

        {/* Kolona za Misije */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, boxShadow: 3, borderRadius: '8px' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Dostupne Misije
            </Typography>
            <Grid container spacing={2}>
              {missions.length > 0 ? (
                missions.map((mission) => (
                  <Grid item xs={12} sm={6} md={4} key={mission._id}>
                    <MissionCard mission={mission} onCompleteMission={handleCompleteMission} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
                    Nema dostupnih misija.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Kolona za Statistiku (puna širina ispod) */}
        <Grid item xs={12}>
          <StatsDashboard userData={userInfo} activities={activities} diaryEntries={diaryEntries} /> {/* PROSLEDJENO: activities, diaryEntries */}
        </Grid>

      </Grid>
    </Container>
  );
};

export default DashboardScreen;
