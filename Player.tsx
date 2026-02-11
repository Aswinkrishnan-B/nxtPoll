import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useJukeboxStore } from '@/lib/store';
import { SkipForward, Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

export function Player() {
  const { nowPlaying, playNext, skipSong } = useJukeboxStore();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<any>(null);

  const handleEnded = () => {
    playNext();
  };

  useEffect(() => {
    if (!nowPlaying) {
      playNext();
    }
  }, [nowPlaying, playNext]);

  if (!nowPlaying) {
    return (
      <div className="w-full aspect-video bg-muted/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-border">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Music className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Ready to Play</h2>
          <p className="text-muted-foreground">Add songs to the queue to start listening.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden soft-shadow border border-border/50 group">
      <div className="flex flex-col md:flex-row">
        {/* Video Area */}
        <div className="relative aspect-video md:w-1/2 lg:w-5/12 bg-black">
          <ReactPlayer
            ref={playerRef}
            url={nowPlaying.url}
            playing={playing}
            volume={muted ? 0 : volume}
            width="100%"
            height="100%"
            onEnded={handleEnded}
            onProgress={({ played }) => setProgress(played * 100)}
            controls={false}
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
             <button 
              onClick={() => setPlaying(!playing)}
              className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <button 
              onClick={skipSong}
              className="p-3 bg-white/20 text-white rounded-full hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md"
              aria-label="Skip song"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>

        {/* Info & Progress */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                 Now Playing
               </span>
               <span className="text-xs text-muted-foreground">
                 Added by {nowPlaying.addedBy}
               </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1 leading-tight">
              {nowPlaying.title}
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              {nowPlaying.artist}
            </p>
          </div>

          <div className="space-y-5 mt-4 md:mt-0">
             {/* Volume Control */}
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setMuted(!muted)}
                 className="text-muted-foreground hover:text-foreground transition-colors"
                 aria-label={muted ? "Unmute" : "Mute"}
               >
                 {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
               </button>
               <Slider 
                 value={[muted ? 0 : volume * 100]} 
                 max={100} 
                 step={1} 
                 onValueChange={(val) => {
                   setVolume(val[0] / 100);
                   setMuted(false);
                 }}
                 className="w-24"
               />
             </div>

             {/* Progress Bar */}
             <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                  layoutId="progress"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
