import mongoose from 'mongoose';

// Read, trim, and strip any surrounding quotes (single or double) from the MONGODB_URI
let rawUri = process.env.MONGODB_URI || '';

// Clean up surrounding quotes from copy-pasting into configuration panels or .env files
let cleanedUri = rawUri.trim();
if (
  (cleanedUri.startsWith('"') && cleanedUri.endsWith('"')) ||
  (cleanedUri.startsWith("'") && cleanedUri.endsWith("'"))
) {
  cleanedUri = cleanedUri.substring(1, cleanedUri.length - 1).trim();
}

const MONGODB_URI = cleanedUri;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Ensure global type declaration for typescript
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI || MONGODB_URI.includes('MY_MONGODB_URI')) {
    throw new Error(
      'MONGODB_URI environment variable is missing or set to placeholder. Please configure it in your Secrets / Environment panel.'
    );
  }

  // Validate scheme to prevent the low-level Mongoose driver crash
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error(
      `Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://". ` +
      `Check your configuration (current value: "${rawUri}"). Please configure MONGODB_URI correctly without literal surrounding quotes.`
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((instance) => {
      console.log('MongoDB connected successfully');
      return instance;
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // reset promise so next request can retry
    throw e;
  }

  return cached.conn;
}
