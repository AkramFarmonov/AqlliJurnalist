import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  createdAt: string;
}

interface ViewedItem extends Article {
  lastViewedAt: number; // epoch ms
}

interface RecentlyViewedContextType {
  items: ViewedItem[];
  addViewed: (article: Article) => void;
  removeViewed: (id: string) => void;
  clearAll: () => void;
}

const STORAGE_KEY = 'aqlli-jurnalist-recently-viewed';

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ViewedItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addViewed = (article: Article) => {
    setItems(prev => {
      const now = Date.now();
      const without = prev.filter(it => it.id !== article.id);
      const next = [{ ...article, lastViewedAt: now }, ...without];
      // limit to 20
      return next.slice(0, 20);
    });
  };

  const removeViewed = (id: string) => setItems(prev => prev.filter(it => it.id !== id));
  const clearAll = () => setItems([]);

  const value = useMemo(() => ({ items, addViewed, removeViewed, clearAll }), [items]);

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
