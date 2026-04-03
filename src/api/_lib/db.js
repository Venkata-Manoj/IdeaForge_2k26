// Database connection utility for API routes
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Define schemas inline to avoid model registration issues
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  isGenerated: {
    type: Boolean,
    default: false,
    index: true
  },
}, { timestamps: true });

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    ref: 'User'
  },
  participantName: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Technical', 'Non-Technical']
  },
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not configured. Please set the database connection string.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((err) => {
      cached.promise = null;
      throw new Error('Database connection failed. Please ensure MongoDB is running.');
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // Register models
  if (!cached.conn.models.User) {
    cached.conn.model('User', userSchema);
  }
  if (!cached.conn.models.Certificate) {
    cached.conn.model('Certificate', certificateSchema);
  }

  return cached.conn;
}

export { connectToDatabase };
export default connectToDatabase;