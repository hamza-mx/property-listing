import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt?: number;
  };
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  status: 'available' | 'sold' | 'pending';
  images: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  features: {
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    yearBuilt: Number
  },
  type: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'townhouse'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'pending'],
    default: 'available'
  },
  images: [String],
  amenities: [String]
}, {
  timestamps: true
});

// Add indexes for common queries
PropertySchema.index({ 'location.city': 1, 'location.state': 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ status: 1 });

export default mongoose.model<IProperty>('Property', PropertySchema); 