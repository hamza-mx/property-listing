import express, { Request, Response, Router, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { auth } from '../middleware/auth.middleware';
import { register, login, getProfile } from '../controllers/auth.controller';

interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

const router: Router = express.Router();

// Register new user
const registerHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await register({ email, password, firstName, lastName });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
const loginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

// Get user profile
const getProfileHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const user = await getProfile(authReq);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/profile', auth, getProfileHandler);

export default router; 