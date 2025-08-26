import { apiRequest } from "./queryClient";

export const api = {
  articles: {
    getAll: (params?: { limit?: number; category?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.category) searchParams.append('category', params.category);
      
      const url = `/api/articles${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      return fetch(url).then(res => res.json());
    },
    
    getById: (id: string) => 
      fetch(`/api/articles/${id}`).then(res => res.json()),
    
    search: (query: string) => 
      fetch(`/api/articles/search/${encodeURIComponent(query)}`).then(res => res.json()),
    
    create: (data: any) => 
      apiRequest("POST", "/api/articles", data),
    
    generate: (data: { topic: string; category?: string }) => 
      apiRequest("POST", "/api/articles/generate", data),
  },
  
  trends: {
    getAll: () => 
      fetch("/api/trends").then(res => res.json()),
    
    analyze: () => 
      apiRequest("POST", "/api/trends/analyze", {}),
  },
  
  chat: {
    getMessages: () => 
      fetch("/api/chat/messages").then(res => res.json()),
  },
  
  analytics: {
    get: () => 
      fetch("/api/analytics").then(res => res.json()),
  },
  
  news: {
    getTrending: (category?: string) => {
      const url = `/api/news/trending${category ? `?category=${category}` : ''}`;
      return fetch(url).then(res => res.json());
    },
  },
};
