    "use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [availableSongs, setAvailableSongs] = useState<string[]>([]);
  const [setIndex, setSetIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audio1 = useRef<HTMLAudioElement | null>(null);
  const audio2 = useRef<HTMLAudioElement | null>(null);

  // Fetch all songs dynamically from API route
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const res = await fetch("/api/songs");
        const data = await res.json();
        setAvailableSongs(data.songs || []);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };
    loadSongs();
  }, []);

  // Split songs into pairs (sets)
  const songSets = useMemo(() => {
    const sets = [];
    for (let i = 0; i < availableSongs.length; i += 2) {
      sets.push(availableSongs.slice(i, i + 2));
    }
    return sets;
  }, [availableSongs]);

  const play = () => {
    if (!songSets[setIndex]) return;
    const [song1, song2] = songSets[setIndex];
    if (audio1.current && audio2.current) {
      audio1.current.src = song1;
      audio2.current.src = song2 || song1; // fallback if odd number of songs
      audio1.current.play();
      audio2.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    audio1.current?.pause();
    audio2.current?.pause();
    setIsPlaying(false);
  };

  const next = () => {
    pause();
    setSetIndex((prev) => (prev + 1) % songSets.length);
  };

  useEffect(() => {
    if (isPlaying) play();
  }, [setIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-4">🎵 Dual Song Player (Multi-Set)</h1>
      <p className="mb-2 text-lg">
        Now Playing: Set {setIndex + 1} of {songSets.length || 0}
      </p>

      <div className="flex gap-4 mt-4">
        <button onClick={play} className="bg-green-500 text-white px-4 py-2 rounded">
          ▶ Play
        </button>
        <button onClick={pause} className="bg-yellow-500 text-white px-4 py-2 rounded">
          ⏸ Pause
        </button>
        <button onClick={next} className="bg-blue-500 text-white px-4 py-2 rounded">
          ⏭ Next
        </button>
      </div>

      {/* Hidden audio players */}
      <audio ref={audio1} />
      <audio ref={audio2} />
    </div>
  );
}
