 
// frontend/src/components/AvatarDisplay.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Prikazuje vizualni prikaz avatara korisnika.

import React from 'react';
import { Box, Typography } from '@mui/material';

// Primer URL-ova za slike avatara, koje ćeš zameniti svojim
const avatarImages = {
  1: 'https://via.placeholder.com/150/add8e6/000000?text=Avatar+L1', // Default, light blue background
  2: 'https://via.placeholder.com/150/87ceeb/000000?text=Avatar+L2', // Slightly darker blue
  3: 'https://via.placeholder.com/150/6495ed/ffffff?text=Avatar+L3', // Medium blue
  4: 'https://via.placeholder.com/150/4169e1/ffffff?text=Avatar+L4', // Royal blue
  // Dodaj još slika za više nivoa
};

const AvatarDisplay = ({ level }) => {
  const avatarSrc = avatarImages[level] || avatarImages[1]; // Vrati default ako nivo nema definisanu sliku

  return (
    <Box sx={{ my: 3, textAlign: 'center' }}>
      <img
        src={avatarSrc}
        alt={`Avatar Level ${level}`}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%', // Krug
          objectFit: 'cover',
          border: '4px solid #fdd835', // Žuti obruč
          boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        }}
      />
      <Typography variant="h5" component="h2" sx={{ mt: 2, color: '#333' }}>
        Tvoj Avatar
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Nivo {level}
      </Typography>
    </Box>
  );
};

export default AvatarDisplay;