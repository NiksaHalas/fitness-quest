// frontend/src/components/MissionCard.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Prikazuje pojedinačnu misiju sa opcijom za kompletiranje.

import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // PROVERI DA LI JE OVAJ IMPORT ISPRAVAN I POSTOJI

const MissionCard = ({ mission, onCompleteMission }) => {
  const { name, description, xpReward, isCompleted } = mission; // IZMENJENO: Uklonjen 'type' iz destrukturiranja jer nije korišćen

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3, borderRadius: '8px' }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#66bb6a' }}>
            XP nagrada: {xpReward}
          </Typography>
          {isCompleted ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleOutlineIcon />}
              disabled
            >
              Kompletirano
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onCompleteMission(mission._id)}
            >
              Kompletiraj
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MissionCard;