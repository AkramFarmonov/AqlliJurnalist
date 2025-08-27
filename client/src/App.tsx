import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Home from "@/pages/home";
import ArticlePage from "@/pages/article";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:id" component={ArticlePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Helmet>
            <title>Aqlli Jurnalist - O'zbekistonning Eng Yangi AI-Powered Yangilik Platformasi</title>
            <meta name="description" content="Aqlli Jurnalist - O'zbekistondagi eng so'nggi yangiliklar, texnologiya, biznes va siyosat haqida AI tomonidan yaratilgan maqolalar. Real vaqtda yangilanuvchi ma'lumotlar va chuqur tahlillar." />
            <meta property="og:title" content="Aqlli Jurnalist - AI-Powered Yangilik Platformasi" />
            <meta property="og:description" content="O'zbekistondagi eng so'nggi yangiliklar va AI tomonidan yaratilgan maqolalar. Real vaqtda yangilanuvchi ma'lumotlar." />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="canonical" href="https://aqlli-jurnalist.replit.app" />
          </Helmet>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
