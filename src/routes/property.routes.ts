import express, { Request, Response, Router, RequestHandler } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getRecommendations
} from '../controllers/property.controller';

interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

const router: Router = express.Router();

// Create property
const createPropertyHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const property = await createProperty(authReq);
    res.status(201).json(property);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all properties
const getPropertiesHandler: RequestHandler = async (req, res) => {
  try {
    const properties = await getProperties(req);
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get single property
const getPropertyHandler: RequestHandler = async (req, res) => {
  try {
    const property = await getProperty(req);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update property
const updatePropertyHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const property = await updateProperty(authReq);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete property
const deletePropertyHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const result = await deleteProperty(authReq);
    if (!result) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get property recommendations
const getRecommendationsHandler: RequestHandler = async (req, res) => {
  try {
    const recommendations = await getRecommendations(req);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Routes
router.post('/', auth, createPropertyHandler);
router.get('/', getPropertiesHandler);
router.get('/:id', getPropertyHandler);
router.patch('/:id', auth, updatePropertyHandler);
router.delete('/:id', auth, deletePropertyHandler);
router.get('/:id/recommendations', getRecommendationsHandler);

export default router; 