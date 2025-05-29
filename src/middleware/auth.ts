import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { _id: string };
    const user = await require('../models/User').default.findById(decoded._id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 