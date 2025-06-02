 
// frontend/src/components/XPBar.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Prikazuje nivo i XP progres bar korisnika.

import React from 'react';

const XPBar = ({ currentXp, level, xpToNextLevel }) => {
  const progressPercentage = (currentXp / xpToNextLevel) * 100;

  return (
    <div style={{ margin: '1rem 0', textAlign: 'left', width: '100%' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333' }}>
        Nivo: {level}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.5rem' }}>
        XP: {currentXp} / {xpToNextLevel}
      </p>
      <div style={{
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '0.25rem', // rounded
        overflow: 'hidden'
      }}>
        <div style={{
          height: '1.5rem',
          width: `${progressPercentage}%`,
          backgroundColor: '#4caf50', // zelena boja
          borderRadius: '0.25rem',
          transition: 'width 0.5s ease-in-out'
        }}></div>
      </div>
    </div>
  );
};

export default XPBar;