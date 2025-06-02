// frontend/src/components/StatsDashboard.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Prikazuje statistiku korisnika i grafove napretka.

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
// Ako budeš koristio grafike, npr. Recharts ili Chart.js, ovde bi ih importovao
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsDashboard = ({ userData, activities, diaryEntries }) => {
  // Primer dummy podataka za graf (ova varijabla se ne koristi, pa smo je komentarisali ili uklonili)
  // const xpChartData = [
  //   { name: 'Dan 1', xp: 50 },
  //   { name: 'Dan 2', xp: 70 },
  //   { name: 'Dan 3', xp: 60 },
  //   { name: 'Dan 4', xp: 90 },
  //   { name: 'Dan 5', xp: 80 },
  // ];

  return (
    <Box sx={{ my: 3, p: 3, backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#333', textAlign: 'center' }}>
        Tvoja Statistika
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="primary">Nivo</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{userData?.level || 1}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="primary">Ukupno XP</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{userData?.xp || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="primary">Misije Kompletirano</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{/* userData?.completedMissionsCount || */ 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>XP Progres po danima</Typography>
            {/* Ovde bi išao grafikon */}
            <Box sx={{ height: 200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
              <Typography variant="subtitle1" color="text.secondary">Grafikon će biti ovde</Typography>
            </Box>
            {/* Primer kako bi izgledao Recharts graf:
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={xpChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="xp" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            */}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Poslednje Aktivnosti</Typography>
            {activities && activities.length > 0 ? (
              <ul>
                {activities.map((activity) => (
                  <li key={activity._id}>
                    {activity.name} - {activity.durationMinutes} min ({new Date(activity.date).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2" color="text.secondary">Nema zabeleženih aktivnosti.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Dnevnik Osećanja (Poslednjih 7 dana)</Typography>
            {diaryEntries && diaryEntries.length > 0 ? (
              <ul>
                {diaryEntries.map((entry) => (
                  <li key={entry._id}>
                    {new Date(entry.date).toLocaleDateString()}: {entry.feeling} - "{entry.notes}"
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2" color="text.secondary">Nema unosa u dnevnik.</Typography>
            )}
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default StatsDashboard;