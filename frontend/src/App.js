// frontend/src/App.js
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Glavna komponenta aplikacije sa rutiranjem i osnovnim rasporedom.

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Uvezi komponente koje ces kreirati/koristiti
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen'; // Dodato
import PrivateRoute from './components/hoc/PrivateRoute'; // Dodato

// Primer kreiranja osnovne MUI teme
const theme = createTheme({
  palette: {
    primary: {
      main: '#388e3c', // Tamnija zelena za primarnu boju
    },
    secondary: {
      main: '#1976d2', // Tamnija plava za sekundarnu boju
    },
  },
});

function App() {
  const navigate = useNavigate(); // Hook za navigaciju (koristi se unutar Router-a)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stanje za praćenje prijave

  // Proveri status prijave pri učitavanju aplikacije i kada se promeni localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = localStorage.getItem('userInfo');
      setIsLoggedIn(!!userInfo); // Ako userInfo postoji, isLoggedIn je true
    };

    // Proveri status pri učitavanju
    checkLoginStatus();

    // Dodaj event listener za 'storage' event da reaguje na promene u localStorage-u (npr. odjava)
    window.addEventListener('storage', checkLoginStatus);

    // Očisti event listener pri unmount-ovanju
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Obriši token iz localStorage-a
    setIsLoggedIn(false); // Ažuriraj stanje
    navigate('/login'); // Preusmeri na stranicu za prijavu
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(to bottom right, #e0f2f7, #bbdefb)' }}>
        {/* AppBar (navigacija) */}
        <AppBar position="static" sx={{ background: 'linear-gradient(to right, #4CAF50, #2196F3)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Fitness Quest
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Početna
            </Button>
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Odjava
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/register">
                  Registracija
                </Button>
                <Button color="inherit" component={Link} to="/login">
                  Prijava
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Glavni sadržaj aplikacije */}
        <Container component="main" sx={{ flexGrow: 1, p: 3, mt: 2 }}>
          <Routes>
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            {/* Početna stranica */}
            <Route path="/" element={
              <Box
                sx={{
                  backgroundColor: 'white',
                  p: 4,
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  Dobrodošli u Fitness Quest!
                </Typography>
                <Typography variant="h6" component="p" sx={{ mb: 3, color: '#555' }}>
                  Gejmifikovana platforma za vežbanje.
                </Typography>
                {!isLoggedIn && (
                  <Button variant="contained" color="secondary" size="large" component={Link} to="/register">
                    Započni Avanturu!
                  </Button>
                )}
                {isLoggedIn && (
                  <Button variant="contained" color="secondary" size="large" component={Link} to="/dashboard">
                    Idi na Dashboard!
                  </Button>
                )}
              </Box>
            } />
            {/* Zaštićena ruta za Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardScreen />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;