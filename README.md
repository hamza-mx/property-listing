# Property Listings API

A RESTful API for property listings with user authentication, favorites system, and Redis caching.

## Features

- User authentication with JWT
- Property CRUD operations
- User favorites system
- Redis caching
- MongoDB integration
- TypeScript support

## Prerequisites

- Node.js 14+
- MongoDB
- Redis

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Development

Run in development mode:
```bash
npm run dev
```

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (Admin only)
- `PUT /api/properties/:id` - Update property (Admin only)
- `DELETE /api/properties/:id` - Delete property (Admin only)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/favorites/:propertyId` - Add to favorites
- `DELETE /api/users/favorites/:propertyId` - Remove from favorites

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure environment variables:
   - `PORT`
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `REDIS_URL` (Upstash Redis URL)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Deploy! 