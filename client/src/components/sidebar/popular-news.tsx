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
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 h-12 bg-muted rounded-md animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">Ma'lumot yuklanmadi</p>
      ) : (
        <ul className="space-y-3">
          {data.map((a) => (
            <li key={a.id} className="group">
              <Link href={`/article/${a.id}`} className="flex items-center gap-3">
                {a.imageUrl ? (
                  <img
                    src={a.imageUrl}
                    alt={a.title}
                    className="w-16 h-12 object-cover rounded-md border border-border flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 768px) 25vw, 160px"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-md border border-dashed border-border bg-muted" />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {a.title}
                  </p>
                  <div className="text-xs text-muted-foreground">{a.views} ko'rishlar</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
