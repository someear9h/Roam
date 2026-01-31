require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trips', require('./routes/trip.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/destination', require('./routes/destination.routes'));
app.use('/api/emergency', require('./routes/emergency.routes'));

app.use(require('./middlewares/error.middleware'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));