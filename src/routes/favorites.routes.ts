import express, { Request, Response, Router, RequestHandler } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites
} from '../services/favorites.service';

interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

const router: Router = express.Router();

// All routes require authentication
router.use(auth);

// Get user's favorites
const getFavoritesHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const favorites = await getFavorites(authReq.user._id);
    res.json(favorites);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add property to favorites
const addToFavoritesHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const property = await addToFavorites(authReq.user._id, req.params.propertyId);
    res.json(property);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Remove property from favorites
const removeFromFavoritesHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const property = await removeFromFavorites(authReq.user._id, req.params.propertyId);
    res.json(property);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Clear all favorites
const clearFavoritesHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const result = await clearFavorites(authReq.user._id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

router.get('/', getFavoritesHandler);
router.post('/:propertyId', addToFavoritesHandler);
router.delete('/:propertyId', removeFromFavoritesHandler);
router.delete('/', clearFavoritesHandler);

export default router; 