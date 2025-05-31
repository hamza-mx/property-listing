require('dotenv').config();
const mongoose = require('mongoose');

// Use environment variable or your connection string
const uri = process.env.MONGODB_URI || 'YOUR_MONGODB_ATLAS_CONNECTION_STRING';

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB Atlas!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => console.log(collection.name));
    
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testConnection(); 