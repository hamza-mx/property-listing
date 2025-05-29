import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  property: mongoose.Types.ObjectId;
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  message?: string;
  status: 'pending' | 'viewed';
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'viewed'], default: 'pending' }
}, {
  timestamps: true
});

// Add indexes for better query performance
recommendationSchema.index({ toUser: 1, status: 1 });
recommendationSchema.index({ fromUser: 1 });
recommendationSchema.index({ property: 1 });

export default mongoose.model<IRecommendation>('Recommendation', recommendationSchema); 