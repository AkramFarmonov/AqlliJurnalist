import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/news/hero-section";
import { BreakingNewsTicker } from "@/components/news/breaking-news-ticker";
import { CategoryFilters } from "@/components/news/category-filters";
import { ArticleCard } from "@/components/news/article-card";
import { AiChat } from "@/components/sidebar/ai-chat";
import { TrendingTopics } from "@/components/sidebar/trending-topics";
import { AnalyticsDashboard } from "@/components/sidebar/analytics-dashboard";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import type { Article } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["articles", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "Hammasi" 
        ? "/api/articles"
        : `/api/articles?category=${encodeURIComponent(selectedCategory)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
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
      <Helmet>
        <title>Aqlli Jurnalist - O'zbekistonning Eng Yangi AI-Powered Yangilik Platformasi</title>
        <meta name="description" content="Aqlli Jurnalist - O'zbekistondagi eng so'nggi yangiliklar, texnologiya, AI, biznes va siyosat haqida tez va ishonchli ma'lumotlar. Real vaqtda yangilanuvchi maqolalar va chuqur tahlillar." />
        <meta name="keywords" content="O'zbekiston yangiliklar, AI yangiliklar, texnologiya, biznes, siyosat, sport, sun'iy intellekt, Toshkent yangiliklar" />
        <meta property="og:title" content="Aqlli Jurnalist - AI-Powered Yangilik Platformasi" />
        <meta property="og:description" content="O'zbekistondagi eng so'nggi yangiliklar va AI tomonidan yaratilgan maqolalar. Real vaqtda yangilanuvchi ma'lumotlar va professional tahlillar." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aqlli-jurnalist.replit.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aqlli Jurnalist - AI-Powered Yangilik Platformasi" />
        <meta name="twitter:description" content="O'zbekistondagi eng so'nggi yangiliklar va AI maqolalari" />
        <link rel="canonical" href="https://aqlli-jurnalist.replit.app" />
      </Helmet>
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
                <div className="space-y-8">
                  {/* Featured Article */}
                  {filteredArticles.length > 0 && (
                    <div className="w-full">
                      <ArticleCard 
                        article={filteredArticles[0]} 
                        isFeatured={true}
                      />
                    </div>
                  )}
                  
                  {/* Regular Articles Grid */}
                  {filteredArticles.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                      {filteredArticles.slice(1).map((article) => (
                        <div key={article.id} className="h-full">
                          <ArticleCard 
                            article={article} 
                            isFeatured={false}
                          />
                        </div>
                      ))}
                    </div>
                  )}
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

          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
