import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Settings } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateArticleMutation = useMutation({
    mutationFn: async () => {
      const topics = ["AI texnologiyalari", "Blockchain yangiliklari", "Startup ecosystem", "Digital transformation"];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      return apiRequest("POST", "/api/articles/generate", {
        topic: randomTopic,
        category: "Texnologiya"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Muvaffaqiyat!",
        description: "Yangi maqola yaratildi.",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik!",
        description: "Maqola yaratishda xatolik yuz berdi.",
        variant: "destructive",
      });
    },
  });

  const analyzeTrendsMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/trends/analyze", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trends"] });
      toast({
        title: "Analiz tugallandi!",
        description: "Trendlar yangilandi.",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik!",
        description: "Trend tahlilida xatolik yuz berdi.",
        variant: "destructive",
      });
    },
  });

  const actions = [
    {
      icon: Plus,
      label: "Yangi maqola yaratish",
      onClick: () => generateArticleMutation.mutate(),
      isLoading: generateArticleMutation.isPending,
      variant: "default" as const,
      testId: "button-create-article",
    },
    {
      icon: TrendingUp,
      label: "Trend tahlili",
      onClick: () => analyzeTrendsMutation.mutate(),
      isLoading: analyzeTrendsMutation.isPending,
      variant: "secondary" as const,
      testId: "button-analyze-trends",
    },
    {
      icon: Settings,
      label: "Sozlamalar",
      onClick: () => {
        toast({
          title: "Sozlamalar",
          description: "Sozlamalar sahifasi tez orada!",
        });
      },
      isLoading: false,
      variant: "secondary" as const,
      testId: "button-settings",
    },
  ];

  return (
    <Card data-testid="quick-actions">
      <CardHeader>
        <CardTitle>Tezkor Amallar</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.label}
                variant={action.variant}
                className="w-full justify-start"
                onClick={action.onClick}
                disabled={action.isLoading}
                data-testid={action.testId}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {action.isLoading ? "Yuklanmoqda..." : action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
