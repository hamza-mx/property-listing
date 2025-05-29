import { createClient } from 'redis';

let redisClient: any = null;

try {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err: Error) => {
    console.log('Redis Client Error (Optional) - Caching disabled');
    redisClient = null;
  });

  redisClient.connect().catch(() => {
    console.log('Redis connection failed (Optional) - Caching disabled');
    redisClient = null;
  });
} catch (error) {
  console.log('Redis initialization failed (Optional) - Caching disabled');
  redisClient = null;
}

export const getRedisClient = () => redisClient;

export const getCacheKey = (key: string) => `cache:${key}`;

export const getCache = async (key: string) => {
  if (!redisClient) return null;
  try {
    return await redisClient.get(getCacheKey(key));
  } catch (error) {
    return null;
  }
};

export const setCache = async (key: string, value: any, expireSeconds = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.setEx(getCacheKey(key), expireSeconds, JSON.stringify(value));
  } catch (error) {
    // Ignore cache errors
  }
};

export const deleteCache = async (key: string) => {
  if (!redisClient) return;
  try {
    await redisClient.del(getCacheKey(key));
  } catch (error) {
    console.error('Redis Delete Error:', error);
  }
};

export const clearCache = async () => {
  if (!redisClient) return;
  try {
    await redisClient.flushAll();
  } catch (error) {
    console.error('Redis Clear Error:', error);
  }
};

export default redisClient; 