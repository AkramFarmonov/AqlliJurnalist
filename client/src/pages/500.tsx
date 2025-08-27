import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Helmet>
        <title>Server xatoligi - Aqlli Jurnalist</title>
        <meta name="description" content="Server xatoligi yuz berdi. Iltimos, sahifani yangilang yoki keyinroq urinib ko'ring." />
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-destructive mb-4">500</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Server xatoligi</h1>
          <p className="text-muted-foreground mb-6">
            Kechirasiz, server xatoligi yuz berdi. Iltimos, sahifani yangilang yoki keyinroq urinib ko'ring.
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => window.location.reload()}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sahifani yangilash
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full" data-testid="button-home">
                <Home className="w-4 h-4 mr-2" />
                Bosh sahifa
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}