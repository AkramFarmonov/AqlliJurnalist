import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, MessageCircle, Share2, Calendar, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function ArticlePage() {
  const [, params] = useRoute("/article/:id");
  const articleId = params?.id;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ["/api/articles", articleId],
    enabled: !!articleId,
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
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar onSearch={() => {}} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar onSearch={() => {}} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Maqola topilmadi</h1>
            <p className="text-muted-foreground mb-6">
              Kechirasiz, siz qidirgan maqola mavjud emas yoki o'chirilgan.
            </p>
            <Link href="/">
              <Button variant="default" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Bosh sahifaga qaytish
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(
    article.publishedAt ? new Date(article.publishedAt) : new Date(), 
    { addSuffix: true }
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onSearch={() => {}} />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Badge 
              variant="secondary" 
              className={`text-sm font-medium ${getCategoryColor(article.category)}`}
              data-testid="article-category"
            >
              {article.category}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm space-x-2">
              <Calendar className="w-4 h-4" />
              <span data-testid="article-time">{timeAgo}</span>
            </div>
            {article.isAiGenerated && (
              <div className="flex items-center space-x-1">
                <Bot className="text-primary w-4 h-4" />
                <span className="text-sm text-primary" data-testid="article-ai-badge">
                  AI Generated
                </span>
              </div>
            )}
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
            data-testid="article-title"
          >
            {article.title}
          </h1>
          
          <p 
            className="text-xl text-muted-foreground leading-relaxed"
            data-testid="article-summary"
          >
            {article.summary}
          </p>
        </header>

        {/* Article Image */}
        {article.imageUrl && (
          <div className="mb-8">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-96 rounded-xl object-cover"
              data-testid="article-image"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <div 
            className="text-foreground leading-relaxed whitespace-pre-line"
            data-testid="article-content"
          >
            {article.content}
          </div>
        </div>

        {/* Article Stats */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="flex items-center space-x-6 text-muted-foreground">
            <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer" data-testid="article-views">
              <Eye className="w-5 h-5" />
              <span className="font-medium">{article.views}</span>
              <span className="text-sm">ko'rishlar</span>
            </span>
            <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer" data-testid="article-comments">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{article.comments}</span>
              <span className="text-sm">fikrlar</span>
            </span>
            <span className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer" data-testid="article-shares">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">{article.shares}</span>
              <span className="text-sm">ulashish</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Fikr bildirish
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Ulashish
            </Button>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Teglar:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  data-testid={`article-tag-${index}`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}