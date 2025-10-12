"use client";
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";

interface SongPair {
  track1: string;
  track2: string;
  name: string;
}

// Utility: format seconds to mm:ss
function formatTime(secs: number) {
  if (!isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Icons (simplified inline SVG components)
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const SkipBackIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

const SkipForwardIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const VolumeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);

const MusicIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z" />
  </svg>
);

export default function Page() {
  const audio1 = useRef<HTMLAudioElement>(null);
  const audio2 = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPairIndex, setCurrentPairIndex] = useState<number>(0);
  const [volume1, setVolume1] = useState<number>(0.7);
  const [volume2, setVolume2] = useState<number>(0.7);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isDark, setIsDark] = useState<boolean>(true);

  const [songPairs, setSongPairs] = useState<SongPair[]>([
    { track1: "/songs/ghafoor.mp3", track2: "/songs/maujahimauja.mp3", name: "Mix 1" },
    { track1: "/songs/ghafoor.mp3", track2: "/songs/befikra.mp3", name: "Mix 2" },
  ]);

  const availableSongs: string[] = useMemo(
    () => ["/songs/ghafoor.mp3", "/songs/maujahimauja.mp3", "/songs/befikra.mp3", "/songs/saturdaysaturday.mp3"],
    []
  );

  const currentPair = songPairs[currentPairIndex];

  // Theme colors
  const theme = isDark
    ? {
        bg: "#121212",
        cardBg: "#181818",
        hoverBg: "#282828",
        border: "#282828",
        text: "#ffffff",
        mutedText: "#b3b3b3",
        primary: "#1db954",
        primaryHover: "#1ed760",
      }
    : {
        bg: "#ffffff",
        cardBg: "#f6f6f6",
        hoverBg: "#e8e8e8",
        border: "#d4d4d4",
        text: "#000000",
        mutedText: "#6a6a6a",
        primary: "#1db954",
        primaryHover: "#1ed760",
      };

  useEffect(() => {
    if (audio1.current) audio1.current.volume = volume1;
    if (audio2.current) audio2.current.volume = volume2;
  }, [volume1, volume2]);

  const handleLoadedMetadata = useCallback(() => {
    const d = audio1.current?.duration ?? 0;
    setDuration(isFinite(d) ? d : 0);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const t = audio1.current?.currentTime ?? 0;
    setCurrentTime(isFinite(t) ? t : 0);
  }, []);

  const attachEvents = useCallback(() => {
    const a1 = audio1.current;
    const a2 = audio2.current;
    if (!a1 || !a2) return;

    a1.addEventListener("loadedmetadata", handleLoadedMetadata);
    a1.addEventListener("timeupdate", handleTimeUpdate);

    const onEnded = () => {
      setIsPlaying(false);
    };
    a1.addEventListener("ended", onEnded);
    a2.addEventListener("ended", onEnded);

    return () => {
      a1.removeEventListener("loadedmetadata", handleLoadedMetadata);
      a1.removeEventListener("timeupdate", handleTimeUpdate);
      a1.removeEventListener("ended", onEnded);
      a2.removeEventListener("ended", onEnded);
    };
  }, [handleLoadedMetadata, handleTimeUpdate]);

  useEffect(() => {
    const cleanup = attachEvents();
    return cleanup;
  }, [attachEvents, currentPairIndex]);

  const syncSeek = (t: number) => {
    if (audio1.current) audio1.current.currentTime = t;
    if (audio2.current) audio2.current.currentTime = t;
    setCurrentTime(t);
  };

  const playBoth = async () => {
    const a1 = audio1.current;
    const a2 = audio2.current;
    if (!a1 || !a2) return;

    const seekTo = a1.currentTime || 0;
    a1.pause();
    a2.pause();
    a1.load();
    a2.load();

    setTimeout(async () => {
      a1.currentTime = seekTo;
      a2.currentTime = seekTo;

      try {
        await Promise.all([a1.play(), a2.play()]);
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }, 100);
  };

  const pauseBoth = () => {
    audio1.current?.pause();
    audio2.current?.pause();
    setIsPlaying(false);
  };

  const nextPair = () => {
    pauseBoth();
    setCurrentTime(0);
    setCurrentPairIndex((p) => (p + 1) % songPairs.length);
  };

  const prevPair = () => {
    pauseBoth();
    setCurrentTime(0);
    setCurrentPairIndex((p) => (p - 1 + songPairs.length) % songPairs.length);
  };

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    syncSeek(v);
  };

  const addNewPair = () => {
    setSongPairs((prev) => [
      ...prev,
      {
        track1: availableSongs[0] || "",
        track2: availableSongs[0] || "",
        name: `Mix ${prev.length + 1}`,
      },
    ]);
  };

  const updatePair = (index: number, field: keyof SongPair, value: string) => {
    setSongPairs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const deletePair = (index: number) => {
    setSongPairs((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter((_, i) => i !== index);
      if (currentPairIndex >= filtered.length) {
        setCurrentPairIndex(filtered.length - 1);
      }
      return filtered;
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text }}>
      <audio ref={audio1} src={currentPair.track1} preload="auto" />
      <audio ref={audio2} src={currentPair.track2} preload="auto" />

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside style={{ backgroundColor: theme.cardBg, borderRight: `1px solid ${theme.border}`, padding: "24px 16px", overflowY: "auto" }}>
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MusicIcon />
              <span style={{ fontSize: "14px", fontWeight: "600", color: theme.mutedText }}>Your Mix Library</span>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: theme.mutedText,
                padding: "4px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title="Toggle theme"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {songPairs.map((pair, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPairIndex(idx)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: idx === currentPairIndex ? theme.hoverBg : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  color: theme.text,
                }}
                onMouseEnter={(e) => {
                  if (idx !== currentPairIndex) e.currentTarget.style.backgroundColor = theme.hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (idx !== currentPairIndex) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                      backgroundColor: theme.border,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MusicIcon />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: "500", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {pair.name}
                    </p>
                    <p style={{ fontSize: "12px", color: theme.mutedText, margin: "4px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {pair.track1.split("/").pop()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ overflowY: "auto", paddingBottom: "120px" }}>
          <header style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "700", margin: 0 }}>🪔 Diwali Dual Song Mixer</h1>
              <p style={{ fontSize: "14px", color: theme.mutedText, marginTop: "4px" }}>
                Mix two tracks together with individual volume control
              </p>
            </div>
          </header>

          <div style={{ padding: "0 24px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
            {/* Player Card */}
            <section style={{ backgroundColor: theme.cardBg, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                  <p style={{ fontSize: "12px", color: theme.mutedText, margin: 0 }}>Now Playing</p>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", margin: "4px 0 0 0" }}>{currentPair.name}</h2>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={prevPair}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: theme.hoverBg,
                      color: theme.text,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SkipBackIcon />
                  </button>
                  {!isPlaying ? (
                    <button
                      onClick={playBoth}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: theme.primary,
                        color: "#000",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlayIcon />
                    </button>
                  ) : (
                    <button
                      onClick={pauseBoth}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: theme.primary,
                        color: "#000",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PauseIcon />
                    </button>
                  )}
                  <button
                    onClick={nextPair}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      backgroundColor: theme.hoverBg,
                      color: theme.text,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SkipForwardIcon />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", color: theme.mutedText, minWidth: "40px" }}>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(duration || 0, 0.0001)}
                    step={0.01}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={onScrub}
                    style={{ flex: 1, accentColor: theme.primary }}
                  />
                  <span style={{ fontSize: "12px", color: theme.mutedText, minWidth: "40px", textAlign: "right" }}>{formatTime(duration || 0)}</span>
                </div>
              </div>

              {/* Volume Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: theme.bg, borderRadius: "8px", padding: "16px" }}>
                  <p style={{ fontSize: "12px", color: theme.mutedText, margin: "0 0 4px 0" }}>Track 1</p>
                  <p style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 12px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentPair.track1.split("/").pop()}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <VolumeIcon />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume1}
                      onChange={(e) => setVolume1(Number.parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: theme.primary }}
                    />
                    <span style={{ fontSize: "12px", color: theme.mutedText, minWidth: "32px" }}>{Math.round(volume1 * 100)}%</span>
                  </div>
                </div>
                <div style={{ backgroundColor: theme.bg, borderRadius: "8px", padding: "16px" }}>
                  <p style={{ fontSize: "12px", color: theme.mutedText, margin: "0 0 4px 0" }}>Track 2</p>
                  <p style={{ fontSize: "14px", fontWeight: "500", margin: "0 0 12px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentPair.track2.split("/").pop()}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <VolumeIcon />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume2}
                      onChange={(e) => setVolume2(Number.parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: theme.primary }}
                    />
                    <span style={{ fontSize: "12px", color: theme.mutedText, minWidth: "32px" }}>{Math.round(volume2 * 100)}%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Pair Manager */}
            <section style={{ backgroundColor: theme.cardBg, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>Manage Pairs</h3>
                <button
                  onClick={addNewPair}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "none",
                    backgroundColor: theme.primary,
                    color: "#000",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Add Pair
                </button>
              </div>

              <div style={{ maxHeight: "500px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                {songPairs.map((pair, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: "8px",
                      border: `1px solid ${idx === currentPairIndex ? theme.primary : theme.border}`,
                      padding: "12px",
                      backgroundColor: theme.bg,
                    }}
                  >
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                      <input
                        type="text"
                        value={pair.name}
                        onChange={(e) => updatePair(idx, "name", e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "4px",
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.cardBg,
                          color: theme.text,
                          fontSize: "14px",
                        }}
                      />
                      <button
                        onClick={() => deletePair(idx)}
                        disabled={songPairs.length <= 1}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "4px",
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.cardBg,
                          color: theme.text,
                          cursor: songPairs.length <= 1 ? "not-allowed" : "pointer",
                          opacity: songPairs.length <= 1 ? 0.5 : 1,
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div>
                        <label style={{ fontSize: "12px", color: theme.mutedText, display: "block", marginBottom: "4px" }}>Track 1</label>
                        <select
                          value={pair.track1}
                          onChange={(e) => updatePair(idx, "track1", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.cardBg,
                            color: theme.text,
                            fontSize: "13px",
                          }}
                        >
                          {availableSongs.map((song) => (
                            <option key={song} value={song}>
                              {song.split("/").pop()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", color: theme.mutedText, display: "block", marginBottom: "4px" }}>Track 2</label>
                        <select
                          value={pair.track2}
                          onChange={(e) => updatePair(idx, "track2", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.cardBg,
                            color: theme.text,
                            fontSize: "13px",
                          }}
                        >
                          {availableSongs.map((song) => (
                            <option key={song} value={song}>
                              {song.split("/").pop()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Bottom Player Bar */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.cardBg,
          borderTop: `1px solid ${theme.border}`,
          padding: "16px 24px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "16px" }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "14px", fontWeight: "500", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentPair.name}
            </p>
            <p style={{ fontSize: "12px", color: theme.mutedText, margin: "4px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentPair.track1.split("/").pop()} + {currentPair.track2.split("/").pop()}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={prevPair}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "transparent",
                color: theme.mutedText,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SkipBackIcon />
            </button>
            {!isPlaying ? (
              <button
                onClick={playBoth}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#000",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlayIcon />
              </button>
            ) : (
              <button
                onClick={pauseBoth}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#fff",
                  color: "#000",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PauseIcon />
              </button>
            )}
            <button
              onClick={nextPair}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "transparent",
                color: theme.mutedText,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SkipForwardIcon />
            </button>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: theme.mutedText }}>T1</span>
              <VolumeIcon />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume1}
                onChange={(e) => setVolume1(Number.parseFloat(e.target.value))}
                style={{ width: "100px", accentColor: theme.primary }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: theme.mutedText }}>T2</span>
              <VolumeIcon />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume2}
                onChange={(e) => setVolume2(Number.parseFloat(e.target.value))}
                style={{ width: "100px", accentColor: theme.primary }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}