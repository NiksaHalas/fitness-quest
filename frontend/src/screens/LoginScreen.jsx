// frontend/src/screens/LoginScreen.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Stranica za prijavu korisnika.

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // DODATO: Link
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';
import axios from 'axios'; // Za HTTP zahteve

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Za prikaz grešaka
  const navigate = useNavigate(); // Hook za navigaciju

  const submitHandler = async (e) => {
    e.preventDefault(); // Spreči podrazumevano ponašanje forme

    setError(''); // Resetuj greške

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login', // Adresa tvog backend API-ja za prijavu
        { email, password },
        config
      );

      // Ako je prijava uspešna, sačuvaj token u localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Opciono: preusmeri korisnika na dashboard
      navigate('/dashboard'); // Preusmeri na dashboard (koji ćeš implementirati)
      // Ako ne želiš da preusmeravaš odmah, možeš prikazati poruku
      console.log('Prijava uspešna!', data);

    } catch (err) {
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
          Prijava
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submitHandler} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresa"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Prijavi se
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Nemaš nalog? <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>Registruj se</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginScreen;