import express from 'express';
import { propertyController } from '../controllers/propertyController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/properties', propertyController.getAll);
router.get('/properties/search', propertyController.search);
router.get('/properties/:id', propertyController.getById);

// Protected routes (require authentication)
router.post('/properties', auth, adminAuth, propertyController.create);
router.put('/properties/:id', auth, adminAuth, propertyController.update);
router.delete('/properties/:id', auth, adminAuth, propertyController.delete);

export default router; 