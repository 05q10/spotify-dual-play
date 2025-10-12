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
    <div className="min-h-screen bg-black text-white">
      {/* Main Container */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-black p-6 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Dual Player</h1>
            <p className="text-sm text-gray-400">Mix your tracks</p>
          </div>
          
          <button
            onClick={addNewPair}
            className="bg-white text-black font-semibold py-2 px-4 rounded-full hover:scale-105 transition mb-6"
          >
            + Create Pair
          </button>

          {/* Playlist */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Your Pairs</h2>
            <div className="space-y-2">
              {songPairs.map((pair: SongPair, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    pauseBoth();
                    setCurrentPairIndex(index);
                  }}
                  className={`p-3 rounded cursor-pointer transition ${
                    index === currentPairIndex
                      ? "bg-gray-800"
                      : "hover:bg-gray-900"
                  }`}
                >
                  <p className="font-semibold text-sm truncate">{pair.name}</p>
                  <p className="text-xs text-gray-400">2 tracks</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
          {/* Header */}
          <div className="p-8 pb-4">
            <div className="flex items-center gap-6">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded shadow-2xl flex items-center justify-center">
                <span className="text-6xl">🎵</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">Dual Track Mix</p>
                <h1 className="text-6xl font-bold mb-4">{currentPair.name}</h1>
                <p className="text-sm text-gray-400">2 tracks • Mixed playback</p>
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="p-8 pt-6">
            <div className="mb-6">
              <div className="grid grid-cols-12 gap-4 px-4 text-xs text-gray-400 font-semibold border-b border-gray-800 pb-2">
                <div className="col-span-1">#</div>
                <div className="col-span-5">TITLE</div>
                <div className="col-span-6">VOLUME</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded hover:bg-gray-900 transition items-center">
                <div className="col-span-1 text-gray-400">1</div>
                <div className="col-span-5">
                  <p className="font-semibold">{currentPair.track1.split('/').pop()}</p>
                  <p className="text-xs text-gray-400">Track 1</p>
                </div>
                <div className="col-span-6 flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8">{Math.round(volume1 * 100)}%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume1}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume1(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume1 * 100}%, #4b5563 ${volume1 * 100}%, #4b5563 100%)`
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded hover:bg-gray-900 transition items-center">
                <div className="col-span-1 text-gray-400">2</div>
                <div className="col-span-5">
                  <p className="font-semibold">{currentPair.track2.split('/').pop()}</p>
                  <p className="text-xs text-gray-400">Track 2</p>
                </div>
                <div className="col-span-6 flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8">{Math.round(volume2 * 100)}%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume2}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume2(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume2 * 100}%, #4b5563 ${volume2 * 100}%, #4b5563 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Manage Pairs Section */}
          <div className="p-8 pt-12">
            <h2 className="text-2xl font-bold mb-6">Manage Pairs</h2>
            <div className="space-y-3">
              {songPairs.map((pair: SongPair, index: number) => (
                <div
                  key={index}
                  className={`bg-gray-900 rounded-lg p-4 ${
                    index === currentPairIndex ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      value={pair.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePair(index, "name", e.target.value)}
                      className="font-semibold text-lg bg-transparent border-0 focus:outline-none focus:ring-0 text-white"
                      placeholder="Pair name"
                    />
                    <button
                      onClick={() => deletePair(index)}
                      disabled={songPairs.length <= 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30 transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Track 1</label>
                      <select
                        value={pair.track1}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updatePair(index, "track1", e.target.value)}
                        className="w-full text-sm bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {availableSongs.map((song: string) => (
                          <option key={song} value={song}>
                            {song.split('/').pop()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Track 2</label>
                      <select
                        value={pair.track2}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updatePair(index, "track2", e.target.value)}
                        className="w-full text-sm bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3">
        <audio ref={audio1} src={currentPair.track1} preload="auto" />
        <audio ref={audio2} src={currentPair.track2} preload="auto" />
        
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Current Track Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎵</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{currentPair.name}</p>
              <p className="text-xs text-gray-400">Dual Track Mix</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-4">
              <button
                onClick={prevPair}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              
              {!isPlaying ? (
                <button
                  onClick={playBoth}
                  className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={pauseBoth}
                  className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={nextPair}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-400">
              Pair {currentPairIndex + 1} of {songPairs.length}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex justify-end">
            <div className="text-xs text-gray-400">
              Dual playback mode
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}