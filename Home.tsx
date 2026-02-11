import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useJukeboxStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Users, ArrowRight, Activity } from 'lucide-react';
import calmTexture from '@/assets/calm-texture.png';

export default function Home() {
  const [location, setLocation] = useLocation();
  const { createRoom, joinRoom } = useJukeboxStore();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'menu' | 'join' | 'create'>('menu');

  // Check for join code in URL
  useEffect(() => {
    // wouter's useLocation hook returns the path, but not query params easily.
    // We can parse the search string from window.location, but we need to ensure it's updated.
    // Since we're in a SPA, we might need to listen to navigation or just check on mount.
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const joinCode = params.get('join');
    
    if (joinCode) {
      setRoomCode(joinCode);
      setMode('join');
      // Optional: Clear query param to clean URL
      window.history.replaceState({}, '', '/');
    }
  }, [location]); // Re-run if location changes

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    createRoom(username);
    setLocation('/room');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !roomCode) return;
    joinRoom(roomCode, username);
    setLocation('/room');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Calm Background */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ 
          backgroundImage: `url(${calmTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-8 text-center">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-2">
               <Activity className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl font-display font-bold tracking-tight text-foreground">
              nxtPoll
            </h1>
            <p className="text-lg text-muted-foreground">
              Shared music voting for everyone.
            </p>
          </div>

          {/* Menu Mode */}
          {mode === 'menu' && (
            <div className="grid gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button 
                onClick={() => setMode('create')}
                className="h-16 text-lg font-medium bg-white text-foreground hover:bg-white/90 hover:shadow-md transition-all soft-shadow rounded-2xl border border-transparent"
              >
                <Music className="mr-3 w-5 h-5 text-primary" />
                Start a Party
              </Button>
              
              <Button 
                onClick={() => setMode('join')}
                variant="outline"
                className="h-16 text-lg font-medium bg-white/50 border-white/60 hover:bg-white hover:border-transparent hover:shadow-md transition-all rounded-2xl"
              >
                <Users className="mr-3 w-5 h-5 text-secondary" />
                Join Room
              </Button>
            </div>
          )}

          {/* Create Mode */}
          {mode === 'create' && (
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl soft-shadow border border-white/50 animate-in fade-in zoom-in-95 duration-300">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-muted-foreground ml-1">Host Name</label>
                  <Input 
                    placeholder="Enter your name" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 text-lg bg-white border-transparent shadow-sm focus:border-primary/20 focus:ring-primary/20 rounded-xl"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                   <Button 
                     type="button" 
                     onClick={() => setMode('menu')}
                     variant="ghost" 
                     className="flex-1 h-12 rounded-xl text-muted-foreground hover:bg-black/5"
                   >
                     Back
                   </Button>
                   <Button 
                     type="submit" 
                     className="flex-[2] h-12 bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 shadow-md shadow-primary/20 rounded-xl"
                     disabled={!username}
                   >
                     Create Room <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                </div>
              </form>
            </div>
          )}

           {/* Join Mode */}
           {mode === 'join' && (
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl soft-shadow border border-white/50 animate-in fade-in zoom-in-95 duration-300">
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-muted-foreground ml-1">Your Name</label>
                  <Input 
                    placeholder="Guest Name" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 text-lg bg-white border-transparent shadow-sm focus:border-secondary/20 focus:ring-secondary/20 rounded-xl"
                    autoFocus
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium text-muted-foreground ml-1">Room Code</label>
                  <Input 
                    placeholder="ABCD" 
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    maxLength={4}
                    className="h-12 text-xl bg-white border-transparent shadow-sm focus:border-secondary/20 focus:ring-secondary/20 font-bold tracking-widest text-center rounded-xl uppercase placeholder:tracking-normal placeholder:font-normal"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                   <Button 
                     type="button" 
                     onClick={() => setMode('menu')}
                     variant="ghost" 
                     className="flex-1 h-12 rounded-xl text-muted-foreground hover:bg-black/5"
                   >
                     Back
                   </Button>
                   <Button 
                     type="submit" 
                     className="flex-[2] h-12 bg-secondary text-secondary-foreground font-semibold text-base hover:bg-secondary/90 shadow-md shadow-secondary/20 rounded-xl"
                     disabled={!username || roomCode.length !== 4}
                   >
                     Join Party <ArrowRight className="ml-2 w-4 h-4" />
                   </Button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
      
      <div className="p-6 text-center text-sm text-muted-foreground/60 font-medium">
        Simple, shared, accessible.
      </div>
    </div>
  );
}
