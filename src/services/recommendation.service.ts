import mongoose from 'mongoose';
import Recommendation from '../models/recommendation.model';
import User from '../models/user.model';
import Property from '../models/property.model';

export const createRecommendation = async (
  propertyId: string,
  fromUserId: string,
  recipientEmail: string,
  message?: string
) => {
  try {
    // Find recipient user by email
    const recipientUser = await User.findOne({ email: recipientEmail });
    if (!recipientUser) {
      throw new Error('Recipient user not found');
    }

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Check if recommendation already exists
    const existingRecommendation = await Recommendation.findOne({
      property: propertyId,
      fromUser: fromUserId,
      toUser: recipientUser._id,
      status: 'pending'
    });

    if (existingRecommendation) {
      throw new Error('You have already recommended this property to this user');
    }

    // Create new recommendation
    const recommendation = new Recommendation({
      property: propertyId,
      fromUser: fromUserId,
      toUser: recipientUser._id,
      message,
      status: 'pending'
    });

    await recommendation.save();
    return recommendation;
  } catch (error) {
    throw error;
  }
};

export const getReceivedRecommendations = async (userId: string) => {
  try {
    return await Recommendation.find({ toUser: userId })
      .populate('property')
      .populate('fromUser', 'firstName lastName email')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

export const getSentRecommendations = async (userId: string) => {
  try {
    return await Recommendation.find({ fromUser: userId })
      .populate('property')
      .populate('toUser', 'firstName lastName email')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

export const markRecommendationAsViewed = async (recommendationId: string, userId: string) => {
  try {
    const recommendation = await Recommendation.findOne({
      _id: recommendationId,
      toUser: userId,
      status: 'pending'
    });

    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    recommendation.status = 'viewed';
    await recommendation.save();
    return recommendation;
  } catch (error) {
    throw error;
  }
}; 