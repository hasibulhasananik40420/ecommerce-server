import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

// Async connect function
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
  }
};

export { redisClient, connectRedis };
