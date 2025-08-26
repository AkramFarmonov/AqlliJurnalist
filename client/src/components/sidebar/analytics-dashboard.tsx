import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Analytics } from "@shared/schema";

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <Card data-testid="analytics-loading">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="text-primary" />
            <span>Analitika</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card data-testid="analytics-error">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="text-primary" />
            <span>Analitika</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Analitika ma'lumotlari mavjud emas.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <Card data-testid="analytics-dashboard">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="text-primary" />
          <span>Analitika</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between" data-testid="analytics-daily-reads">
            <span className="text-sm text-muted-foreground">Bugungi o'qishlar</span>
            <span className="font-semibold text-foreground" data-testid="daily-reads-value">
              {formatNumber(analytics.dailyReads)}
            </span>
          </div>
          
          <div className="flex items-center justify-between" data-testid="analytics-ai-articles">
            <span className="text-sm text-muted-foreground">AI maqolalar</span>
            <span className="font-semibold text-foreground" data-testid="ai-articles-value">
              {analytics.aiArticles}
            </span>
          </div>
          
          <div className="flex items-center justify-between" data-testid="analytics-active-users">
            <span className="text-sm text-muted-foreground">Faol foydalanuvchilar</span>
            <span className="font-semibold text-foreground" data-testid="active-users-value">
              {formatNumber(analytics.activeUsers)}
            </span>
          </div>
          
          <div className="bg-secondary p-3 rounded-lg" data-testid="analytics-top-category">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-secondary-foreground">Eng mashhur kategoriya</span>
              <span className="text-xs text-primary" data-testid="top-category-percent">
                {analytics.topCategoryPercent}%
              </span>
            </div>
            <Progress 
              value={analytics.topCategoryPercent} 
              className="h-2 mb-1"
              data-testid="top-category-progress"
            />
            <span className="text-xs text-muted-foreground" data-testid="top-category-name">
              {analytics.topCategory}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
