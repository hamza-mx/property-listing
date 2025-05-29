import { Request, Response } from 'express';
import Property, { IProperty } from '../models/Property';
import { redisClient } from '../config/database';

const CACHE_EXPIRATION = 3600; // 1 hour in seconds

export const propertyController = {
  // Create a new property
  async create(req: Request, res: Response) {
    try {
      const property = new Property(req.body);
      await property.save();
      
      // Invalidate cache for property list
      await redisClient.del('properties:all');
      
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: 'Error creating property' });
    }
  },

  // Get all properties with caching
  async getAll(req: Request, res: Response) {
    try {
      // Try to get from cache first
      const cachedProperties = await redisClient.get('properties:all');
      
      if (cachedProperties) {
        return res.json(JSON.parse(cachedProperties));
      }

      // If not in cache, get from database
      const properties = await Property.find({});
      
      // Store in cache
      await redisClient.setEx('properties:all', CACHE_EXPIRATION, JSON.stringify(properties));
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching properties' });
    }
  },

  // Get property by ID with caching
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Try to get from cache first
      const cachedProperty = await redisClient.get(`property:${id}`);
      
      if (cachedProperty) {
        return res.json(JSON.parse(cachedProperty));
      }

      // If not in cache, get from database
      const property = await Property.findById(id);
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Store in cache
      await redisClient.setEx(`property:${id}`, CACHE_EXPIRATION, JSON.stringify(property));
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching property' });
    }
  },

  // Update property
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const property = await Property.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Invalidate caches
      await Promise.all([
        redisClient.del(`property:${id}`),
        redisClient.del('properties:all')
      ]);

      res.json(property);
    } catch (error) {
      res.status(500).json({ error: 'Error updating property' });
    }
  },

  // Delete property
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const property = await Property.findByIdAndDelete(id);
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Invalidate caches
      await Promise.all([
        redisClient.del(`property:${id}`),
        redisClient.del('properties:all')
      ]);

      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting property' });
    }
  },

  // Search properties
  async search(req: Request, res: Response) {
    try {
      const {
        minPrice,
        maxPrice,
        city,
        state,
        type,
        bedrooms,
        bathrooms
      } = req.query;

      const query: any = {};

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (city) query['location.city'] = new RegExp(city as string, 'i');
      if (state) query['location.state'] = new RegExp(state as string, 'i');
      if (type) query.type = type;
      if (bedrooms) query['features.bedrooms'] = Number(bedrooms);
      if (bathrooms) query['features.bathrooms'] = Number(bathrooms);

      const properties = await Property.find(query);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Error searching properties' });
    }
  }
}; 