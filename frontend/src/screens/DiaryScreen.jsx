// frontend/src/screens/DiaryScreen.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Stranica za dodavanje i pregled unosa u dnevnik aktivnosti i osećanja.

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  MenuItem, // Za Select komponente
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns'; // Za formatiranje datuma

// Komponenta za prikaz pojedinačnog unosa u dnevnik
const DiaryEntryCard = ({ entry }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: '8px' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        {format(new Date(entry.date), 'dd.MM.yyyy.')}
      </Typography>
      <Typography variant="body1">
        **Aktivnost:** {entry.activityType} ({entry.duration} min, {entry.intensity})
      </Typography>
      <Typography variant="body1">
        **Osećaj:** {entry.feeling}
      </Typography>
      {entry.notes && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          **Beleške:** {entry.notes}
        </Typography>
      )}
    </Paper>
  );
};

const DiaryScreen = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [feeling, setFeeling] = useState('');
  const [notes, setNotes] = useState('');
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dohvatanje unosa iz dnevnika
  const fetchDiaryEntries = async () => {
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

      const { data } = await axios.get('http://localhost:5000/api/diary', config);
      setEntries(data);
      setLoading(false);
    } catch (err) {
      console.error("Greška pri dohvatanju unosa iz dnevnika:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Došlo je do greške pri dohvatanju unosa iz dnevnika.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedUserInfo.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/diary',
        { date, feeling, notes, activityType, duration: Number(duration), intensity }, // duration šaljemo kao broj
        config
      );

      setSuccess('Unos u dnevnik uspešno sačuvan!');
      setEntries([data, ...entries]); // Dodaj novi unos na vrh liste
      // Resetuj formu
      setDate(format(new Date(), 'yyyy-MM-dd'));
      setFeeling('');
      setNotes('');
      setActivityType('');
      setDuration('');
      setIntensity('');

    } catch (err) {
      console.error("Greška pri kreiranju unosa:", err);
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : 'Greška pri kreiranju unosa u dnevnik.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Moj Dnevnik Aktivnosti i Osećanja
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: '8px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Dodaj Novi Unos
        </Typography>
        <Box component="form" onSubmit={submitHandler} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Datum"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="activity-type-label">Tip Aktivnosti</InputLabel>
                <Select
                  labelId="activity-type-label"
                  id="activity-type"
                  value={activityType}
                  label="Tip Aktivnosti"
                  onChange={(e) => setActivityType(e.target.value)}
                >
                  <MenuItem value=""><em>Odaberi</em></MenuItem>
                  <MenuItem value="Kardio">Kardio</MenuItem>
                  <MenuItem value="Snaga">Snaga</MenuItem>
                  <MenuItem value="Fleksibilnost">Fleksibilnost</MenuItem>
                  <MenuItem value="Meditacija">Meditacija</MenuItem>
                  <MenuItem value="Šetnja">Šetnja</MenuItem>
                  <MenuItem value="Odmaranje">Odmaranje</MenuItem>
                  <MenuItem value="Ostalo">Ostalo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trajanje (minuta)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="intensity-label">Intenzitet</InputLabel>
                <Select
                  labelId="intensity-label"
                  id="intensity"
                  value={intensity}
                  label="Intenzitet"
                  onChange={(e) => setIntensity(e.target.value)}
                >
                  <MenuItem value=""><em>Odaberi</em></MenuItem>
                  <MenuItem value="Nizak">Nizak</MenuItem>
                  <MenuItem value="Srednji">Srednji</MenuItem>
                  <MenuItem value="Visok">Visok</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="feeling-label">Kako se osećaš?</InputLabel>
                <Select
                  labelId="feeling-label"
                  id="feeling"
                  value={feeling}
                  label="Kako se osećaš?"
                  onChange={(e) => setFeeling(e.target.value)}
                >
                  <MenuItem value=""><em>Odaberi</em></MenuItem>
                  <MenuItem value="😊 Srećno">😊 Srećno</MenuItem>
                  <MenuItem value="💪 Energizovano">💪 Energizovano</MenuItem>
                  <MenuItem value="😌 Opušteno">😌 Opušteno</MenuItem>
                  <MenuItem value="😴 Umorno">😴 Umorno</MenuItem>
                  <MenuItem value="😐 Neutralno">😐 Neutralno</MenuItem>
                  <MenuItem value="😔 Tužno">😔 Tužno</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Beleške (opciono)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>
            <Grid item xs={12}>
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                Sačuvaj Unos
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, borderRadius: '8px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Prethodni Unosi
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : entries.length > 0 ? (
          entries.map((entry) => (
            <DiaryEntryCard key={entry._id} entry={entry} />
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            Nema unosa u dnevnik. Počnite da dodajete!
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default DiaryScreen;
