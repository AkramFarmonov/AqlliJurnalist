import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, MessageCircle, Share2, Bot } from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { FavoriteButton } from "@/components/favorites/favorite-button";

interface ArticleCardProps {
  article: Article;
  isFeatured?: boolean;
}

export function ArticleCard({ article, isFeatured = false }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(
    article.publishedAt ? new Date(article.publishedAt) : new Date(), 
    { addSuffix: true }
  );

  // Optional external/source fields (future-proof)
  const sourceName = (article as any)?.sourceName as string | undefined;

  // Limit summary length for better UX
  const truncateSummary = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const summaryLength = isFeatured ? 150 : 100;
  const displaySummary = truncateSummary(article.summary, summaryLength);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "AI": "bg-primary/10 text-primary",
      "Texnologiya": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "Biznes": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Siyosat": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "Sport": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <Card className="news-card shadow-sm hover:shadow-md transition-all duration-200 h-full overflow-hidden" data-testid={`article-card-${article.id}`}>
      <CardContent className={`h-full flex flex-col ${isFeatured ? 'p-0' : 'p-4'}`}>
        {article.imageUrl && (
          <div className={`relative overflow-hidden ${isFeatured ? "mb-0" : "mb-3"} ${isFeatured ? "rounded-t-lg" : "rounded-lg"}`}>
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className={
                isFeatured 
                  ? "w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover hover:scale-105 transition-transform duration-300" 
                  : "w-full h-32 sm:h-36 md:h-40 object-cover hover:scale-105 transition-transform duration-300"
              }
              data-testid={`article-image-${article.id}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, 33vw"}
            />
          </div>
        )}
        
        <div className={isFeatured ? "p-6" : ""}>

        {/* Favorite button (top-right) */}
        <div className="flex justify-end mb-2">
          <FavoriteButton
            article={{
              id: article.id,
              title: article.title,
              summary: article.summary,
              imageUrl: article.imageUrl ?? undefined,
              createdAt: (article.createdAt || article.publishedAt || new Date()).toString(),
            }}
          />
        </div>
        
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className={`text-xs font-medium ${getCategoryColor(article.category)}`}
            data-testid={`article-category-${article.id}`}
          >
            {article.category}
          </Badge>
          <span className="text-muted-foreground text-xs font-medium" data-testid={`article-time-${article.id}`}>
            {timeAgo}
          </span>
          {article.isAiGenerated && (
            <div className="flex items-center space-x-1">
              <Bot className="text-primary text-xs w-3 h-3" />
              <span className="text-xs text-primary" data-testid={`article-ai-badge-${article.id}`}>
                AI Generated
              </span>
            </div>
          )}
          {sourceName && (
            <Badge variant="outline" className="text-[10px]">
              {sourceName}
            </Badge>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <Link href={`/article/${article.id}`}>
            <h3 
              className={`${isFeatured ? 'text-3xl' : 'text-xl'} font-bold text-foreground mb-3 hover:text-primary cursor-pointer transition-colors line-clamp-2 md:line-clamp-3`}
              data-testid={`article-title-${article.id}`}
            >
              {article.title}
            </h3>
          </Link>
          
          <p 
            className={`text-muted-foreground ${isFeatured ? 'text-base' : 'text-sm'} mb-4 flex-1 leading-relaxed line-clamp-3 md:line-clamp-4`}
            data-testid={`article-summary-${article.id}`}
          >
            {displaySummary}
          </p>
        </div>
        
        <div className="mt-auto pt-3 border-t border-border">
          {/* Stats row */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer" data-testid={`article-views-${article.id}`}>
                <Eye className="w-3 h-3" />
                <span className="text-xs">{article.views}</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer" data-testid={`article-comments-${article.id}`}>
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">{article.comments}</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer" data-testid={`article-shares-${article.id}`}>
                <Share2 className="w-3 h-3" />
                <span className="text-xs">{article.shares}</span>
              </span>
            </div>
          </div>
          
          {/* Button row */}
          <div className="w-full">
            <Link href={`/article/${article.id}`} className="block w-full">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-primary hover:bg-primary/10 font-medium text-sm justify-center"
                data-testid={`button-read-article-${article.id}`}
              >
                Davomini o'qish →
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
