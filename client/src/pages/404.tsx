import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Helmet>
        <title>Sahifa topilmadi - Aqlli Jurnalist</title>
        <meta name="description" content="Kechirasiz, siz qidirayotgan sahifa topilmadi. Bosh sahifaga qayting yoki boshqa maqolalarni ko'ring." />
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="text-6xl font-bold text-muted-foreground mb-4">404</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sahifa topilmadi</h1>
          <p className="text-muted-foreground mb-6">
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
          </p>
          
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full" data-testid="button-home">
                <Home className="w-4 h-4 mr-2" />
                Bosh sahifa
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.history.back()}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga qaytish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}