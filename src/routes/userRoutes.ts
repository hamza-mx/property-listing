import express from 'express';
import { userController } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);

// Protected routes (require authentication)
router.get('/users/profile', auth, userController.getProfile);
router.put('/users/profile', auth, userController.updateProfile);
router.post('/users/favorites/:propertyId', auth, userController.addToFavorites);
router.delete('/users/favorites/:propertyId', auth, userController.removeFromFavorites);

export default router; 