const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/apex_lms');
    console.log(`\x1b[32m[Database] Connected successfully to MongoDB: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[Database Connection Error] Could not connect to MongoDB.\x1b[0m`);
    console.error(`\x1b[33mError Details:\x1b[0m ${error.message}`);
    console.error(`\x1b[36mHow to Resolve:\x1b[0m`);
    console.error(`1. Check if your local MongoDB server is running: 'sudo systemctl status mongod'`);
    console.error(`2. If using MongoDB Atlas, check your network IP whitelist (allow access from anywhere 0.0.0.0/0 is required for Render/Heroku)`);
    console.error(`3. Verify your MONGO_URI in the '.env' file is correct.`);
    
    // In development mode, don't kill the process so the student can still view the UI
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
