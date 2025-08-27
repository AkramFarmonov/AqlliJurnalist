import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, MessageCircle, Share2, Bot } from "lucide-react";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  isFeatured?: boolean;
}

export function ArticleCard({ article, isFeatured = false }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(
    article.publishedAt ? new Date(article.publishedAt) : new Date(), 
    { addSuffix: true }
  );

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
    <Card className="news-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full" data-testid={`article-card-${article.id}`}>
      <CardContent className="p-6 flex flex-col flex-1">
        <article className={isFeatured ? "flex flex-col space-y-4 flex-1" : "flex items-start space-x-4 flex-1"}>
          {article.imageUrl && (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className={isFeatured ? "w-full h-64 rounded-lg object-cover" : "w-24 h-24 rounded-lg object-cover flex-shrink-0"}
              data-testid={`article-image-${article.id}`}
            />
          )}
          
          <div className="flex-1 flex flex-col">
            <div className="flex items-center space-x-2 mb-2">
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
            </div>
            
            <div className="flex-1 flex flex-col">
              <h3 
                className={`${isFeatured ? 'text-3xl' : 'text-xl'} font-bold text-foreground mb-2 hover:text-primary cursor-pointer transition-colors`}
                data-testid={`article-title-${article.id}`}
              >
                {article.title}
              </h3>
              
              <p 
                className={`text-muted-foreground ${isFeatured ? 'text-base' : 'text-sm'} mb-3 flex-1`}
                data-testid={`article-summary-${article.id}`}
              >
                {article.summary}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer" data-testid={`article-views-${article.id}`}>
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{article.views}</span>
                  <span className="text-xs">ko'rishlar</span>
                </span>
                <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer" data-testid={`article-comments-${article.id}`}>
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{article.comments}</span>
                  <span className="text-xs">fikrlar</span>
                </span>
                <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer" data-testid={`article-shares-${article.id}`}>
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">{article.shares}</span>
                  <span className="text-xs">ulashish</span>
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary hover:bg-primary/10"
                data-testid={`button-read-article-${article.id}`}
              >
                O'qish
              </Button>
            </div>
          </div>
        </article>
      </CardContent>
    </Card>
  );
}
