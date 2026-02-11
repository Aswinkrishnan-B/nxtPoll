import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'wouter';
import { useJukeboxStore } from '@/lib/store';
import { Player } from '@/components/Player';
import { SongCard } from '@/components/SongCard';
import { AddSongForm } from '@/components/AddSongForm';
import { Button } from '@/components/ui/button';
import { Copy, Users, LogOut, Info, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import calmTexture from '@/assets/calm-texture.png';

export default function Room() {
  const [location, setLocation] = useLocation();
  const { roomCode, isHost, queue, username } = useJukeboxStore();
  const { toast } = useToast();

  if (!roomCode) {
    setLocation('/');
    return null;
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "Room Code Copied!",
      description: "Share it with your friends.",
    });
  };

  const shareUrl = `${window.location.origin}/join/${roomCode}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-24 md:pb-0 relative">
       {/* Background */}
       <div 
        className="absolute inset-0 opacity-30 pointer-events-none fixed"
        style={{ 
          backgroundImage: `url(${calmTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <Activity className="w-6 h-6 text-primary" />
               <h1 className="font-display font-bold text-xl tracking-tight hidden md:block text-foreground">
                 nxtPoll
               </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Room</span>
              <span className="font-mono font-bold text-primary text-base">{roomCode}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 text-muted-foreground hover:text-primary" onClick={copyCode}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isHost && (
               <Dialog>
               <DialogTrigger asChild>
                 <Button variant="outline" size="sm" className="hidden md:flex bg-white hover:bg-muted border-border rounded-lg shadow-sm">
                   <Users className="w-4 h-4 mr-2 text-primary" />
                   Show QR
                 </Button>
               </DialogTrigger>
               <DialogContent className="bg-white border-border rounded-2xl shadow-xl">
                 <DialogHeader>
                   <DialogTitle className="text-center font-display text-xl text-foreground">Scan to Join</DialogTitle>
                 </DialogHeader>
                 <div className="flex flex-col items-center justify-center p-8 gap-6">
                    <div className="p-4 bg-white rounded-xl shadow-md border border-border">
                       <QRCodeSVG value={shareUrl} size={200} />
                    </div>
                    <p className="text-foreground font-mono font-bold text-3xl tracking-widest">{roomCode}</p>
                 </div>
               </DialogContent>
             </Dialog>
            )}
            
            <div className="flex items-center gap-3 pl-3 border-l border-border/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-inner">
                {username.substring(0, 2).toUpperCase()}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setLocation('/')} className="hover:bg-red-50 hover:text-red-500 rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-6 p-4 md:p-6 relative z-10">
        
        {/* Left Col: Player */}
        <div className="md:w-1/2 lg:w-7/12 flex flex-col gap-6">
          <section>
            {isHost ? (
              <Player />
            ) : (
              <div className="p-1 rounded-2xl bg-white soft-shadow">
                 <div className="aspect-video w-full bg-muted/30 rounded-xl border border-border flex items-center justify-center relative overflow-hidden p-8 text-center">
                    <div>
                      <Info className="w-12 h-12 mx-auto text-primary/50 mb-4" />
                      <h3 className="text-xl font-bold font-display text-foreground mb-2">You are a Guest</h3>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        Vote on songs below. The host device is playing the music.
                      </p>
                    </div>
                 </div>
              </div>
            )}
          </section>

          {/* Guide Card */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm hidden md:block">
             <h3 className="font-display font-bold text-foreground mb-4">How it works</h3>
             <ul className="space-y-4 text-sm text-muted-foreground">
               <li className="flex gap-4 items-start">
                 <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0 mt-0.5">1</span>
                 <span>Add songs from YouTube to the shared queue.</span>
               </li>
               <li className="flex gap-4 items-start">
                 <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0 mt-0.5">2</span>
                 <span>Vote your favorites up to hear them sooner.</span>
               </li>
               <li className="flex gap-4 items-start">
                 <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0 mt-0.5">3</span>
                 <span>The highest voted song plays automatically.</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Right Col: Queue */}
        <div className="md:w-1/2 lg:w-5/12 flex flex-col h-full min-h-[400px]">
          <div className="mb-4 flex justify-between items-center px-1">
            <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-3">
              Up Next <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">{queue.length}</span>
            </h2>
            <div className="text-xs font-medium text-muted-foreground bg-white/50 px-2 py-1 rounded-md border border-white/50">
              Live Voting
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pb-32 pr-1 custom-scrollbar">
            <AnimatePresence mode='popLayout'>
              {queue.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white/40 rounded-2xl border-2 border-dashed border-border"
                >
                  <p className="text-muted-foreground font-medium mb-1">Queue is empty</p>
                  <p className="text-sm text-muted-foreground/60">Add a song to get started!</p>
                </motion.div>
              ) : (
                queue.map((song, idx) => (
                  <SongCard key={song.id} song={song} index={idx} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>

      <AddSongForm />
    </div>
  );
}
