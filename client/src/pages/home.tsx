import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/news/hero-section";
import { BreakingNewsTicker } from "@/components/news/breaking-news-ticker";
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <main className="lg:col-span-8">
            <HeroSection />
            
            <BreakingNewsTicker />
            
            <CategoryFilters 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <section className="mt-8" data-testid="articles-section">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                      <div className="space-y-4">
                        <div className="w-full h-48 bg-muted rounded-lg"></div>
                        <div className="space-y-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredArticles.map((article, index) => (
                    <div 
                      key={article.id}
                      className={index === 0 ? "md:col-span-2 xl:col-span-2" : "col-span-1"}
                    >
                      <ArticleCard 
                        article={article} 
                        isFeatured={index === 0}
                      />
                    </div>
                  ))}
                </div>
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
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 lg:h-fit">
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
