import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface SimilarArticlesProps {
  currentArticleId: string;
  category: string;
}

export function SimilarArticles({ currentArticleId, category }: SimilarArticlesProps) {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", category],
    select: (data) => data?.filter(article => article.id !== currentArticleId).slice(0, 4) || [],
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "AI": "bg-primary/10 text-primary",
      "Texnologiya": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "Transport": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "IT va Biznes": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "Ta'lim": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      "Biznes": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Siyosat": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "Sport": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  if (isLoading) {
    return (
      <Card data-testid="similar-articles-loading">
        <CardHeader>
          <CardTitle>O'xshash Maqolalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!articles?.length) {
    return (
      <Card data-testid="similar-articles-empty">
        <CardHeader>
          <CardTitle>O'xshash Maqolalar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Bu kategoriyada boshqa maqolalar topilmadi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="similar-articles">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          O'xshash Maqolalar
          <Badge variant="secondary" className="text-xs">
            {articles.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {articles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <div 
                className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer group"
                data-testid={`similar-article-${article.id}`}
              >
                <h4 className="font-medium text-sm mb-2 group-hover:text-primary line-clamp-2">
                  {article.title}
                </h4>
                
                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`text-xs ${getCategoryColor(article.category)}`}
                      variant="secondary"
                    >
                      {article.category}
                    </Badge>
                    
                    {article.views && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.views}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : "Yangi"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}