// frontend/src/App.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Glavna komponenta aplikacije sa rutiranjem i globalnim temiranjem (Tamna, Moderna Tema).

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

// Uvezi komponente
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import DiaryScreen from './screens/DiaryScreen';
import ReminderScreen from './screens/ReminderScreen';
import ActivityScreen from './screens/ActivityScreen';
import PrivateRoute from './components/hoc/PrivateRoute';

// Definisanje moderne tamne teme
const theme = createTheme({
  palette: {
    mode: 'dark', // Postavi temu na tamnu
    primary: {
      main: '#BB86FC', // Svetla ljubičasta za primarni akcenat (inspirisano slikom)
      light: '#D0A0FF',
      dark: '#8A2BE2', // Tamnija ljubičasta
      contrastText: '#000', // Crni tekst na svetloj ljubičastoj
    },
    secondary: {
      main: '#03DAC6', // Tirkizna za sekundarni akcenat
      light: '#66FCF1',
      dark: '#00BFFF', // Svetlo plava
      contrastText: '#000',
    },
    background: {
      default: '#121212', // Vrlo tamna pozadina (skoro crna)
      paper: '#1E1E1E', // Tamnija siva za kartice i papir
    },
    text: {
      primary: '#E0E0E0', // Svetlo siva za glavni tekst
      secondary: '#B0B0B0', // Srednje siva za sekundarni tekst
    },
    // Dodatne boje za gradijente i dubinu
    darkBlue: {
      main: '#1A1A2E', // Tamno plava
    },
    darkPurple: {
      main: '#2C2C4A', // Tamno ljubičasta
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif', // Koristimo Inter font
    h4: {
      fontWeight: 700, // Deblji font
      fontSize: '2.4rem',
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.6rem',
      },
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.3rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#E0E0E0', // Osiguraj svetli tekst
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#B0B0B0', // Osiguraj svetliji sekundarni tekst
    },
    button: {
      textTransform: 'none', // Dugmad bez velikih slova
      fontWeight: 600,
      letterSpacing: '0.02em', // Blagi razmak između slova
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Još zaobljenije ivice
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)', // Izraženija, ali meka senka
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 25px rgba(0, 0, 0, 0.4)',
          },
        },
        containedPrimary: {
          // Gradijent za primarna dugmad
          background: 'linear-gradient(45deg, #BB86FC 30%, #8A2BE2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #D0A0FF 30%, #BB86FC 90%)',
          },
        },
        containedSecondary: {
          // Gradijent za sekundarna dugmad
          background: 'linear-gradient(45deg, #03DAC6 30%, #00BFFF 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #66FCF1 30%, #03DAC6 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Još zaobljenije ivice kartica
          background: 'rgba(30, 30, 30, 0.8)', // Blago transparentna tamna pozadina
          backdropFilter: 'blur(10px)', // Blagi blur efekat
          border: '1px solid rgba(255, 255, 255, 0.05)', // Suptilni obrub
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)', // Izraženija senka
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px', // Zaobljeniji inputi
            backgroundColor: 'rgba(255, 255, 255, 0.05)', // Vrlo blaga transparentnost
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1) !important', // Svetliji obrub
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3) !important',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#BB86FC !important', // Akcentna boja pri fokusu
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B0B0B0', // Svetlija boja labela
          },
          '& .MuiInputBase-input': {
            color: '#E0E0E0', // Svetlija boja teksta unosa
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1A1A2E 0%, #2C2C4A 100%)', // Tamni gradijent za navbar
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Blaga senka
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent', // Lista bez pozadine
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          marginBottom: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)', // Vrlo suptilna pozadina za list item
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiTooltip: { // Stilizacija Tooltipa za bolje uklapanje
      styleOverrides: {
        tooltip: {
          backgroundColor: '#333',
          color: '#fff',
          fontSize: '0.9rem',
          borderRadius: '8px',
          padding: '8px 12px',
        },
        arrow: {
          color: '#333',
        },
      },
    },
  },
});

// Custom styled komponenta za pozadinu sa gradijentom
const AppBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  // Gradijent pozadine inspirisan slikom
  background: `linear-gradient(135deg, ${theme.palette.darkBlue.main} 0%, ${theme.palette.darkPurple.main} 100%)`,
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary, // Osiguraj da je globalni tekst svetao
}));


function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userInfo = localStorage.getItem('userInfo');
      setIsLoggedIn(!!userInfo);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resetuje CSS za dosledan izgled */}
      <AppBackground> {/* Koristimo custom styled komponentu */}
        {/* AppBar (navigacija) */}
        <AppBar position="static"> {/* Stilovi su sada u theme.components.MuiAppBar */}
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
              Fitness Quest
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'white' }}>
              Početna
            </Button>
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard" sx={{ color: 'white' }}>
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/diary" sx={{ color: 'white' }}>
                  Dnevnik
                </Button>
                <Button color="inherit" component={Link} to="/reminders" sx={{ color: 'white' }}>
                  Podsetnici
                </Button>
                <Button color="inherit" component={Link} to="/activities" sx={{ color: 'white' }}>
                  Aktivnosti
                </Button>
                <Button color="inherit" onClick={handleLogout} sx={{ color: 'white' }}>
                  Odjava
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/register" sx={{ color: 'white' }}>
                  Registracija
                </Button>
                <Button color="inherit" component={Link} to="/login" sx={{ color: 'white' }}>
                  Prijava
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Glavni sadržaj aplikacije */}
        <Container component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: { xs: 2, md: 4 } }}> {/* Responzivni padding/margin */}
          <Routes>
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/" element={
              <Paper
                sx={{
                  p: { xs: 3, md: 5 }, // Responzivni padding
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 'calc(100vh - 200px)', // Prilagodi visinu
                  background: 'rgba(30, 30, 30, 0.6)', // Malo transparentnija pozadina za hero sekciju
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.primary.light, mb: 2 }}>
                  Dobrodošli u Fitness Quest!
                </Typography>
                <Typography variant="h6" component="p" sx={{ mb: { xs: 3, md: 4 }, color: theme.palette.text.secondary, maxWidth: '700px' }}>
                  Gejmifikovana platforma za vežbanje koja te motiviše da dostigneš svoje ciljeve kroz izazove, nagrade i praćenje napretka.
                </Typography>
                {!isLoggedIn && (
                  <Button variant="contained" color="primary" size="large" component={Link} to="/register" sx={{ px: { xs: 3, md: 5 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                    Započni Avanturu!
                  </Button>
                )}
                {isLoggedIn && (
                  <Button variant="contained" color="primary" size="large" component={Link} to="/dashboard" sx={{ px: { xs: 3, md: 5 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                    Idi na Dashboard!
                  </Button>
                )}
              </Paper>
            } />
            {/* Zaštićene rute */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/diary"
              element={
                <PrivateRoute>
                  <DiaryScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <PrivateRoute>
                  <ReminderScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivityScreen />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      </AppBackground>
    </ThemeProvider>
  );
}

export default App;
