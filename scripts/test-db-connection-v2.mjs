import mongoose from 'mongoose';
import fs from 'fs';

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf8');
const MONGODB_URI = envContent
  .split('\n')
  .find(line => line.startsWith('MONGODB_URI='))
  ?.replace('MONGODB_URI=', '')
  ?.trim();

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

console.log('🔌 Testing MongoDB Atlas connection...');
console.log(`URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}`);

try {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  
  console.log('✅ Successfully connected to MongoDB Atlas!');
  
  // Test database operations
  const db = mongoose.connection;
  console.log(`📊 Database: ${db.name}`);
  console.log(`🌐 Host: ${db.host}`);
  
  // List collections
  const collections = await db.db.listCollections().toArray();
  console.log(`📁 Collections: ${collections.map(c => c.name).join(', ') || 'None (new database)'}`);
  
  // Test write by creating a test document
  const TestSchema = new mongoose.Schema({ test: String, createdAt: { type: Date, default: Date.now } });
  const TestModel = mongoose.model('ConnectionTest', TestSchema);
  
  const testDoc = await TestModel.create({ test: 'connection-verified' });
  console.log('✅ Test write successful:', testDoc._id.toString());
  
  // Clean up test document
  await TestModel.deleteOne({ _id: testDoc._id });
  console.log('🧹 Test document cleaned up');
  
  console.log('\n🎉 MongoDB Atlas is fully operational!');
  
} catch (error) {
  console.error('\n❌ Connection failed:', error.message);
  
  if (error.message.includes('IP')) {
    console.log('\n💡 Fix: Add your IP to MongoDB Atlas Network Access:');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Network Access → Add IP Address');
    console.log('   3. Add: 0.0.0.0/0 (for all IPs) or your specific IP');
  }
  
  if (error.message.includes('authentication')) {
    console.log('\n💡 Fix: Check username/password in connection string');
  }
  
  process.exit(1);
} finally {
  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}
