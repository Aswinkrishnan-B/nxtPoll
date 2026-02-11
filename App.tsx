import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Room from "@/pages/Room";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useJukeboxStore } from "./lib/store";

function JoinRedirect({ params }: { params: { code: string } }) {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (params.code) {
      // Use wouter navigation instead of full reload
      setLocation(`/?join=${params.code}`);
    } else {
      setLocation('/');
    }
  }, [params.code, setLocation]);

  return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse">Joining Room...</div>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/room" component={Room} />
      <Route path="/join/:code" component={JoinRedirect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { syncFromStorage } = useJukeboxStore();

  // Global sync listener for multi-tab simulation
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nxtpoll-shared-state' && e.newValue) {
        syncFromStorage(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncFromStorage]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
