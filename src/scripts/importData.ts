import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/property.model';
import User from '../models/user.model';

dotenv.config();

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/property-listings';

// Create a default admin user for property ownership
async function createDefaultAdmin() {
  try {
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      const newAdmin = new User({
        email: 'admin@example.com',
        password: 'admin123', // This will be hashed by the User model
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      await newAdmin.save();
      return newAdmin._id;
    }
    return admin._id;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Import properties from CSV
async function importProperties() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const adminId = await createDefaultAdmin();
    console.log('Admin user created/found');

    const results: any[] = [];
    fs.createReadStream('data/properties.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Clear existing properties
          await Property.deleteMany({});
          console.log('Cleared existing properties');

          // Transform and insert properties
          const properties = results.map(row => ({
            propertyId: row.id,
            title: row.title,
            type: row.type,
            price: parseFloat(row.price),
            state: row.state,
            city: row.city,
            areaSqFt: parseInt(row.areaSqFt),
            bedrooms: parseInt(row.bedrooms),
            bathrooms: parseInt(row.bathrooms),
            amenities: row.amenities.split('|'),
            furnished: row.furnished,
            availableFrom: new Date(row.availableFrom),
            listedBy: row.listedBy,
            tags: row.tags.split('|'),
            colorTheme: row.colorTheme,
            rating: parseFloat(row.rating),
            isVerified: row.isVerified === 'True',
            listingType: row.listingType,
            owner: adminId
          }));

          // Insert properties in batches
          const batchSize = 100;
          for (let i = 0; i < properties.length; i += batchSize) {
            const batch = properties.slice(i, i + batchSize);
            await Property.insertMany(batch);
            console.log(`Imported properties ${i + 1} to ${Math.min(i + batchSize, properties.length)}`);
          }

          console.log('Data import completed successfully');
          process.exit(0);
        } catch (error) {
          console.error('Error importing data:', error);
          process.exit(1);
        }
      });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

importProperties(); 