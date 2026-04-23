const mongoose = require('mongoose');

// Task #43: Database connection configuration with environment variables
// Task #44: Connection error handling and retry logic

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

const connectDB = async (retryCount = 0) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] MONGODB_URI environment variable is not defined');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      const next = retryCount + 1;
      console.log(`[DB] Retrying (${next}/${MAX_RETRIES}) in ${RETRY_INTERVAL_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      return connectDB(next);
    }

    console.error('[DB] Max retries reached. Exiting...');
    process.exit(1);
  }
};

module.exports = connectDB;
