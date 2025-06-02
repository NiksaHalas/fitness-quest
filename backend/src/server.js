// backend/src/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Učitaj .env varijable na samom početku, pre nego što se pokušaju koristiti
dotenv.config();

// Importovanje funkcije za povezivanje sa bazom iz zasebnog fajla
// Ovo je ispravan način da je koristis kada je connectDB u config/db.js
const connectDB = require('./config/db');

// Pozovi funkciju za povezivanje sa bazom
connectDB(); // Ovo ce se povezati sa bazom

const app = express();

// Middleware
app.use(express.json()); // Za parsiranje JSON request body-ja
app.use(cors()); // Omogući CORS za komunikaciju sa frontendom

// !!! VAŽNO: OVDE SI IMAO DUPLU DEKLARACIJU connectDB FUNKCIJE
// !!! I DRUGI POZIV connectDB(). OVO JE UKLONJENO.
// NEMA POTREBE ZA BLOKOM KODA KOJI IZGLEDA OVAKO:
/*
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB povezan...');
    } catch (err) {
        console.error(err.message);
        // Izlaz iz procesa u slučaju greške
        process.exit(1);
    }
};
connectDB(); // Drugi poziv, takođe nepotreban ako se koristi import
*/

// Definicija ruta
const authRoutes = require('./routes/authRoutes');
const missionRoutes = require('./routes/missionRoutes');
const userRoutes = require('./routes/userRoutes');
const diaryRoutes = require('./routes/diaryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/diary', diaryRoutes);

// Osnovna ruta
app.get('/', (req, res) => {
    res.send('Fitness Quest API je pokrenut!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));