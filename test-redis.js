require('dotenv').config();
const { createClient } = require('redis');

async function testRedisConnection() {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  client.on('error', err => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Connected to Redis!'));

  try {
    await client.connect();
    
    // Test setting and getting a value
    await client.set('test', 'Hello from Property Listings App');
    const value = await client.get('test');
    console.log('Test value from Redis:', value);
    
    await client.disconnect();
    console.log('Disconnected from Redis');
  } catch (error) {
    console.error('Error:', error);
  }
}

testRedisConnection(); 