# Aqlli Jurnalist - AI-Powered News Platform

Modern AI-powered news platform that generates and displays news articles in Uzbek language with real-time AI chat functionality and automated content generation.

## Features

- 🤖 AI-powered article generation using Google Gemini
- 📱 Real-time WebSocket chat functionality
- 📊 Analytics dashboard with trending topics
- 🕒 Automated content scheduling (every 30 minutes, 9:00-21:00)
- 📬 Telegram bot integration for channel posting
- 🖼️ Unsplash image integration for articles
- 📱 Progressive Web App (PWA) support
- 🎨 Modern responsive design with dark/light themes

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS + Shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- WebSocket for real-time communication

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Google Gemini 1.5 Flash for AI generation
- Node-cron for scheduling
- Telegram Bot API integration
- Unsplash API for images

## Deployment

### Environment Variables Required:
- `GEMINI_API_KEY` - Google Gemini API key
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_CHAT_ID` - Telegram channel/chat ID
- `UNSPLASH_ACCESS_KEY` - Unsplash API key
- `DATABASE_URL` - PostgreSQL connection string (optional, uses in-memory storage as fallback)

### Deploy to Render
1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Add environment variables in Render dashboard
4. Deploy automatically

### Local Development
```bash
npm install
npm run dev
```

## Content Scheduling

The platform automatically generates and posts new articles:
- **Schedule**: Every 30 minutes from 9:00 to 21:00 (Tashkent time)
- **AI Generation**: Uses trending topic analysis or fallback topics
- **Telegram Integration**: Automatically posts to configured channel
- **Error Handling**: Robust fallback system for API quotas

## API Endpoints

- `GET /api/articles` - Get all articles with optional category filtering
- `GET /api/articles/:id` - Get specific article
- `POST /api/articles` - Create new article
- `GET /api/trends` - Get trending topics
- `GET /api/analytics` - Get platform analytics
- `GET/POST /api/chat/messages` - Chat functionality

## Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend, real-time communication via WebSockets, and automated background processes for content generation.

Built with ❤️ for the Uzbek tech community.