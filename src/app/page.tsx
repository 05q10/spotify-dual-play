"use client";
import React, { useRef, useState, useEffect } from "react";

interface SongPair {
  track1: string;
  track2: string;
  name: string;
}

export default function Page() {
  const audio1 = useRef<HTMLAudioElement>(null);
  const audio2 = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPairIndex, setCurrentPairIndex] = useState<number>(0);
  const [volume1, setVolume1] = useState<number>(0.7);
  const [volume2, setVolume2] = useState<number>(0.7);
  
  // Define your song pairs here
  const [songPairs, setSongPairs] = useState<SongPair[]>([
    {
      track1: "/songs/ghafoor.mp3",
      track2: "/songs/maujahimauja.mp3",
      name: "Pair 1"
    },
    {
      track1: "/songs/ghafoor.mp3",
      track2: "/songs/maujahimauja.mp3",
      name: "Pair 2"
    }
    // Add more pairs as needed
  ]);

  // Available songs list (populate this with your actual songs)
  const availableSongs: string[] = [
    "/songs/ghafoor.mp3",
    "/songs/maujahimauja.mp3",
    "/songs/befikra.mp3",
    "/songs/saturdaysaturday.mp3",
    "/songs/bomdiggy.mp3",
    "/songs/saudakharakhara.mp3",

    
    
    // Add all your songs here
  ];

  const currentPair = songPairs[currentPairIndex];

  // Update volume when changed
  useEffect(() => {
    if (audio1.current) audio1.current.volume = volume1;
    if (audio2.current) audio2.current.volume = volume2;
  }, [volume1, volume2]);

  const playBoth = async () => {
    if (!audio1.current || !audio2.current) return;

    audio1.current.pause();
    audio2.current.pause();
    audio1.current.currentTime = 0;
    audio2.current.currentTime = 0;

    await Promise.all([audio1.current.load(), audio2.current.load()]);
    
    setTimeout(() => {
      audio1.current?.play();
      audio2.current?.play();
      setIsPlaying(true);
    }, 300);
  };

  const pauseBoth = () => {
    audio1.current?.pause();
    audio2.current?.pause();
    setIsPlaying(false);
  };

  const nextPair = () => {
    pauseBoth();
    setCurrentPairIndex((prev) => (prev + 1) % songPairs.length);
  };

  const prevPair = () => {
    pauseBoth();
    setCurrentPairIndex((prev) => (prev - 1 + songPairs.length) % songPairs.length);
  };

  const addNewPair = () => {
    setSongPairs([...songPairs, {
      track1: availableSongs[0] || "",
      track2: availableSongs[0] || "",
      name: `Pair ${songPairs.length + 1}`
    }]);
  };

  const updatePair = (index: number, field: keyof SongPair, value: string) => {
    const newPairs: SongPair[] = [...songPairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setSongPairs(newPairs);
  };

  const deletePair = (index: number) => {
    if (songPairs.length <= 1) return;
    const newPairs = songPairs.filter((_: SongPair, i: number) => i !== index);
    setSongPairs(newPairs);
    if (currentPairIndex >= newPairs.length) {
      setCurrentPairIndex(newPairs.length - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-600 mb-2">
            🪔 Diwali Dual Song Player 🪔
          </h1>
          <p className="text-gray-600">Mix and match your favorite songs!</p>
        </div>

        {/* Current Player */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-orange-500">
            Now Playing: {currentPair.name}
          </h2>
          
          <audio ref={audio1} src={currentPair.track1} preload="auto" />
          <audio ref={audio2} src={currentPair.track2} preload="auto" />

          {/* Song Display */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-orange-700 mb-2">Track 1</p>
              <p className="text-xs text-gray-600 truncate">{currentPair.track1.split('/').pop()}</p>
              <div className="mt-3">
                <label className="text-xs text-gray-600">Volume: {Math.round(volume1 * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume1(parseFloat(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-red-700 mb-2">Track 2</p>
              <p className="text-xs text-gray-600 truncate">{currentPair.track2.split('/').pop()}</p>
              <div className="mt-3">
                <label className="text-xs text-gray-600">Volume: {Math.round(volume2 * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume2(parseFloat(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              onClick={prevPair}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition"
            >
              ⏮ Previous
            </button>
            {!isPlaying ? (
              <button
                onClick={playBoth}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
              >
                ▶ Play Both
              </button>
            ) : (
              <button
                onClick={pauseBoth}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
              >
                ⏸ Pause Both
              </button>
            )}
            <button
              onClick={nextPair}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition"
            >
              Next ⏭
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Pair {currentPairIndex + 1} of {songPairs.length}
          </p>
        </div>

        {/* Playlist Manager */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-500">Manage Pairs</h2>
            <button
              onClick={addNewPair}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              + Add New Pair
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {songPairs.map((pair: SongPair, index: number) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${
                  index === currentPairIndex
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={pair.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePair(index, "name", e.target.value)}
                    className="font-semibold text-lg border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-300 rounded px-2"
                    placeholder="Pair name"
                  />
                  <button
                    onClick={() => deletePair(index)}
                    disabled={songPairs.length <= 1}
                    className="text-red-500 hover:text-red-700 font-bold disabled:opacity-30"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Track 1</label>
                    <select
                      value={pair.track1}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updatePair(index, "track1", e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      {availableSongs.map((song: string) => (
                        <option key={song} value={song}>
                          {song.split('/').pop()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Track 2</label>
                    <select
                      value={pair.track2}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updatePair(index, "track2", e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      {availableSongs.map((song: string) => (
                        <option key={song} value={song}>
                          {song.split('/').pop()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}