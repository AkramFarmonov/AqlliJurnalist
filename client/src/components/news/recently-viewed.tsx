import { useRecentlyViewed } from "@/contexts/recently-viewed-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function RecentlyViewedSection() {
  const { items, clearAll } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section id="recently-viewed" className="mt-10 scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Yaqinda ko'rilganlar</h2>
        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
          Tozalash
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.slice(0, 6).map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle className="text-base line-clamp-2">
                <Link href={`/article/${article.id}`} className="hover:underline">
                  {article.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {article.summary}
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={`/article/${article.id}`}>O'qish</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
