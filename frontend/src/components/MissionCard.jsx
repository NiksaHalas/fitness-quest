// frontend/src/components/MissionCard.jsx
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Prikazuje pojedinačnu misiju sa modernim dizajnom i poboljšanim poravnanjem teksta.

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

const MissionCard = ({ mission, onCompleteMission }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Razmak između gornjeg bloka i dugmeta/statusa
        backgroundColor: mission.isCompleted ? 'rgba(3, 218, 198, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${mission.isCompleted ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.08)'}`,
        boxShadow: mission.isCompleted ? '0 6px 20px rgba(3, 218, 198, 0.2)' : '0 6px 20px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: mission.isCompleted ? 'none' : 'translateY(-5px)',
          boxShadow: mission.isCompleted ? '0 6px 20px rgba(3, 218, 198, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Kontejner za naslov, opis i XP nagradu */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}> {/* Dodato display:flex i flexDirection:column */}
        <Typography variant="h6" component="h3" gutterBottom sx={{ color: theme.palette.primary.light, fontWeight: 'bold', mb: 1.5 }}>
          {mission.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}> {/* Smanjen mb za bliže poravnanje */}
          {mission.description}
        </Typography>
        {/* KLJUČNA PROMENA: Uklonjen mt, oslanjamo se na mb od opisa */}
        <Typography variant="body2" sx={{ color: theme.palette.secondary.light, fontWeight: 'bold' }}>
          XP Nagrada: {mission.xpReward}
        </Typography>
      </Box>

      {mission.isCompleted ? (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: theme.palette.secondary.main }}>
          <CheckCircleIcon sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Kompletirano!
          </Typography>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onCompleteMission(mission._id)}
          sx={{ mt: 3, py: 1.2, fontSize: '0.9rem' }}
        >
          Kompletiraj Misiju
        </Button>
      )}
    </Paper>
  );
};

export default MissionCard;
