import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/news/hero-section";
import { CategoryFilters } from "@/components/news/category-filters";
import { ArticleCard } from "@/components/news/article-card";
import { AiChat } from "@/components/sidebar/ai-chat";
import { TrendingTopics } from "@/components/sidebar/trending-topics";
import { AnalyticsDashboard } from "@/components/sidebar/analytics-dashboard";
import { QuickActions } from "@/components/sidebar/quick-actions";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Article } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", selectedCategory !== "Hammasi" ? selectedCategory : undefined],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const categories = [
    "Hammasi",
    "Texnologiya", 
    "AI & ML",
    "Biznes",
    "Siyosat",
    "Sport",
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredArticles = searchQuery 
    ? articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Area */}
          <main className="lg:col-span-8">
            <HeroSection />
            
            <CategoryFilters 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <section className="space-y-6" data-testid="articles-section">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-16 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12" data-testid="no-articles">
                  <p className="text-muted-foreground">Hech qanday maqola topilmadi.</p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              )}
            </section>

            {!isLoading && filteredArticles.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  variant="secondary" 
                  size="lg"
                  data-testid="button-load-more"
                >
                  Ko'proq yuklash
                </Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <AiChat />
            <TrendingTopics />
            <AnalyticsDashboard />
            <QuickActions />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
