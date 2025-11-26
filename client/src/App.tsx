import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import OngoingAnime from "@/pages/OngoingAnime";
import Schedule from "@/pages/Schedule";
import Terbaru from "@/pages/Terbaru";
import SudahTamat from "@/pages/SudahTamat";
import Genre from "@/pages/Genre";
import Populer from "@/pages/Populer";
import Search from "@/pages/Search";
import AnimeDetail from "@/pages/AnimeDetail";
import Watch from "@/pages/Watch";
import Bookmarks from "@/pages/Bookmarks";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sedang-tayang" component={OngoingAnime} />
      <Route path="/jadwal-tayang" component={Schedule} />
      <Route path="/terbaru" component={Terbaru} />
      <Route path="/sudah-tamat" component={SudahTamat} />
      <Route path="/genre" component={Genre} />
      <Route path="/populer" component={Populer} />
      <Route path="/search" component={Search} />
      <Route path="/simpanan" component={Bookmarks} />
      <Route path="/anime/:slug" component={AnimeDetail} />
      <Route path="/watch/:slug" component={Watch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <div className="flex-1 pt-16">
            <Router />
          </div>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
