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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', propertyRoutes);
app.use('/api', userRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found' });
});

// Connect to databases and start server
const startServer = async () => {
  try {
    await connectMongoDB();
    await connectRedis();

    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Set timeouts
    server.timeout = 30000; // 30 seconds
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export for Vercel
export default app;

// Start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  startServer();
} 