import { type User, type InsertUser, type Article, type InsertArticle, type Trend, type InsertTrend, type ChatMessage, type InsertChatMessage, type Analytics, type InsertAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Articles
  getArticles(limit?: number, category?: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticleStats(id: string, field: 'views' | 'comments' | 'shares'): Promise<void>;
  searchArticles(query: string): Promise<Article[]>;

  // Trends
  getTrends(): Promise<Trend[]>;
  createTrend(trend: InsertTrend): Promise<Trend>;
  updateTrend(id: string, data: Partial<Trend>): Promise<Trend | undefined>;

  // Chat Messages
  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Analytics
  getAnalytics(): Promise<Analytics | undefined>;
  updateAnalytics(data: Partial<Analytics>): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;
  private trends: Map<string, Trend>;
  private chatMessages: Map<string, ChatMessage>;
  private analytics: Analytics;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.trends = new Map();
    this.chatMessages = new Map();
    this.analytics = {
      id: randomUUID(),
      dailyReads: 12500,
      aiArticles: 156,
      activeUsers: 3200,
      topCategory: "AI & Texnologiya",
      topCategoryPercent: 68,
      date: new Date(),
    };

    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample trends
    this.createTrend({ topic: "#AI_Uzbekistan", posts: 1200, changePercent: 15 });
    this.createTrend({ topic: "#Blockchain", posts: 890, changePercent: 8 });
    this.createTrend({ topic: "#ITpark", posts: 654, changePercent: -2 });
    this.createTrend({ topic: "#Startup", posts: 432, changePercent: 12 });

    // Sample chat message
    this.createChatMessage({
      message: "Salom! Men sizga yangiliklar va trendlar haqida savollarga javob beraman. Nimani bilmoqchisiz?",
      isBot: true,
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Articles
  async getArticles(limit: number = 10, category?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (category && category !== "Hammasi") {
      articles = articles.filter(article => article.category === category);
    }
    
    return articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...insertArticle,
      id,
      views: 0,
      comments: 0,
      shares: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticleStats(id: string, field: 'views' | 'comments' | 'shares'): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article[field] += 1;
      this.articles.set(id, article);
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    const lowercaseQuery = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.category.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Trends
  async getTrends(): Promise<Trend[]> {
    return Array.from(this.trends.values())
      .sort((a, b) => b.posts - a.posts);
  }

  async createTrend(insertTrend: InsertTrend): Promise<Trend> {
    const id = randomUUID();
    const trend: Trend = {
      ...insertTrend,
      id,
      updatedAt: new Date(),
    };
    this.trends.set(id, trend);
    return trend;
  }

  async updateTrend(id: string, data: Partial<Trend>): Promise<Trend | undefined> {
    const trend = this.trends.get(id);
    if (trend) {
      const updatedTrend = { ...trend, ...data, updatedAt: new Date() };
      this.trends.set(id, updatedTrend);
      return updatedTrend;
    }
    return undefined;
  }

  // Chat Messages
  async getChatMessages(limit: number = 20): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Analytics
  async getAnalytics(): Promise<Analytics | undefined> {
    return this.analytics;
  }

  async updateAnalytics(data: Partial<Analytics>): Promise<Analytics> {
    this.analytics = { ...this.analytics, ...data };
    return this.analytics;
  }
}

export const storage = new MemStorage();
