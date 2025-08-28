import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { ThemeProvider } from "@/contexts/theme-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { RecentlyViewedProvider } from "@/contexts/recently-viewed-context";
import Home from "@/pages/home";
import ArticlePage from "@/pages/article";
import AboutPage from "@/pages/about";
import FavoritesPage from "@/pages/favorites";
import NotFound from "@/pages/not-found";
import NotFound404Page from "@/pages/404";
import ServerError500Page from "@/pages/500";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:id" component={ArticlePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/404" component={NotFound404Page} />
      <Route path="/500" component={ServerError500Page} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RecentlyViewedProvider>
            <FavoritesProvider>
              <TooltipProvider>
          <Helmet>
            <title>Aqlli Jurnalist - O'zbekistonning Eng Yangi AI-Powered Yangilik Platformasi</title>
            <meta name="description" content="Aqlli Jurnalist - O'zbekistondagi eng so'nggi yangiliklar, texnologiya, biznes va siyosat haqida AI tomonidan yaratilgan maqolalar. Real vaqtda yangilanuvchi ma'lumotlar va chuqur tahlillar." />
            <meta property="og:title" content="Aqlli Jurnalist - AI-Powered Yangilik Platformasi" />
            <meta property="og:description" content="O'zbekistondagi eng so'nggi yangiliklar va AI tomonidan yaratilgan maqolalar. Real vaqtda yangilanuvchi ma'lumotlar." />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>
                <Toaster />
                <Router />
                <InstallPrompt />
              </TooltipProvider>
            </FavoritesProvider>
          </RecentlyViewedProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
