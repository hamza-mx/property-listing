import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const register = async (input: RegisterInput) => {
  const { email, password, firstName, lastName } = input;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '7d' }
  );

  return {
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  };
};

export const login = async (input: LoginInput) => {
  const { email, password } = input;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '7d' }
  );

  return {
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    token
  };
};

export const getProfile = async (req: AuthRequest) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}; 