// Seed script to add initial usernames to the database
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localEnvPath = path.resolve(__dirname, '..', '..', '.env');

if (fs.existsSync(localEnvPath)) {
  const envFile = fs.readFileSync(localEnvPath, 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

// Define user schema
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
  isAdmin: {
    type: Boolean,
    default: false,
    index: true
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Sample usernames to seed (regular users - one certificate only)
const sampleUsernames = [];
for (let i = 1; i <= 500; i++) {
  sampleUsernames.push(`participant_${i.toString().padStart(3, '0')}`);
}

// Admin usernames - unlimited certificates
const adminUsernames = [
  'admin_ideaforge_200326',
  'admin_event_lead',
  'admin_tech_head',
  'admin_nontech_head',
];

async function seedUsernames() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\nSeeding usernames...');
    
    let added = 0;
    let skipped = 0;

    // Seed regular users
    console.log('\nSeeding regular usernames...');
    for (const username of sampleUsernames) {
      try {
        await User.create({ username, isGenerated: false, isAdmin: false });
        console.log(`  Added: ${username}`);
        added++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  Skipped (duplicate): ${username}`);
          skipped++;
        } else {
          console.error(`  Error adding ${username}:`, error.message);
        }
      }
    }

    // Seed admin users
    console.log('\nSeeding admin usernames...');
    for (const username of adminUsernames) {
      try {
        await User.create({ username, isGenerated: false, isAdmin: true });
        console.log(`  Added (admin): ${username}`);
        added++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  Skipped (duplicate): ${username}`);
          skipped++;
        } else {
          console.error(`  Error adding admin ${username}:`, error.message);
        }
      }
    }

    console.log(`\nSeeding complete!`);
    console.log(`  Added: ${added}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Total: ${added + skipped}`);

    // Display all usernames
    const allUsers = await User.find().sort({ username: 1 });
    console.log('\nAll usernames in database:');
    allUsers.forEach((user, index) => {
      const type = user.isAdmin ? 'ADMIN' : 'user';
      console.log(`  ${index + 1}. ${user.username} [${type}] - Generated: ${user.isGenerated}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed
seedUsernames();