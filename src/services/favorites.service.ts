import mongoose from 'mongoose';
import Property from '../models/property.model';
import { getCache, setCache, deleteCache } from './redis.service';

const CACHE_KEY_PREFIX = 'user_favorites:';

export const addToFavorites = async (userId: string, propertyId: string) => {
  try {
    const property = await Property.findOneAndUpdate(
      { propertyId },
      { $addToSet: { favorites: userId } },
      { new: true }
    );

    if (!property) {
      throw new Error('Property not found');
    }

    // Update cache
    await deleteCache(`${CACHE_KEY_PREFIX}${userId}`);
    
    return property;
  } catch (error) {
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, propertyId: string) => {
  try {
    const property = await Property.findOneAndUpdate(
      { propertyId },
      { $pull: { favorites: userId } },
      { new: true }
    );

    if (!property) {
      throw new Error('Property not found');
    }

    // Update cache
    await deleteCache(`${CACHE_KEY_PREFIX}${userId}`);
    
    return property;
  } catch (error) {
    throw error;
  }
};

export const getFavorites = async (userId: string) => {
  try {
    // Try to get from cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const cachedFavorites = await getCache(cacheKey);
    
    if (cachedFavorites) {
      return cachedFavorites;
    }

    // If not in cache, get from database
    const favorites = await Property.find({
      favorites: userId
    }).select('-favorites');

    // Store in cache
    await setCache(cacheKey, favorites);

    return favorites;
  } catch (error) {
    throw error;
  }
};

export const clearFavorites = async (userId: string) => {
  try {
    await Property.updateMany(
      { favorites: userId },
      { $pull: { favorites: userId } }
    );

    // Clear cache
    await deleteCache(`${CACHE_KEY_PREFIX}${userId}`);

    return { message: 'All favorites cleared successfully' };
  } catch (error) {
    throw error;
  }
}; 