const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Mongo URI:', process.env.MONGO_URI_1); // Debugging line
    await mongoose.connect(process.env.MONGO_URI_1);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
