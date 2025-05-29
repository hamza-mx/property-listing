import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  propertyId: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: 'Furnished' | 'Semi' | 'Unfurnished';
  availableFrom: Date;
  listedBy: 'Agent' | 'Builder' | 'Owner';
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: 'rent' | 'sale';
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  propertyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [{ type: String }],
  furnished: { type: String, enum: ['Furnished', 'Semi', 'Unfurnished'], required: true },
  availableFrom: { type: Date, required: true },
  listedBy: { type: String, enum: ['Agent', 'Builder', 'Owner'], required: true },
  tags: [{ type: String }],
  colorTheme: { type: String, required: true },
  rating: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
  listingType: { type: String, enum: ['rent', 'sale'], required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Add indexes for better query performance
propertySchema.index({ propertyId: 1 });
propertySchema.index({ state: 1, city: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ owner: 1 });

export default mongoose.model<IProperty>('Property', propertySchema); 