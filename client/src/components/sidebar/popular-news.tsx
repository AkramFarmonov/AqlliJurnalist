import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import { Link } from "wouter";

export function PopularNews() {
  function timeAgo(date?: string | Date) {
    if (!date) return "";
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "hozir";
    if (minutes < 60) return `${minutes} daqiqa avval`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} soat avval`;
    const days = Math.floor(hours / 24);
    return `${days} kun avval`;
  }
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
              <Link href={`/article/${a.id}`} className="group flex items-center gap-3">
                {a.imageUrl ? (
                  <div className="relative overflow-hidden rounded w-16 h-12 flex-shrink-0 border border-border">
                    <img
                      src={a.imageUrl}
                      alt={a.title}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 768px) 25vw, 160px"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>
                ) : (
                  <div className="w-16 h-12 rounded-md border border-dashed border-border bg-muted" />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {a.title}
                  </p>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{a.views} ko'rishlar</span>
                    <span>·</span>
                    <span>{timeAgo(a.publishedAt as unknown as string)}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
