const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppinglist')
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection host:', mongoose.connection.host);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Shopping List is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});