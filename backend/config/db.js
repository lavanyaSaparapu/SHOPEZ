const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('CRITICAL ERROR: MONGO_URI environment variable is not defined in backend/.env');
      process.exit(1);
    }

    console.log(`Attempting to connect to MongoDB at: ${mongoURI.replace(/:([^:@]+)@/, ':****@')}`); // Safely hide credentials in logs if any

    const conn = await mongoose.connect(mongoURI);

    console.log(`=========================================`);
    console.log(`DATABASE STATUS: CONNECTED`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`=========================================`);
  } catch (error) {
    console.error(`=========================================`);
    console.error(`DATABASE STATUS: CONNECTION FAILED`);
    console.error(`Error details: ${error.message}`);
    console.error(`=========================================`);
    process.exit(1);
  }
};

module.exports = connectDB;
