"use client";
import React, { useRef, useState, useEffect } from "react";
import { Moon, Sun, Plus, Trash2, Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";

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
  const [isDark, setIsDark] = useState<boolean>(true);
  
  // Define your song pairs here
  const [songPairs, setSongPairs] = useState<SongPair[]>([
  { track1: "/songs/maujahimauja.mp3", track2: "/songs/whatjhumka.mp3", name: "Mauja Hi Mauja × What Jhumka" },
  { track1: "/songs/TeriOre.mp3", track2: "/songs/Heeriye.mp3", name: "Teri Ore × Heeriye" },
  { track1: "/songs/Tera_Hone_laga_hoon.mp3", track2: "/songs/Senorita.mp3", name: "Tera Hone Laga Hoon × Senorita" },
  { track1: "/songs/Masakali.mp3", track2: "/songs/Chaleya.mp3", name: "Masakali × Chaleya" },
  { track1: "/songs/TumSeHi.mp3", track2: "/songs/Raabta.mp3", name: "Tum Se Hi × Raabta" },
  { track1: "/songs/AinvayiAinvayi.mp3", track2: "/songs/Kesariya.mp3", name: "Ainvayi Ainvayi × Kesariya" },
  { track1: "/songs/DesiGirl.mp3", track2: "/songs/Ghungroo.mp3", name: "Desi Girl × Ghungroo" },
  { track1: "/songs/SoniDeNakhre.mp3", track2: "/songs/LondonThumakda.mp3", name: "Soni De Nakhre × London Thumakda" },
  { track1: "/songs/It'stheTimetoDisco.mp3", track2: "/songs/SoorajDoobaHain.mp3", name: "It’s The Time To Disco × Sooraj Dooba Hai" },
  { track1: "/songs/Twist.mp3", track2: "/songs/Tainuleke.mp3", name: "Twist × Tainu Le Ke" },
  { track1: "/songs/BadtameezDil.mp3", track2: "/songs/GallanGoodiyaan.mp3", name: "Badtameez Dil × Gallan Goodiyan" },
  { track1: "/songs/SubhaHoneNaDe.mp3", track2: "/songs/CocaCola.mp3", name: "Subha Hone Na De × Coca Cola" },
  { track1: "/songs/latlaggayee.mp3", track2: "/songs/Heeriye.mp3", name: "Lat Lag Gayi × Heeriye" },
  { track1: "/songs/Kala Chashma.mp3", track2: "/songs/TammaTamma.mp3", name: "Kala Chashma × Tamma Tamma" },
  { track1: "/songs/Malhari.mp3", track2: "/songs/SherKhulGaye.mp3", name: "Malhari × Sher Khul Gaye" },
  { track1: "/songs/Tum_hi_ho.mp3", track2: "/songs/Apna_Bana_Le.mp3", name: "Tum Hi Ho × Apna Bana Le" },
  { track1: "/songs/Khalibali.mp3", track2: "/songs/Ranjha.mp3", name: "Khalibali × Ranjha" },
  { track1: "/songs/RamChaheLeela.mp3", track2: "/songs/Bebo.mp3", name: "Ram Chahe Leela × Bebo" },
  { track1: "/songs/ChikniChameli.mp3", track2: "/songs/Saudakharakhara.mp3", name: "Chikni Chameli × Sauda Khara Khara" },
  { track1: "/songs/Befikra.mp3", track2: "/songs/saturdaysaturday.mp3", name: "Befikra × Saturday Saturday" },
  { track1: "/songs/It'stheTimetoDisco.mp3", track2: "/songs/Where'sthePartyTonight.mp3", name: "It’s The Time To Disco × Where’s The Party Tonight" },
  { track1: "/songs/DolaReDola.mp3", track2: "/songs/Ghungroo.mp3", name: "Dola Re Dola × Ghungroo" },
  { track1: "/songs/IkVaariAa.mp3", track2: "/songs/Kesariya.mp3", name: "Ik Vaari Aa × Kesariya" },
  { track1: "/songs/TeraBanJaunga.mp3", track2: "/songs/Tum_hi_ho.mp3", name: "Tera Ban Jaunga × Tum Hi Ho" },
  { track1: "/songs/BomDiggy.mp3", track2: "/songs/ghafoor.mp3", name: "Bom Diggy × Ghafoor" },
]);


  // Available songs list
  const availableSongs: string[] = [
  "/songs/aankhmaarey.mp3",
  "/songs/AinvayiAinvayi.mp3",
  "/songs/Apna_Bana_Le.mp3",
  "/songs/BabyKoBassPasandHai.mp3",
  "/songs/BadtameezDil.mp3",
  "/songs/Bebo.mp3",
  "/songs/befikra.mp3",
  "/songs/bomdiggy.mp3",
  "/songs/Chaleya.mp3",
  "/songs/ChammakChallo.mp3",
  "/songs/ChikniChameli.mp3",
  "/songs/cholikepeeche.mp3",
  "/songs/CocaCola.mp3",
  "/songs/DesiGirl.mp3",
  "/songs/DolaReDola.mp3",
  "/songs/GallanGoodiyaan.mp3",
  "/songs/ghafoor.mp3",
  "/songs/Ghungroo.mp3",
  "/songs/Heeriye.mp3",
  "/songs/IkVaariAa.mp3",
  "/songs/It'stheTimetoDisco.mp3",
  "/songs/Kala Chashma.mp3",
  "/songs/Kesariya.mp3",
  "/songs/Khalibali.mp3",
  "/songs/latlaggayee.mp3",
  "/songs/LondonThumakda.mp3",
  "/songs/Malhari.mp3",
  "/songs/Masakali.mp3",
  "/songs/maujahimauja.mp3",
  "/songs/Raabta.mp3",
  "/songs/RamChaheLeela.mp3",
  "/songs/Ranjha.mp3",
  "/songs/saturdaysaturday.mp3",
  "/songs/saudakharakhara.mp3",
  "/songs/Senorita.mp3",
  "/songs/Sheilakijawani.mp3",
  "/songs/SherKhulGaye.mp3",
  "/songs/SoniDeNakhre.mp3",
  "/songs/SoorajDoobaHain.mp3",
  "/songs/SubhaHoneNaDe.mp3",
  "/songs/Tainuleke.mp3",
  "/songs/tammatamma.mp3",
  "/songs/TeraBanJaunga.mp3",
  "/songs/Tera_Hone_laga_hoon.mp3",
  "/songs/TeriOre.mp3",
  "/songs/TumSeHi.mp3",
  "/songs/Tum_hi_ho.mp3",
  "/songs/Twist.mp3",
  "/songs/whatjhumka.mp3",
  "/songs/Where'sthePartyTonight.mp3",
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

  const bgClass = isDark ? "bg-gradient-to-br from-gray-900 via-black to-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-gray-100";
  const cardBg = isDark ? "bg-gray-800/50 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const hoverBg = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-100";
  const inputBg = isDark ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300";
  const sidebarBg = isDark ? "bg-gray-900/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl";
  const playerBarBg = isDark ? "bg-gray-900/98 backdrop-blur-xl border-gray-800" : "bg-white/98 backdrop-blur-xl border-gray-200";

  return (
    <div className={`min-h-screen ${bgClass} ${textPrimary} transition-colors duration-300`}>
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row min-h-screen pb-24 lg:pb-28">
        {/* Sidebar */}
        <div className={`w-full lg:w-72 ${sidebarBg} p-4 lg:p-6 flex flex-col border-b lg:border-b-0 lg:border-r ${borderColor}`}>
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h1 className={`text-xl lg:text-2xl font-bold ${textPrimary}`}>Dual Player</h1>
              <p className={`text-xs lg:text-sm ${textSecondary}`}>Mix your tracks</p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full ${hoverBg} transition-all duration-200`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900" />
              )}
            </button>
          </div>
          
       <button
  onClick={addNewPair}
  className={`font-semibold py-2.5 lg:py-3 px-4 rounded-full 
             hover:scale-105 transition-all duration-200 mb-4 lg:mb-6 flex items-center justify-center gap-2
             bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/40
             ${isDark ? 'text-white' : 'text-green-900'}`}
>
  <Plus className={`w-4 h-4 ${isDark ? 'text-white' : 'text-green-900'}`} strokeWidth={2.5} />
  <span className="text-sm lg:text-base">Create Pair</span>
</button>







          {/* Playlist */}
          <div className="flex-1 overflow-y-auto">
            <h2 className={`text-xs lg:text-sm font-bold ${textSecondary} mb-3 uppercase tracking-wider`}>Your Pairs</h2>
            <div className="space-y-2">
              {songPairs.map((pair: SongPair, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    pauseBoth();
                    setCurrentPairIndex(index);
                  }}
                  className={`p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    index === currentPairIndex
                      ? `${isDark ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/50' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-500'}`
                      : `${hoverBg} border-2 border-transparent`
                  }`}
                >
                  <p className={`font-semibold text-sm lg:text-base truncate ${textPrimary}`}>{pair.name}</p>
                  <p className={`text-xs ${textSecondary}`}>2 tracks</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8">
          {/* Header */}
          <div className="py-6 lg:py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6">
              <div className={`w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 bg-gradient-to-br ${isDark ? 'from-purple-600 via-pink-600 to-blue-600' : 'from-purple-400 via-pink-400 to-blue-400'} rounded-2xl shadow-2xl flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform duration-300`}>
                <Music className="w-16 h-16 lg:w-24 lg:h-24 text-white/90" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-xs font-bold uppercase tracking-wider mb-2 lg:mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Dual Track Mix</p>
                <h1 className={`text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 lg:mb-4 ${isDark ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>{currentPair.name}</h1>
                <p className={`text-xs lg:text-sm ${textSecondary}`}>2 tracks • Mixed playback</p>
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="pb-6">
            <div className="mb-4 lg:mb-6">
              <div className={`hidden sm:grid grid-cols-12 gap-4 px-4 text-xs font-semibold border-b pb-3 mb-2 ${textSecondary}`} style={{borderColor: isDark ? '#374151' : '#e5e7eb'}}>
                <div className="col-span-1">#</div>
                <div className="col-span-5">TITLE</div>
                <div className="col-span-6">VOLUME</div>
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <div className={`${cardBg} rounded-xl p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-200 border ${borderColor}`}>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                  <div className={`hidden sm:block sm:col-span-1 font-medium ${textSecondary}`}>1</div>
                  <div className="sm:col-span-11 lg:col-span-5 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="sm:hidden text-xs font-bold text-green-500">Track 1</span>
                    </div>
                    <p className={`font-semibold text-sm lg:text-base ${textPrimary}`}>{currentPair.track1.split('/').pop()}</p>
                    <p className={`text-xs ${textSecondary} hidden sm:block`}>Track 1</p>
                  </div>
                  <div className="sm:col-span-12 lg:col-span-6 flex items-center gap-3">
                    <span className={`text-xs font-medium ${textSecondary} w-10`}>{Math.round(volume1 * 100)}%</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume1(parseFloat(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer transition-all"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume1 * 100}%, ${isDark ? '#374151' : '#d1d5db'} ${volume1 * 100}%, ${isDark ? '#374151' : '#d1d5db'} 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={`${cardBg} rounded-xl p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-200 border ${borderColor}`}>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                  <div className={`hidden sm:block sm:col-span-1 font-medium ${textSecondary}`}>2</div>
                  <div className="sm:col-span-11 lg:col-span-5 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="sm:hidden text-xs font-bold text-emerald-500">Track 2</span>
                    </div>
                    <p className={`font-semibold text-sm lg:text-base ${textPrimary}`}>{currentPair.track2.split('/').pop()}</p>
                    <p className={`text-xs ${textSecondary} hidden sm:block`}>Track 2</p>
                  </div>
                  <div className="sm:col-span-12 lg:col-span-6 flex items-center gap-3">
                    <span className={`text-xs font-medium ${textSecondary} w-10`}>{Math.round(volume2 * 100)}%</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume2}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume2(parseFloat(e.target.value))}
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer transition-all"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume2 * 100}%, ${isDark ? '#374151' : '#d1d5db'} ${volume2 * 100}%, ${isDark ? '#374151' : '#d1d5db'} 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Pairs Section */}
          <div className="py-6 lg:py-8">
            <h2 className={`text-xl lg:text-2xl font-bold mb-4 lg:mb-6 ${textPrimary}`}>Manage Pairs</h2>
            <div className="space-y-3 lg:space-y-4">
              {songPairs.map((pair: SongPair, index: number) => (
                <div
                  key={index}
                  className={`${cardBg} rounded-xl p-4 lg:p-5 shadow-lg border-2 transition-all duration-200 ${
                    index === currentPairIndex ? 'border-green-500 shadow-green-500/20' : borderColor
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 lg:mb-4 gap-2">
                    <input
                      type="text"
                      value={pair.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePair(index, "name", e.target.value)}
                      className={`font-semibold text-base lg:text-lg bg-transparent border-0 focus:outline-none focus:ring-0 flex-1 ${textPrimary}`}
                      placeholder="Pair name"
                    />
                    <button
                      onClick={() => deletePair(index)}
                      disabled={songPairs.length <= 1}
                      className={`hover:text-red-500 disabled:opacity-30 transition-colors duration-200 p-2 rounded-lg ${hoverBg} ${textSecondary}`}
                    >
                      <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <label className={`text-xs ${textSecondary} block mb-1.5 font-medium`}>Track 1</label>
                      <select
                        value={pair.track1}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updatePair(index, "track1", e.target.value)}
                        className={`w-full text-sm ${inputBg} border rounded-lg px-3 py-2.5 ${textPrimary} focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
                      >
                        {availableSongs.map((song: string) => (
                          <option key={song} value={song}>
                            {song.split('/').pop()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs ${textSecondary} block mb-1.5 font-medium`}>Track 2</label>
                      <select
                        value={pair.track2}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updatePair(index, "track2", e.target.value)}
                        className={`w-full text-sm ${inputBg} border rounded-lg px-3 py-2.5 ${textPrimary} focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
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
      <div className={`fixed bottom-0 left-0 right-0 ${playerBarBg} border-t px-3 lg:px-6 py-3 lg:py-4 shadow-2xl`}>
        <audio ref={audio1} src={currentPair.track1} preload="auto" />
        <audio ref={audio2} src={currentPair.track2} preload="auto" />
        
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto gap-2 lg:gap-4">
          {/* Current Track Info */}
          <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
            <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${isDark ? 'from-purple-600 to-blue-600' : 'from-purple-400 to-blue-400'} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Music className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className={`font-semibold truncate text-sm lg:text-base ${textPrimary}`}>{currentPair.name}</p>
              <p className={`text-xs ${textSecondary}`}>Dual Track Mix</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-1 lg:gap-2">
            <div className="flex items-center gap-2 lg:gap-4">
              <button
                onClick={prevPair}
                className={`${isDark ? 'text-gray-400 hover:text-green-500' : 'text-gray-600 hover:text-green-600'} transition-all duration-200 p-1.5 lg:p-2 rounded-full ${hoverBg}`}
              >
                <SkipBack className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              
              {!isPlaying ? (
  <button
    onClick={playBoth}
    className={`rounded-full p-2.5 lg:p-3 hover:scale-110 hover:shadow-lg transition-all duration-200
      ${isDark
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/50'
        : 'bg-gray-900 hover:shadow-gray-900/50'
      }`}
  >
    <Play
      className={`w-5 h-5 lg:w-6 lg:h-6 ${isDark ? 'text-white' : 'text-white'}`}
      fill="currentColor"
      color={isDark ? '#ffffff' : '#ffffff'}
    />
  </button>
) : (
  <button
    onClick={pauseBoth}
    className={`rounded-full p-2.5 lg:p-3 hover:scale-110 hover:shadow-lg transition-all duration-200
      ${isDark
        ? '!bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/50'
        : '!bg-gray-900 hover:shadow-gray-900/50'
      }`}
  >
    <Pause
      className={`w-5 h-5 lg:w-6 lg:h-6 ${isDark ? 'text-white' : 'text-white'}`}
      fill="currentColor"
      color={isDark ? '#ffffff' : '#ffffff'}
    />
  </button>
)}


              
              <button
                onClick={nextPair}
                className={`${isDark ? 'text-gray-400 hover:text-green-500' : 'text-gray-600 hover:text-green-600'} transition-all duration-200 p-1.5 lg:p-2 rounded-full ${hoverBg}`}
              >
                <SkipForward className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
            <div className={`text-xs ${textSecondary}`}>
              {currentPairIndex + 1} / {songPairs.length}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex justify-end">
            <div className={`text-xs ${textSecondary} hidden md:block`}>
              Dual playback
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}