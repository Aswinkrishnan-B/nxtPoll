import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  votes: number;
  addedBy: string;
  duration: string;
  cover: string;
  votedBy: string[]; // List of usernames who voted up
}

interface SharedState {
  roomCode: string | null;
  queue: Song[];
  nowPlaying: Song | null;
}

interface LocalState {
  isHost: boolean;
  username: string;
  // Actions
  createRoom: (username: string) => void;
  joinRoom: (code: string, username: string) => void;
  addSong: (query: string) => void;
  vote: (songId: string, type: 'up' | 'down') => void;
  playNext: () => void;
  skipSong: () => void;
  setRoomCode: (code: string) => void;
  syncFromStorage: (state: SharedState) => void;
}

const MOCK_COVERS = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop"
];

// Helper to get simulated "shared" state from local storage
const SHARED_KEY = 'nxtpoll-shared-state';

const getSharedState = (): SharedState => {
  try {
    const item = localStorage.getItem(SHARED_KEY);
    if (item) return JSON.parse(item);
  } catch (e) {
    console.error("Failed to read shared state", e);
  }
  return { roomCode: null, queue: [], nowPlaying: null };
};

const setSharedState = (state: SharedState) => {
  try {
    localStorage.setItem(SHARED_KEY, JSON.stringify(state));
    // Dispatch event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: SHARED_KEY,
      newValue: JSON.stringify(state)
    }));
  } catch (e) {
    console.error("Failed to save shared state", e);
  }
};

export const useJukeboxStore = create<SharedState & LocalState>((set, get) => ({
  // Initial State
  ...getSharedState(),
  isHost: false,
  username: '',

  syncFromStorage: (sharedState) => {
    set(sharedState);
  },

  setRoomCode: (code) => set({ roomCode: code }),

  createRoom: (username) => {
    const newState = {
      roomCode: nanoid(4).toUpperCase(),
      queue: [],
      nowPlaying: null
    };
    set({ ...newState, isHost: true, username });
    setSharedState(newState);
  },

  joinRoom: (code, username) => {
    // In a real app, we would fetch the room state here.
    // For this mock, we assume the shared state in localStorage IS the room.
    const shared = getSharedState();
    if (shared.roomCode === code) {
      set({ ...shared, isHost: false, username });
    } else {
      // Fallback if no room exists, create a fake one for the user
      set({ roomCode: code, isHost: false, username });
    }
  },

  addSong: (query) => {
    const { username, queue, roomCode, nowPlaying } = get();
    
    // Simple mock logic to parse URL or Text
    let title = query;
    let artist = "Unknown Artist";
    let cover = MOCK_COVERS[Math.floor(Math.random() * MOCK_COVERS.length)];
    let url = query;

    // Very basic YouTube URL check
    if (query.includes('youtube.com') || query.includes('youtu.be')) {
       title = "YouTube Track"; // ideally we'd fetch oembed
       artist = "YouTube";
    } else {
       // Mock search result
       title = query;
       artist = "Requested Track";
       // Mock a search - if they typed "Artist - Title"
       if (query.includes('-')) {
         const parts = query.split('-');
         artist = parts[0].trim();
         title = parts[1].trim();
       }
       // Mock a playable URL (using a real default video for functionality)
       url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 
    }

    const newSong: Song = {
      id: nanoid(),
      title,
      artist,
      url,
      votes: 1,
      addedBy: username,
      duration: '3:00',
      cover,
      votedBy: [username]
    };

    const newState = { 
      roomCode, 
      nowPlaying, 
      queue: [...queue, newSong].sort((a, b) => b.votes - a.votes) 
    };
    
    set(newState);
    setSharedState(newState);
  },

  vote: (songId, type) => {
    const { username, queue, roomCode, nowPlaying } = get();
    if (!username) return;

    const newQueue = queue.map(song => {
      if (song.id !== songId) return song;

      const hasVoted = song.votedBy.includes(username);
      
      // Simple logic: One vote per user per song (Upvote only for simplicity in this model, or toggle)
      // If user clicks UP:
      // - If already voted: Remove vote
      // - If not voted: Add vote
      // (Ignoring 'down' for now to keep it positive/simple as per 'calm' vibe, or implementing toggle)
      
      let newVotes = song.votes;
      let newVotedBy = [...song.votedBy];

      if (type === 'up') {
        if (hasVoted) {
          newVotes--;
          newVotedBy = newVotedBy.filter(u => u !== username);
        } else {
          newVotes++;
          newVotedBy.push(username);
        }
      } else {
        // Downvote logic (optional, maybe restricted?)
        // For "calm" app, maybe we only allow upvotes? 
        // Let's implement toggle for UP, and maybe ignore down or make it "remove vote"
        if (hasVoted) {
           newVotes--;
           newVotedBy = newVotedBy.filter(u => u !== username);
        }
      }

      return { ...song, votes: newVotes, votedBy: newVotedBy };
    }).sort((a, b) => b.votes - a.votes);

    const newState = { roomCode, nowPlaying, queue: newQueue };
    set(newState);
    setSharedState(newState);
  },

  playNext: () => {
    const { queue, roomCode } = get();
    if (queue.length === 0) return;

    const next = queue[0];
    const remaining = queue.slice(1);

    const newState = {
      roomCode,
      nowPlaying: next,
      queue: remaining
    };
    
    set(newState);
    setSharedState(newState);
  },
  
  skipSong: () => {
     get().playNext();
  }
}));
