"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-js";
import { Moon, Sun, Plus, Trash2, Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";

const spotifyApi = new SpotifyWebApi();

export default function Page() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(true);
  const [songPairs, setSongPairs] = useState([
    {
      track1: "spotify:track:6habFhsOp2NvshLv26DqMb", // Shape of You
      track2: "spotify:track:7ouMYWpwJ422jRcDASZB7P", // Uptown Funk
      name: "Pair 1",
    },
    {
      track1: "spotify:track:1oHNvJVbFkexQc0BpQp7Y4", // Blinding Lights
      track2: "spotify:track:0eGsygTp906u18L0Oimnem", // Let Her Go
      name: "Pair 2",
    },
  ]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Connect Spotify access token
  useEffect(() => {
    if (session?.accessToken) {
      spotifyApi.setAccessToken(session.accessToken);
    }
  }, [session]);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const playBoth = async () => {
    try {
      const pair = songPairs[currentPairIndex];
      await spotifyApi.play({ uris: [pair.track1, pair.track2] });
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing Spotify tracks:", err);
      alert("Playback failed. Make sure you have a Spotify Premium account and an active device open.");
    }
  };

  const pauseBoth = async () => {
    try {
      await spotifyApi.pause();
      setIsPlaying(false);
    } catch (err) {
      console.error("Pause failed:", err);
    }
  };

  const nextPair = () => {
    setCurrentPairIndex((prev) => (prev + 1) % songPairs.length);
  };

  const prevPair = () => {
    setCurrentPairIndex((prev) => (prev - 1 + songPairs.length) % songPairs.length);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Welcome to Dual Spotify Player 🎧</h1>
        <a
          href="/api/auth/signin"
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full text-lg font-semibold transition"
        >
          Login with Spotify
        </a>
      </div>
    );
  }

  const currentPair = songPairs[currentPairIndex];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Music className="text-green-500" /> Dual Spotify Player
      </h1>

      <div className="mb-6 text-lg font-semibold">
        Now Playing: <span className="text-green-500">{currentPair.name}</span>
      </div>

      <div className="flex gap-6">
        <button
          onClick={prevPair}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-full flex items-center gap-2 transition"
        >
          <SkipBack size={18} /> Prev
        </button>

        <button
          onClick={isPlaying ? pauseBoth : playBoth}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-200"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={nextPair}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-full flex items-center gap-2 transition"
        >
          <SkipForward size={18} /> Next
        </button>
      </div>

      <div className="mt-6 text-sm opacity-70">
        Logged in as <strong>{session.user?.name}</strong>
      </div>
    </div>
  );
}
