import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc, ilike, or } from "drizzle-orm";
import { articles, trends, chatMessages, analytics, users } from "../shared/schema";
import type { IStorage } from "./storage";
import type { User, InsertUser, Article, InsertArticle, Trend, InsertTrend, ChatMessage, InsertChatMessage, Analytics, InsertAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if we already have analytics data
      const existingAnalytics = await db.select().from(analytics).limit(1);
      if (existingAnalytics.length === 0) {
        // Initialize with sample analytics
        await db.insert(analytics).values({
          dailyReads: 12500,
          aiArticles: 156,
          activeUsers: 3200,
          topCategory: "AI & Texnologiya",
          topCategoryPercent: 68,
        });
      }

      // Check if we already have trends
      const existingTrends = await db.select().from(trends).limit(1);
      if (existingTrends.length === 0) {
        // Initialize with sample trends
        await db.insert(trends).values([
          { topic: "#AI_Uzbekistan", posts: 1200, changePercent: 15 },
          { topic: "#Blockchain", posts: 890, changePercent: 8 },
          { topic: "#ITpark", posts: 654, changePercent: -2 },
          { topic: "#Startup", posts: 432, changePercent: 12 },
        ]);
      }

      // Check if we already have initial chat message
      const existingMessages = await db.select().from(chatMessages).limit(1);
      if (existingMessages.length === 0) {
        await db.insert(chatMessages).values({
          message: "Salom! Men sizga yangiliklar va trendlar haqida savollarga javob beraman. Nimani bilmoqchisiz?",
          isBot: true,
        });
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Articles
  async getArticles(limit: number = 10, category?: string): Promise<Article[]> {
    let query = db.select().from(articles);
    
    if (category && category !== "Hammasi") {
      const result = await query.where(eq(articles.category, category)).orderBy(desc(articles.publishedAt)).limit(limit);
      return result;
    }
    
    const result = await query.orderBy(desc(articles.publishedAt)).limit(limit);
    return result;
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(articleData).returning();
    return article;
  }

  async updateArticleStats(id: string, field: 'views' | 'comments' | 'shares'): Promise<void> {
    const article = await this.getArticle(id);
    if (article) {
      const currentValue = article[field] || 0;
      const updateData = { [field]: currentValue + 1 };
      await db.update(articles).set(updateData).where(eq(articles.id, id));
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    const result = await db.select().from(articles).where(
      or(
        ilike(articles.title, searchTerm),
        ilike(articles.summary, searchTerm),
        ilike(articles.category, searchTerm)
      )
    );
    return result;
  }

  // Trends
  async getTrends(): Promise<Trend[]> {
    const result = await db.select().from(trends).orderBy(desc(trends.posts));
    return result;
  }

  async createTrend(trendData: InsertTrend): Promise<Trend> {
    const [trend] = await db.insert(trends).values(trendData).returning();
    return trend;
  }

  async updateTrend(id: string, data: Partial<Trend>): Promise<Trend | undefined> {
    const [trend] = await db.update(trends).set(data).where(eq(trends.id, id)).returning();
    return trend;
  }

  // Chat Messages
  async getChatMessages(limit: number = 20): Promise<ChatMessage[]> {
    const result = await db.select().from(chatMessages)
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
    return result.reverse(); // Return in chronological order
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }

  // Analytics
  async getAnalytics(): Promise<Analytics | undefined> {
    const [analyticsData] = await db.select().from(analytics).limit(1);
    return analyticsData;
  }

  async updateAnalytics(data: Partial<Analytics>): Promise<Analytics> {
    const [analyticsData] = await db.update(analytics).set(data).returning();
    return analyticsData;
  }
}

export const dbStorage = new DatabaseStorage();