require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trips', require('./routes/trip.routes'));
app.use('/api/hotels', require('./routes/hotel.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/destination', require('./routes/destination.routes'));
app.use('/api/emergency', require('./routes/emergency.routes'));
app.use('/api/preferences', require('./routes/preferences.routes'));
app.use('/api/alerts', require('./routes/alerts.routes'));
app.use('/api/summary', require('./routes/summary.routes'));
app.use('/api/reviews', require('./routes/review.routes'));

app.use(require('./middlewares/error.middleware'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));