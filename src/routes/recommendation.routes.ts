import express, { Request, Response, Router, RequestHandler } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  createRecommendation,
  getReceivedRecommendations,
  getSentRecommendations,
  markRecommendationAsViewed
} from '../services/recommendation.service';

// Extend Request type to include user
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

// Create a new recommendation
const createRecommendationHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { propertyId, recipientEmail, message } = authReq.body;
    const recommendation = await createRecommendation(
      propertyId,
      authReq.user._id,
      recipientEmail,
      message
    );
    res.json(recommendation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get recommendations received by the user
const getReceivedRecommendationsHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const recommendations = await getReceivedRecommendations(authReq.user._id);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get recommendations sent by the user
const getSentRecommendationsHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const recommendations = await getSentRecommendations(authReq.user._id);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a recommendation as viewed
const markRecommendationAsViewedHandler: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const recommendation = await markRecommendationAsViewed(req.params.id, authReq.user._id);
    res.json(recommendation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

router.post('/', createRecommendationHandler);
router.get('/received', getReceivedRecommendationsHandler);
router.get('/sent', getSentRecommendationsHandler);
router.patch('/:id/view', markRecommendationAsViewedHandler);

export default router; 