# Roam

AI-powered travel companion that plans, guides, and protects you in real-time.

## 🎯 Problem Statement Solution

This app addresses the TBO hackathon challenge by providing:

### ✅ Before Travel
- **AI Trip Planning** - Create trips with AI-generated personalized itineraries
- **VR Destination Previews** - Immersive 360° previews of hotels, attractions, and neighborhoods
- **Accessibility Preferences** - Set mobility, visual, hearing needs for customized recommendations

### ✅ During Travel  
- **AI Travel Assistant** - Real-time chat support for any travel questions
- **Local Guide** - AI-powered recommendations for food, safety tips, and local insights
- **Live Location Sharing** - Share GPS coordinates with emergency contacts

### ✅ At Destination
- **Emergency SOS** - One-tap emergency calling with location-aware services
- **Local Emergency Numbers** - Auto-detected based on current location
- **AI Emergency Assistant** - Instant help for lost passport, medical issues, etc.
- **Translation Support** - Multi-language interface (8 languages)

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma
- **Database**: MySQL
- **AI**: Google Gemini API

## Features

| Feature | Description |
|---------|-------------|
| 🎯 **Trip Planning** | Create and manage trips with AI assistance |
| 🗺️ **VR Preview** | 360° immersive destination previews with AI narration |
| 🤖 **AI Assistant** | Context-aware chat for travel queries |
| 📍 **Local Guide** | Real-time recommendations based on GPS location |
| 🆘 **Emergency SOS** | One-tap emergency with auto-detected local numbers |
| ♿ **Accessibility** | Wheelchair, visual, hearing, mobility preferences |
| 🌐 **Multi-language** | Support for 8 languages |
| 📱 **Responsive** | Works on desktop and mobile |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**

   Backend (`backend/.env`):
   ```env
   PORT=3001
   DATABASE_URL="postgresql://user:password@localhost:5432/roam_db?schema=public"
   JWT_SECRET=your-secret-key
   GEMINI_API_KEY=your-gemini-api-key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Set up the database:**
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Start the development servers:**
   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend (port 3001)
   npm run dev:backend

   # Terminal 2 - Frontend (port 5173)
   npm run dev:frontend
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update preferences

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips/create` - Create new trip
- `GET /api/trips/:tripId/context` - Get trip details

### AI
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/itinerary` - Generate itinerary
- `GET /api/ai/itinerary/:tripId` - Get saved itinerary
- `POST /api/ai/local-guide` - Get local recommendations
- `POST /api/ai/vr-explain` - VR explanations

### Destination
- `GET /api/destination/:name` - Get destination info
- `GET /api/destination/:name/vr-assets` - Get VR assets

### Emergency
- `POST /api/emergency/ai/emergency` - Get emergency assistance