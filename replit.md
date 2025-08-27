# Overview

This is a modern AI-powered news platform called "Aqlli Jurnalist" (Smart Journalist) that generates and displays news articles in Uzbek language. The application features real-time AI chat functionality, trending topics analysis, analytics dashboard, and automated article generation using OpenAI's GPT models. It's built as a full-stack TypeScript application with a React frontend and Express backend, utilizing PostgreSQL for data persistence and WebSocket for real-time communication.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## August 27, 2025 - Migration and Production Ready
- ✅ **Replit Migration**: Successfully migrated project from Agent to Replit environment
- ✅ **API Keys Configuration**: All required secrets configured (GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, UNSPLASH_ACCESS_KEY)
- ✅ **Automated Content Generation**: AI-powered article generation working with 30-minute scheduling (9:00-21:00)
- ✅ **Production Build**: Added Dockerfile, render.yaml, and build scripts for deployment
- ✅ **Category Filtering System**: Successfully implemented category-based article filtering
- ✅ **Telegram Bot Integration**: Fully operational with image posting and notifications
- ✅ **Real-time Features**: WebSocket chat, trending topics, analytics dashboard all functional
- ✅ **UI Improvements**: Replaced QuickActions with SimilarArticles component on article pages
- ✅ **SEO Optimization**: Added sitemap.xml generator, 404/500 error pages, meta tags
- ✅ **PWA Configuration**: Complete with manifest.json and service worker

## Deploy Ready Features
1. **Render Deployment**: Complete configuration files ready for Render.com deployment
2. **Environment Variables**: All secrets properly configured for production
3. **Automated Scheduling**: Content generation every 30 minutes during business hours
4. **Error Handling**: Robust fallback systems for API quota limits
5. **Production Build**: Optimized build process with Vite and ESBuild

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: Custom WebSocket hook for real-time chat functionality
- **Responsive Design**: Mobile-first approach with responsive grid layouts

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with WebSocket endpoints for real-time features
- **Middleware**: Custom logging, JSON parsing, and error handling middleware
- **Development Server**: Vite integration for development with hot module replacement

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL connection
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Fallback**: MemStorage class providing fallback data storage for development

## Authentication and Authorization
- **Current State**: Basic user schema exists but authentication is not yet implemented
- **Planned Features**: Username/password based authentication with session management

## External Service Integrations

### AI Services
- **Primary AI Provider**: Google Gemini 1.5 Flash for article generation and chat responses
- **Content Generation**: Automated article creation based on trending topics
- **Chat Bot**: Real-time AI-powered chat assistance

### News Data Sources
- **News API**: Integration for fetching trending news and search functionality
- **Content Categorization**: Support for multiple news categories (Technology, AI/ML, Business, Politics, Sports)

### Communication Services
- **Telegram Bot**: Integrated Telegram bot for posting articles and sending notifications
- **Channel Publishing**: Automatic article posting to Telegram channels with proper formatting
- **Notification System**: Admin notifications and updates via Telegram

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Error Handling**: Runtime error overlay for development debugging

## Key Design Patterns
- **Component Composition**: Modular UI components with clear separation of concerns
- **Custom Hooks**: Reusable logic for WebSocket connections, mobile detection, and toast notifications
- **Type Safety**: Full TypeScript integration with shared schema validation using Zod
- **Real-time Updates**: WebSocket-based real-time communication for chat and live updates
- **Responsive Layout**: Three-column layout with collapsible sidebar for different screen sizes

## Performance Optimizations
- **Query Caching**: React Query with customized cache settings and automatic refetching
- **Code Splitting**: Vite-based bundling with optimized build output
- **Image Optimization**: Responsive image handling with proper aspect ratios
- **WebSocket Connection Management**: Automatic reconnection and connection state management