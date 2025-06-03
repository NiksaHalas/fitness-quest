// backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config(); // Učitaj .env promenljive što je ranije moguće

connectDB(); // Poveži se sa bazom podataka

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Definicija ruta
const authRoutes = require('./routes/authRoutes');
const missionRoutes = require('./routes/missionRoutes');
const userRoutes = require('./routes/userRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const activityRoutes = require('./routes/activityRoutes'); // DODATO: Uvezi activityRoutes

app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/activities', activityRoutes); // DODATO: Koristi activityRoutes

// Osnovna ruta
app.get('/', (req, res) => {
    res.send('Fitness Quest API je pokrenut!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
