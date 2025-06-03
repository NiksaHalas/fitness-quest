// frontend/src/components/XPBar.jsx
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Prikazuje XP progres bar i nivo korisnika sa modernim dizajnom.

import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles'; // DODATO: styled i useTheme

// Stilovi za progres bar
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12, // Debljina bara
  borderRadius: 6, // Zaobljeni krajevi
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Tamna pozadina bara
  '& .MuiLinearProgress-bar': {
    borderRadius: 6,
    // Gradijent za progres bar
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    transition: 'width 0.5s ease-in-out', // Glatka animacija
  },
}));

const XPBar = ({ currentXp, level, xpToNextLevel }) => {
  const theme = useTheme(); // Pristup temi

  const progress = (currentXp / xpToNextLevel) * 100;

  return (
    <Box sx={{ width: '100%', mt: 2, mb: 1, px: 2 }}> {/* Dodatni horizontalni padding */}
      <StyledLinearProgress variant="determinate" value={progress} />
      {/* Tekst za XP i nivo je sada direktno u DashboardScreen.jsx, ali ostavljam ovde za referencu ako se predomisliš */}
      {/*
      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: theme.palette.text.secondary }}>
        XP: {currentXp}/{xpToNextLevel}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.5, textAlign: 'center', fontWeight: 'bold', color: theme.palette.primary.light }}>
        Nivo: {level}
      </Typography>
      */}
    </Box>
  );
};

export default XPBar;
