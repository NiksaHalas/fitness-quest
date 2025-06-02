// frontend/src/screens/RegisterScreen.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Stranica za registraciju korisnika.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // DODATO: Link
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';
import axios from 'axios'; // Za HTTP zahteve

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // Za poruke korisniku (uspeh/greška)
  const [error, setError] = useState('');     // Za prikaz grešaka
  const navigate = useNavigate(); // Hook za navigaciju

  const submitHandler = async (e) => {
    e.preventDefault(); // Spreči podrazumevano ponašanje forme (reload stranice)

    setError(''); // Resetuj greške
    setMessage(''); // Resetuj poruke

    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju!');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Uklanjamo destrukturiranje 'data' jer nam ne treba direktno za prikaz
      // Ako bi nam trebalo nešto iz 'data' (npr. token), onda bismo ga zadržali
      await axios.post( // IZMENJENO: Uklonjeno { data }
        'http://localhost:5000/api/auth/register', // Adresa tvog backend API-ja za registraciju
        { username, email, password },
        config
      );

      setMessage('Uspešna registracija! Možete se sada prijaviti.');
      // Opciono: preusmeri korisnika na stranicu za prijavu nakon uspešne registracije
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Preusmeri nakon 2 sekunde
    } catch (err) {
      // Proveri da li je greška iz backend-a
      setError(err.response && err.response.data.message
        ? err.response.data.message
        : err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          Registracija
        </Typography>
        {message && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submitHandler} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Korisničko ime"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresa"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Lozinka"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Potvrdi Lozinku"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registruj se
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Već imaš nalog? <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>Prijavi se</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterScreen;