import { Request } from 'express';
import Property from '../models/property.model';

interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

interface FilterQuery {
  type?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: string;
  listingType?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };
}

// Create a new property
export const createProperty = async (req: AuthRequest) => {
  const property = new Property({
    ...req.body,
    owner: req.user._id
  });
  await property.save();
  return property;
};

// Get all properties with filters
export const getProperties = async (req: Request) => {
  const {
    type,
    city,
    state,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    furnished,
    listingType
  } = req.query;

  const query: FilterQuery = {};

  if (type) query.type = type as string;
  if (city) query.city = city as string;
  if (state) query.state = state as string;
  if (bedrooms) query.bedrooms = Number(bedrooms);
  if (bathrooms) query.bathrooms = Number(bathrooms);
  if (furnished) query.furnished = furnished as string;
  if (listingType) query.listingType = listingType as string;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  return Property.find(query)
    .populate('owner', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

// Get a single property
export const getProperty = async (req: Request) => {
  return Property.findById(req.params.id)
    .populate('owner', 'firstName lastName email');
};

// Update a property
export const updateProperty = async (req: AuthRequest) => {
  return Property.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id
    },
    req.body,
    { new: true }
  );
};

// Delete a property
export const deleteProperty = async (req: AuthRequest) => {
  return Property.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id
  });
};

// Get property recommendations
export const getRecommendations = async (req: Request) => {
  const baseProperty = await Property.findById(req.params.id);

  if (!baseProperty) {
    throw new Error('Property not found');
  }

  // Find similar properties based on city, price range, and type
  return Property.find({
    _id: { $ne: req.params.id },
    city: baseProperty.city,
    type: baseProperty.type,
    price: {
      $gte: baseProperty.price * 0.8,
      $lte: baseProperty.price * 1.2
    }
  })
  .limit(5)
  .populate('owner', 'firstName lastName email');
}; 