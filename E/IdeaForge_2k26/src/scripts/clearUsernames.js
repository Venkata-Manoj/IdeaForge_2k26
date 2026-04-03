// Clear all usernames script (for testing purposes)
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ideaforge2k26';

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
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function clearUsernames() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const count = await User.countDocuments();
    console.log(`\nFound ${count} usernames in database`);

    if (count > 0) {
      await User.deleteMany({});
      console.log('All usernames deleted successfully!\n');
    } else {
      console.log('No usernames to delete.\n');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

clearUsernames();
