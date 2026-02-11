import { useState } from 'react';
import { useJukeboxStore } from '@/lib/store';
import { Search, Plus, Youtube, Loader2, X, Music } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function AddSongForm() {
  const { addSong } = useJukeboxStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);
    
    // Simulate finding results
    setTimeout(() => {
      if (query.includes('youtube.com')) {
         addSong(query);
         setQuery('');
         setIsSearching(false);
         setIsOpen(false);
         return;
      }

      // Mock results based on query
      setResults([
        `${query} - Original Mix`,
        `${query} - Live Version`,
        `Best of ${query}`,
        `${query} (Remix)`
      ]);
      setIsSearching(false);
    }, 600);
  };

  const handleSelect = (result: string) => {
    addSong(result);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
          aria-label="Add song"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
             />
             
             {/* Modal */}
             <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-white rounded-2xl soft-shadow p-6 max-w-lg w-full mx-auto border border-border/50"
             >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <Youtube className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground">Add to Queue</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-muted">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      autoFocus
                      placeholder="Paste Link or Search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10 h-12 bg-muted/30 border-border focus:border-primary/50 focus:ring-primary/20 rounded-xl text-lg"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!query.trim() || isSearching}
                    className="h-12 px-6 bg-primary text-primary-foreground font-medium hover:bg-primary/90 rounded-xl"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                  </Button>
                </form>

                {/* Results List */}
                {results.length > 0 ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Select a track:</p>
                    {results.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect(result)}
                        className="w-full p-3 text-left rounded-xl hover:bg-muted/50 flex items-center gap-3 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                          <Music className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-foreground">{result}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6">
                     <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Trending Now:</p>
                     <div className="flex flex-wrap gap-2">
                       {['Lo-Fi Beats', 'Acoustic Pop', 'Summer Vibes'].map(term => (
                         <button 
                           key={term}
                           onClick={() => { setQuery(term); }}
                           className="text-sm px-3 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors rounded-full text-muted-foreground font-medium"
                         >
                           {term}
                         </button>
                       ))}
                     </div>
                  </div>
                )}
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
