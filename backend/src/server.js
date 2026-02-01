require('dotenv').config();
const express = require('express');
const app = express();

// Enable CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trips', require('./routes/trip.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/destination', require('./routes/destination.routes'));
app.use('/api/emergency', require('./routes/emergency.routes'));

app.use(require('./middlewares/error.middleware'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));