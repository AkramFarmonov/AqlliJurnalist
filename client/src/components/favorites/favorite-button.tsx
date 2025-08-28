import { Heart, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/favorites-context";

interface FavoriteButtonProps {
  article: {
    id: string;
    title: string;
    summary: string;
    imageUrl?: string;
    createdAt: string;
  };
  className?: string;
}

export function FavoriteButton({ article, className = "" }: FavoriteButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isArticleFavorite = isFavorite(article.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isArticleFavorite) {
      removeFromFavorites(article.id);
    } else {
      addToFavorites(article);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={`text-muted-foreground hover:text-destructive ${className}`}
      aria-label={isArticleFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
    >
      {isArticleFavorite ? (
        <HeartOff className="h-5 w-5 fill-destructive text-destructive" />
      ) : (
        <Heart className="h-5 w-5" />
      )}
    </Button>
  );
}
