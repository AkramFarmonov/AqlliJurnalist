import { useState } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePWAInstall } from "@/hooks/use-pwa-install";

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm z-50 shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">
                Aqlli Jurnalist ni o'rnatish
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Tezroq kirish uchun ilovani telefon ekraniga o'rnating
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1 text-xs h-8"
          >
            <Download className="h-3 w-3 mr-1" />
            O'rnatish
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="text-xs h-8"
          >
            Keyinroq
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}