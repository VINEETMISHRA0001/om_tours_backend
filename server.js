const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const tourRoutes = require('./routes/tourRoutes');
const morgan = require('morgan');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      'https://amin-om-tours-drab.vercel.app',
      'http://localhost:5173',
      'https://repo2-om-tours.vercel.app/vehicles',
    ], // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(morgan('dev'));

// Serve static files from the 'public/uploads' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.json({ message: 'Hello vercel' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', vehicleRoutes);
app.use('/api/admin', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', feedbackRoutes);
app.use('/api/tours', tourRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
