import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateArticle, generateChatResponse, analyzeTrends } from "./services/gemini";
import { newsApiService } from "./services/newsApi";
import { insertArticleSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat') {
          // Save user message
          await storage.createChatMessage({
            message: message.content,
            isBot: false,
          });

          // Generate AI response
          const aiResponse = await generateChatResponse(message.content);
          
          // Save AI response
          const botMessage = await storage.createChatMessage({
            message: aiResponse,
            isBot: true,
          });

          // Broadcast to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_response',
                message: botMessage,
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  });

  // Articles API
  app.get("/api/articles", async (req, res) => {
    try {
      const { limit, category } = req.query;
      const articles = await storage.getArticles(
        limit ? parseInt(limit as string) : undefined,
        category as string
      );
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      // Increment view count
      await storage.updateArticleStats(req.params.id, 'views');
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validation = insertArticleSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const article = await storage.createArticle(validation.data);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.post("/api/articles/generate", async (req, res) => {
    try {
      const { topic, category } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const { fetchImageByKeyword } = await import("./services/unsplash");
      const generatedArticle = await generateArticle(topic, category);
      
      // Fetch relevant image from Unsplash
      const imageUrl = await fetchImageByKeyword(topic);
      
      const article = await storage.createArticle({
        ...generatedArticle,
        isAiGenerated: true,
        imageUrl: imageUrl,
      });

      res.json(article);
    } catch (error) {
      console.error("Article generation error:", error);
      res.status(500).json({ error: "Failed to generate article" });
    }
  });

  app.get("/api/articles/search/:query", async (req, res) => {
    try {
      const articles = await storage.searchArticles(req.params.query);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  // Trends API
  app.get("/api/trends", async (req, res) => {
    try {
      const trends = await storage.getTrends();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  app.post("/api/trends/analyze", async (req, res) => {
    try {
      const articles = await storage.getArticles(50);
      const trends = await analyzeTrends(articles);
      
      // Update existing trends or create new ones
      for (const trend of trends) {
        const existingTrends = await storage.getTrends();
        const existing = existingTrends.find(t => t.topic.includes(trend.topic));
        
        if (existing) {
          await storage.updateTrend(existing.id, {
            posts: existing.posts + Math.floor(trend.relevance / 10),
          });
        } else {
          await storage.createTrend({
            topic: `#${trend.topic}`,
            posts: Math.floor(trend.relevance * 10),
            changePercent: Math.floor(Math.random() * 20) - 10,
          });
        }
      }
      
      const updatedTrends = await storage.getTrends();
      res.json(updatedTrends);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze trends" });
    }
  });

  // Chat API
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Analytics API
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // External news integration
  app.get("/api/news/trending", async (req, res) => {
    try {
      const { category } = req.query;
      const newsData = await newsApiService.fetchTrendingNews(category as string);
      res.json(newsData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trending news" });
    }
  });

  // SEO Sitemap endpoint
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      const baseUrl = "https://aqlli-jurnalist.replit.app";
      
      // Generate XML sitemap
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${articles.map(article => `
  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <lastmod>${article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).json({ error: "Failed to generate sitemap" });
    }
  });

  return httpServer;
}
