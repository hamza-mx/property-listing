import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB, connectRedis } from './config/database';
import propertyRoutes from './routes/propertyRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', propertyRoutes);
app.use('/api', userRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to databases
const startServer = async () => {
  try {
    await connectMongoDB();
    await connectRedis();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 