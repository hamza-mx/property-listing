import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';
import User, { IUser } from '../models/User';
import { redisClient } from '../config/database';

interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  _id: string;
}

export const userController = {
  // Register new user
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { _id: (user as unknown as { _id: { toString(): string } })._id.toString() },
        process.env.JWT_SECRET || 'default_secret',
        { algorithm: 'HS256' }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: 'Error registering user' });
    }
  },

  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { _id: (user as unknown as { _id: { toString(): string } })._id.toString() },
        process.env.JWT_SECRET || 'default_secret',
        { algorithm: 'HS256' }
      );

      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: 'Error logging in' });
    }
  },

  // Get user profile
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user?._id).populate('favorites');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  },

  // Update user profile
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['firstName', 'lastName', 'password'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }

      const user = await User.findById(req.user?._id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      updates.forEach(update => {
        if (req.body[update]) {
          (user as any)[update] = req.body[update];
        }
      });

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error updating profile' });
    }
  },

  // Add property to favorites
  async addToFavorites(req: AuthRequest, res: Response) {
    try {
      const { propertyId } = req.params;
      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
      if (user.favorites.includes(propertyObjectId)) {
        return res.status(400).json({ error: 'Property already in favorites' });
      }

      user.favorites.push(propertyObjectId);
      await user.save();

      // Invalidate user cache
      await redisClient.del(`user:${(user as unknown as { _id: { toString(): string } })._id.toString()}`);

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error adding to favorites' });
    }
  },

  // Remove property from favorites
  async removeFromFavorites(req: AuthRequest, res: Response) {
    try {
      const { propertyId } = req.params;
      const user = await User.findById(req.user?._id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
      user.favorites = user.favorites.filter(id => !id.equals(propertyObjectId));
      await user.save();

      // Invalidate user cache
      await redisClient.del(`user:${(user as unknown as { _id: { toString(): string } })._id.toString()}`);

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error removing from favorites' });
    }
  }
}; 