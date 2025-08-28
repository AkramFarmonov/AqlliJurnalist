import { useFavorites } from "@/contexts/favorites-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartOff } from "lucide-react";
import { Link } from "wouter";
import { EmptyState } from "@/components/ui/empty-state";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Sevimlilar ro'yxati bo'sh"
          description="Maqolalarni saqlash uchun yurakcha tugmasini bosing"
        >
          <Button asChild>
            <Link href="/">Bosh sahifaga qaytish</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sevimli Maqolalar</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((article) => (
          <Card key={article.id} className="relative">
            <CardHeader>
              <CardTitle className="text-xl line-clamp-2">
                <Link to={`/article/${article.id}`} className="hover:underline">
                  {article.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {article.summary}
              </p>
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/article/${article.id}`}>O'qish</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromFavorites(article.id)}
                  className="text-destructive hover:text-destructive/90"
                  title="O'chirish"
                >
                  <HeartOff className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
