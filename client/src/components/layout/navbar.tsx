import { useState } from "react";
import { Brain, Search, Menu, Download, History, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePWAInstall } from "@/hooks/use-pwa-install";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isInstallable, installApp } = usePWAInstall();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const navLinks = [
    { href: "/", label: "Bosh sahifa" },
    { href: "/about", label: "Biz haqimizda" },
    { href: "#", label: "Kategoriyalar" },
    { href: "#", label: "AI Chat" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="text-primary text-2xl" data-testid="logo-icon" />
              <h1 className="text-xl font-bold text-foreground" data-testid="logo-text">
                Aqlli Jurnalist
              </h1>
            </div>
            <Badge variant="default" className="text-xs" data-testid="badge-ai-powered">
              AI Powered
            </Badge>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button 
                asChild
                variant="ghost" 
                size="icon" 
                title="Sevimlilar" 
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/favorites">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                title="Tarix"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-history"
              >
                <Link href="/#recently-viewed">
                  <History className="h-5 w-5" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => 
              link.href.startsWith('#') ? (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link 
                  key={link.label}
                  href={link.href}
                  className={`transition-colors ${
                    location === link.href 
                      ? "text-foreground hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
          
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Qidiruv..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </form>
            
            {/* PWA Install Button */}
            {isInstallable && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={installApp}
                className="hidden sm:flex items-center gap-2"
                data-testid="button-install-pwa"
              >
                <Download className="h-4 w-4" />
                O'rnatish
              </Button>
            )}
            
            {/* Mobile Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              data-testid="button-mobile-search"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Qidiruv..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2"
                      data-testid="input-mobile-search"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  </form>
                  
                  <div className="flex flex-col space-y-3">
                    {navLinks.map((link) => 
                      link.href.startsWith('#') ? (
                        <a 
                          key={link.label}
                          href={link.href} 
                          className="text-muted-foreground hover:text-primary transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                          data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link 
                          key={link.label}
                          href={link.href}
                          className={`transition-colors py-2 ${
                            location === link.href 
                              ? "text-foreground hover:text-primary" 
                              : "text-muted-foreground hover:text-primary"
                          }`}
                          onClick={() => setIsOpen(false)}
                          data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {link.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
