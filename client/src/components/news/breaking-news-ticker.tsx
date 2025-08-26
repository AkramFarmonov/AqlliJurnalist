import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import type { Article } from "@shared/schema";

export function BreakingNewsTicker() {
  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    select: (data) => data.slice(0, 3), // Get only the 3 most recent articles
  });

  if (articles.length === 0) return null;

  return (
    <div className="bg-red-600 dark:bg-red-700 text-white py-3 px-4 mb-6" data-testid="breaking-news-ticker">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-sm uppercase tracking-wide">
              So'nggi Yangiliklar:
            </span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center space-x-8 animate-scroll">
              {articles.map((article, index) => (
                <div key={article.id} className="flex items-center space-x-2 flex-shrink-0">
                  <ChevronRight className="w-4 h-4 text-white/80" />
                  <span 
                    className="text-sm hover:text-white/80 cursor-pointer transition-colors whitespace-nowrap"
                    data-testid={`breaking-news-title-${index}`}
                  >
                    {article.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}