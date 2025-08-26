interface NewsApiResponse {
  articles: {
    title: string;
    description: string;
    content: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      name: string;
    };
  }[];
}

export class NewsApiService {
  private apiKey: string;
  private baseUrl = "https://newsapi.org/v2";

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || process.env.NEWS_API_KEY_ENV_VAR || "default_key";
  }

  async fetchTrendingNews(category?: string, country: string = "us"): Promise<NewsApiResponse> {
    try {
      const categoryParam = category ? `&category=${category}` : "";
      const response = await fetch(
        `${this.baseUrl}/top-headlines?country=${country}${categoryParam}&apiKey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`News API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch trending news:", error);
      return { articles: [] };
    }
  }

  async searchNews(query: string): Promise<NewsApiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`News API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to search news:", error);
      return { articles: [] };
    }
  }

  async getNewsByCategory(category: string): Promise<NewsApiResponse> {
    return this.fetchTrendingNews(category);
  }
}

export const newsApiService = new NewsApiService();
