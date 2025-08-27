# Overview

This is a modern AI-powered news platform called "Aqlli Jurnalist" (Smart Journalist) that generates and displays news articles in Uzbek language. The application features real-time AI chat functionality, trending topics analysis, analytics dashboard, and automated article generation using OpenAI's GPT models. It's built as a full-stack TypeScript application with a React frontend and Express backend, utilizing PostgreSQL for data persistence and WebSocket for real-time communication.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## August 27, 2025 - Project Completion
- ✅ **Category Filtering System**: Successfully implemented category-based article filtering (Texnologiya, AI & ML, Biznes, Siyosat, Sport)
- ✅ **Telegram Bot Integration**: Fully operational with image posting, automated scheduling every 30 minutes
- ✅ **Sample Articles**: Created comprehensive sample articles for all categories with proper Uzbek content
- ✅ **API Endpoints**: All backend APIs working correctly with proper category parameter handling
- ✅ **Frontend Query System**: Updated React Query implementation to properly handle category filters
- ✅ **Real-time Features**: WebSocket chat, trending topics, analytics dashboard all functional

## Next Steps for Production
1. **API Keys Setup**: Configure all required secrets (DATABASE_URL, GEMINI_API_KEY, UNSPLASH_ACCESS_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
2. **Monitoring**: Watch first automated article generation cycle
3. **Analytics**: Set up Google Analytics and Search Console
4. **User Feedback**: Collect feedback through social media and website

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