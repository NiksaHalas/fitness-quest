// frontend/src/screens/DashboardScreen.jsx
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Glavni dashboard za prijavljenog korisnika, prikazuje XP, Avatar, Misije, Statistiku, Značke i Podsetnike sa savršenim poravnanjem koristeći Flexbox.

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Container, Snackbar, List, ListItem, ListItemText } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import XPBar from '../components/XPBar';
import AvatarDisplay from '../components/AvatarDisplay';
import MissionCard from '../components/MissionCard';
import StatsDashboard from '../components/StatsDashboard';
import axios from 'axios';
import { format, parseISO, isFuture, isPast, differenceInMinutes } from 'date-fns';
import { useTheme } from '@mui/material/styles';

// Pomoćna komponenta za prikaz značke (dodatno stilizovana)
const BadgeDisplay = ({ badge }) => {
  const theme = useTheme();
  return (
    <Box sx={{
      textAlign: 'center',
      m: 1,
      p: 1.5,
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '80px',
      maxWidth: '100px',
      flexShrink: 0,
    }}>
      <img src={badge.imageUrl} alt={badge.name} style={{ width: 50, height: 50, borderRadius: '50%', border: `2px solid ${theme.palette.secondary.main}` }} />
      <Typography variant="caption" display="block" sx={{ mt: 0.8, fontWeight: 'medium', color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
        {badge.name}
      </Typography>
    </Box>
  );
};

const DashboardScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [missions, setMissions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifiedReminderIds, setNotifiedReminderIds] = useState([]);
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const fetchUserData = useCallback(async () => {
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

      const { data: userData } = await axios.get('http://localhost:5000/api/user/profile', config);
      // KLJUČNA PROMENA: Izračunaj xpToNextLevel za trenutni nivo korisnika
      const xpRequiredForCurrentLevel = userData.level * 100; // Pretpostavljena logika, uskladiti sa backendom
      setUserInfo({ ...userData, xpToNextLevel: xpRequiredForCurrentLevel });


      const { data: missionsData } = await axios.get('http://localhost:5000/api/missions', config);
      setMissions(missionsData);

      const { data: diaryData } = await axios.get('http://localhost:5000/api/diary', config);
      setDiaryEntries(diaryData);

      const { data: remindersData } = await axios.get('http://localhost:5000/api/reminders', config);
      const upcomingReminders = remindersData.filter(r => isFuture(parseISO(r.dateTime)) && !r.isCompleted);
      setReminders(upcomingReminders);

      try {
        const { data: activitiesData } = await axios.get('http://localhost:5000/api/activities', config);
        setActivities(activitiesData);
      } catch (activityErr) {
        console.warn("Nije moguće dohvatiti aktivnosti. Ruta /api/activities možda ne postoji ili je prazna.", activityErr);
        setActivities([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Greška pri dohvatanju podataka:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Došlo je do greške pri dohvatanju podataka.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const reminderCheckInterval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        const reminderTime = parseISO(reminder.dateTime);
        if (isPast(reminderTime) && differenceInMinutes(now, reminderTime) <= 1 && !notifiedReminderIds.includes(reminder._id) && !reminder.isCompleted) {
          setSnackbarMessage(`PODSETNIK: ${reminder.title} - ${reminder.description || 'Vreme je za vežbanje!'}`);
          setSnackbarSeverity('info');
          setSnackbarOpen(true);
          setNotifiedReminderIds(prevIds => [...prevIds, reminder._id]);
        }
      });
    }, 30000);

    return () => clearInterval(reminderCheckInterval);
  }, [reminders, notifiedReminderIds]);

  const handleCompleteMission = async (missionId) => {
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };

      const { data } = await axios.post(`http://localhost:5000/api/missions/complete/${missionId}`, {}, config);

      setMissions(prevMissions =>
        prevMissions.map(mission =>
          mission._id === missionId ? { ...mission, isCompleted: true } : mission
        )
      );

      // KLJUČNA PROMENA: Ažuriraj userInfo sa podacima iz backend-a
      setUserInfo(prevInfo => ({
        ...prevInfo,
        xp: data.userXp,
        level: data.userLevel,
        xpToNextLevel: data.xpToNextLevel, // Dodato xpToNextLevel
        badges: data.newlyAwardedBadges ? [...(prevInfo.badges || []), ...data.newlyAwardedBadges] : prevInfo.badges // Dodato za značke
      }));

      if (data.newlyAwardedBadges && data.newlyAwardedBadges.length > 0) {
        const badgeNames = data.newlyAwardedBadges.map(b => b.name).join(', ');
        setSnackbarMessage(`Čestitamo! Osvojili ste značke: ${badgeNames}!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(`Misija kompletirana! Dobili ste ${data.xpGained} XP.`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }

      // Ako je došlo do level up-a, prikaži obaveštenje
      if (data.userLevel > data.userLevelBefore) {
        setSnackbarMessage(`Čestitamo! Dostigli ste NIVO ${data.userLevel}!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }

    } catch (err) {
      console.error("Greška pri kompletiranju misije:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri kompletiranju misije.');
      setSnackbarMessage(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri kompletiranju misije.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ ml: 2, color: 'text.primary' }}>Učitavanje podataka...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: { xs: 3, md: 5 }, color: theme.palette.primary.light }}>
        Moj Dashboard
      </Typography>

      {/* Glavni Flex kontejner za sve sekcije */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 4 }, // Razmak između redova
      }}>

        {/* Prvi red: Avatar/XP i Misije */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack na mobilnom, red na desktopu
          gap: { xs: 2, md: 4 },
          alignItems: 'stretch', // Osigurava da se kartice rastegnu po visini
        }}>
          {/* Avatar/XP kartica */}
          <Box sx={{
            flex: { xs: '1 1 100%', md: '0 0 33.33%' }, // Zauzima 1/3 širine na desktopu
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              minHeight: '300px', // Povećana fiksna minimalna visina za poravnanje sa misijama
              justifyContent: 'center', // Centriraj sadržaj vertikalno
              textAlign: 'center', // Centriraj tekst horizontalno
            }}>
              {userInfo && <AvatarDisplay level={userInfo.level || 1} />}
              <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {userInfo && <XPBar
                  currentXp={userInfo.xp || 0}
                  level={userInfo.level || 1}
                  xpToNextLevel={userInfo.xpToNextLevel || 100}
                />}
                <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.light }}>
                    Nivo: {userInfo?.level || 1}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    XP: {userInfo?.xp || 0}/{userInfo?.xpToNextLevel || 100}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Misije kartica */}
          <Box sx={{
            flex: { xs: '1 1 100%', md: '1 1 66.66%' }, // Zauzima 2/3 širine na desktopu
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              flexGrow: 1,
              minHeight: '300px', // Ista fiksna visina kao Avatar/XP kartica
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 } }}>
                Dostupne Misije
              </Typography>
              {/* Unutrašnji Flex kontejner za misije */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-start' }}>
                {missions.length > 0 ? (
                  missions.map((mission) => (
                    <Box key={mission._id} sx={{ flex: '0 0 calc(33.33% - 16px)', maxWidth: 'calc(33.33% - 16px)', // 3 kolone na desktopu
                                                  '@media (max-width:900px)': { flex: '0 0 calc(50% - 16px)', maxWidth: 'calc(50% - 16px)' }, // 2 kolone na tabletu
                                                  '@media (max-width:600px)': { flex: '1 1 100%', maxWidth: '100%' } // 1 kolona na mobilnom
                                                }}>
                      <MissionCard mission={mission} onCompleteMission={handleCompleteMission} />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ ml: { xs: 1, md: 2 } }}>
                    Nema dostupnih misija.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Drugi red: Značke i Nadolazeći Podsetnici */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack na mobilnom, red na desktopu
          gap: { xs: 2, md: 4 },
          alignItems: 'stretch', // Osigurava da se kartice rastegnu po visini
        }}>
          {/* Značke kartica */}
          <Box sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' }, // Zauzima 1/2 širine na desktopu
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              flexGrow: 1,
              minHeight: '250px', // Fiksna minimalna visina za poravnanje
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 }, textAlign: 'center' }}>
                Osvojene Značke
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 1, md: 2 } }}>
                {userInfo?.badges && userInfo.badges.length > 0 ? (
                  userInfo.badges.map((badge) => (
                    // KLJUČNA PROMENA: Proveri da li je badge objekat pre nego što ga proslediš
                    typeof badge === 'object' && badge !== null && badge._id ? (
                      <BadgeDisplay key={badge._id} badge={badge} />
                    ) : (
                      // Fallback za značke koje nisu objekti (npr. samo ID)
                      <Typography key={badge} variant="caption" sx={{ m: 1, color: theme.palette.text.secondary }}>Značka ID: {badge}</Typography>
                    )
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Još uvek nema osvojenih znački. Kompletirajte misije!
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Nadolazeći Podsetnici kartica */}
          <Box sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' }, // Zauzima 1/2 širine na desktopu
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper sx={{
              p: { xs: 2, md: 3 },
              flexGrow: 1,
              minHeight: '250px', // Ista fiksna visina kao Značke kartica
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: theme.palette.primary.light, mb: { xs: 2, md: 3 }, textAlign: 'center' }}>
                Nadolazeći Podsetnici
              </Typography>
              {reminders.length > 0 ? (
                <List sx={{ width: '100%' }}>
                  {reminders.slice(0, 3).map((reminder) => (
                    <ListItem key={reminder._id} divider sx={{ mb: 1, borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', '&:last-child': { mb: 0 } }}>
                      <ListItemText
                        primary={<Typography variant="body1" sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}>{reminder.title}</Typography>}
                        secondary={<Typography variant="body2" color="text.secondary">{format(parseISO(reminder.dateTime), 'dd.MM.yyyy. HH:mm')}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Nema nadolazećih podsetnika. Kreirajte ih u sekciji "Podsetnici"!
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Treći red: Statistika (puna širina) */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%', // Zauzima celu širinu
        }}>
          <StatsDashboard userData={userInfo} activities={activities || []} diaryEntries={diaryEntries || []} />
        </Box>
      </Box>

      {/* Snackbar za obaveštenja */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '8px', background: theme.palette.background.paper, color: theme.palette.text.primary }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default DashboardScreen;
