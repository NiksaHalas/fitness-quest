// backend/src/server.js
// Autor: Tvoje Ime
// Datum: 03.06.2025.
// Svrha: Glavni ulazni fajl za backend aplikaciju, postavlja server i rute.

const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const missionRoutes = require('./routes/missionRoutes');
const userRoutes = require('./routes/userRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const activityRoutes = require('./routes/activityRoutes');
const authRoutes = require('./routes/authRoutes'); // KLJUČNO: Uvezi authRoutes
const cors = require('cors');

const PORT = process.env.PORT || 5000;

connectDB(); // Poveži se na bazu podataka

const app = express();

// Middleware za parsiranje JSON tela zahteva
app.use(express.json());

// Middleware za parsiranje URL-encoded tela zahteva (ako je potrebno)
app.use(express.urlencoded({ extended: false }));

// Omogući CORS za sve rute (za razvoj)
app.use(cors());

// Definisanje ruta
app.use('/api/missions', missionRoutes);
app.use('/api/user', userRoutes); // Za /api/user/profile
app.use('/api/reminders', reminderRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/auth', authRoutes); // KLJUČNO: Koristi authRoutes za /api/auth rute


// Ruta za testiranje (opciono)
app.get('/', (req, res) => {
    res.send('API je pokrenut...');
});

// Middleware za rukovanje greškama (mora biti na kraju)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
