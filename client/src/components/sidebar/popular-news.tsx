import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import { Link } from "wouter";

export function PopularNews() {
  const { data = [], isLoading, error } = useQuery<Article[]>({
    queryKey: ["popular-articles"],
    queryFn: async () => {
      const res = await fetch("/api/articles", { cache: "no-store" });
      if (!res.ok) throw new Error("Popular news fetch failed");
      const all: Article[] = await res.json();
      return all
        .slice()
        .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
        .slice(0, 5);
    },
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <section className="bg-card border border-border rounded-xl p-4" data-testid="widget-popular-news">
      <h3 className="text-sm font-semibold mb-3">Mashhur yangiliklar</h3>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">Ma'lumot yuklanmadi</p>
      ) : (
        <ul className="space-y-3">
          {data.map((a) => (
            <li key={a.id} className="group">
              <Link href={`/article/${a.id}`} className="text-sm text-foreground hover:text-primary transition-colors line-clamp-2">
                {a.title}
              </Link>
              <div className="text-xs text-muted-foreground">{a.views} ko'rishlar</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
