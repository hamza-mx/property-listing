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
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/property_listings?retryWrites=true&w=majority
REDIS_URL=your_redis_url
JWT_SECRET=ed2392e2b25820ee34c22dfff04f061bff66e0f937c55a6adb22f77ee0929a6b
JWT_EXPIRES_IN=24h
NODE_ENV=production
```