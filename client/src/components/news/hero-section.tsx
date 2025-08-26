import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export function HeroSection() {
  return (
    <section className="mb-8" data-testid="hero-section">
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-primary-foreground">
        <div className="flex items-center space-x-2 mb-3">
          <Flame className="text-yellow-300" />
          <Badge variant="secondary" className="text-sm font-medium bg-white/20 text-white hover:bg-white/30">
            TRENDING
          </Badge>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="hero-title">
          AI Texnologiyalari O'zbekistonda Rivojlanmoqda
        </h2>
        <p className="text-primary-foreground/90 mb-4" data-testid="hero-description">
          Sun'iy intellekt sohasidagi eng so'nggi yangiliklar va trendlarni kuzatib boring...
        </p>
        <Button 
          variant="secondary" 
          className="bg-white text-primary hover:bg-gray-100"
          data-testid="button-read-more"
        >
          To'liq o'qish
        </Button>
      </div>
    </section>
  );
}
