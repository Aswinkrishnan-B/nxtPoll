import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Song, useJukeboxStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface SongCardProps {
  song: Song;
  index: number;
}

export function SongCard({ song, index }: SongCardProps) {
  const { vote, username } = useJukeboxStore();
  const hasVoted = song.votedBy.includes(username);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative flex items-center gap-4 p-4 bg-white rounded-xl soft-shadow border border-transparent hover:border-primary/20 transition-all card-hover"
    >
      {/* Rank Number */}
      <div className="text-2xl font-display font-bold text-muted-foreground/20 absolute right-4 top-2 pointer-events-none">
        #{index + 1}
      </div>

      {/* Album Art */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg shadow-sm">
        <img 
          src={song.cover} 
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 z-10">
        <h3 className="font-semibold text-base text-foreground leading-tight truncate">
          {song.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {song.artist}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">
          Added by {song.addedBy}
        </p>
      </div>

      {/* Voting */}
      <div className="flex flex-col items-center gap-0.5 z-10 bg-muted/30 p-1 rounded-lg">
        <button
          onClick={() => vote(song.id, 'up')}
          className={cn(
            "p-1 rounded-md transition-colors active:scale-95",
            hasVoted 
              ? "text-primary bg-primary/10" 
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          )}
          aria-label="Vote up"
        >
          <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
        </button>
        
        <span className={cn(
          "font-mono font-bold text-sm w-8 text-center",
          song.votes > 0 ? "text-primary" : "text-foreground/70"
        )}>
          {song.votes}
        </span>

         {/* Hidden downvote for calm UI simplicity as requested, or keep it disabled/small */}
         <div className="h-1" />
      </div>
    </motion.div>
  );
}
