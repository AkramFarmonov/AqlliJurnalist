import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Trend } from "@shared/schema";

export function TrendingTopics() {
  const { data: trends = [], isLoading } = useQuery<Trend[]>({
    queryKey: ["/api/trends"],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <Card data-testid="trending-topics-loading">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="text-primary" />
            <span>Trendlar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="trending-topics">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="text-primary" />
          <span>Trendlar</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {trends.length === 0 ? (
            <p className="text-sm text-muted-foreground" data-testid="no-trends">
              Hozircha trendlar mavjud emas.
            </p>
          ) : (
            trends.map((trend) => (
              <div 
                key={trend.id} 
                className="flex items-center justify-between"
                data-testid={`trend-${trend.id}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground" data-testid={`trend-topic-${trend.id}`}>
                    {trend.topic}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`trend-posts-${trend.id}`}>
                    {trend.posts} posts
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className={`text-xs font-medium ${
                      trend.changePercent >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                    data-testid={`trend-change-${trend.id}`}
                  >
                    {trend.changePercent >= 0 ? "+" : ""}{trend.changePercent}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
