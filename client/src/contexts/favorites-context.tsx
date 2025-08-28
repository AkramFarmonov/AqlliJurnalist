import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  createdAt: string;
}

interface FavoritesContextType {
  favorites: Article[];
  addToFavorites: (article: Article) => void;
  removeFromFavorites: (articleId: string) => void;
  isFavorite: (articleId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'aqlli-jurnalist-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Article[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (article: Article) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === article.id);
      return exists ? prev : [...prev, article];
    });
  };

  const removeFromFavorites = (articleId: string) => {
    setFavorites(prev => prev.filter(article => article.id !== articleId));
  };

  const isFavorite = (articleId: string) => {
    return favorites.some(article => article.id === articleId);
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        addToFavorites, 
        removeFromFavorites, 
        isFavorite 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
