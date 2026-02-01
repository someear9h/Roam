import React, { useState } from 'react';
import { 
  X, Sun, Moon, CloudSun, Users, Minus, Plus, 
  RotateCcw, RotateCw, ArrowRight, Map, Bed, Camera, 
  Info, Maximize, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VRPreview() {
  const [activeTab, setActiveTab] = useState('hotel'); // 'hotel', 'attractions', 'neighborhood'
  const [isNight, setIsNight] = useState(false);

  // Background Images for different states
  const backgrounds = {
    hotel: isNight 
      ? "https://images.unsplash.com/photo-1541123437860-d0963004a43b?q=80&w=2000&auto=format&fit=crop" // Night Room
      : "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2000&auto=format&fit=crop", // Day Room
    neighborhood: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop", // Map View (Placeholder)
    attractions: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop" // Eiffel Tower
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-900 text-white font-sans">
      
      {/* --- 1. IMMERSIVE BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* The Image */}
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out transform scale-105"
          style={{ backgroundImage: `url('${backgrounds[activeTab]}')` }}
        ></div>
        
        {/* Gradient Overlays for Readability */}
        <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isNight ? 'bg-black/60' : 'bg-gradient-to-b from-black/40 via-transparent to-black/80'}`}></div>
        
        {/* Map Overlay Pattern (Only for Neighborhood tab) */}
        {activeTab === 'neighborhood' && (
           <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Paris_map_1860.jpg/1280px-Paris_map_1860.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        )}
      </div>

      {/* --- 2. INTERACTIVE HOTSPOTS (Only visible in Hotel Mode) --- */}
      {activeTab === 'hotel' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Hotspot top="50%" left="25%" label="King Size Bed" />
          <Hotspot top="40%" right="30%" label="Balcony View" />
          <Hotspot bottom="30%" right="10%" label="Minibar" />
        </div>
      )}

      {/* --- 3. UI OVERLAY LAYER --- */}
      <div className="relative z-20 flex flex-col h-full pointer-events-none justify-between">
        
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-6 pointer-events-auto">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Maximize size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight drop-shadow-md">TBO Experience</h1>
              <p className="text-[10px] text-white/80 font-bold tracking-widest uppercase">VR Preview Mode</p>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-3">
            {/* Day/Night Toggle */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center">
              <button 
                onClick={() => setIsNight(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!isNight ? 'bg-white/20 text-yellow-300 shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                <Sun size={16} />
              </button>
              <button 
                onClick={() => setIsNight(true)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isNight ? 'bg-white/20 text-blue-300 shadow-sm' : 'text-white/50 hover:text-white'}`}
              >
                <Moon size={16} />
              </button>
            </div>

            {/* Close Button */}
            <Link to="/" className="w-10 h-10 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all text-white">
              <X size={20} />
            </Link>
          </div>
        </header>

        {/* MIDDLE INFO CARD (Hidden on mobile) */}
        <div className="flex-1 flex items-center justify-end px-8 pointer-events-none">
          <div className="pointer-events-auto hidden lg:block">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl w-[280px] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="font-bold text-lg mb-1">{activeTab === 'neighborhood' ? 'Paris 7th Arr.' : 'Parisian Suite'}</h3>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                {activeTab === 'neighborhood' 
                  ? 'Explore the vibrant streets, cafes, and landmarks surrounding your stay.'
                  : 'Experience luxury with a direct view of the Eiffel Tower from your balcony.'}
              </p>
              
              <div className="space-y-3">
                <InfoRow icon={CloudSun} color="text-yellow-400" label="Weather" value="22°C Sunny" />
                <InfoRow icon={Users} color="text-green-400" label="Crowd Level" value="Low" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTROLS BAR */}
        <div className="pointer-events-auto pb-8 pt-4 px-6 w-full flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          
          {/* Left: Navigation Tabs */}
          <div className="flex flex-col gap-4 w-full md:w-auto">
            {/* Mobile Stats (Only visible on small screens) */}
            <div className="lg:hidden flex items-center justify-between bg-slate-900/60 backdrop-blur-md border border-white/10 p-3 rounded-xl mb-2">
              <div className="flex items-center gap-2">
                <CloudSun size={16} className="text-yellow-400" />
                <span className="text-sm font-bold">22°C</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-green-400" />
                <span className="text-sm font-bold">Low Crowd</span>
              </div>
            </div>

            {/* The Tabs */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 flex gap-1 w-full md:w-auto overflow-x-auto">
              <TabButton 
                active={activeTab === 'hotel'} 
                onClick={() => setActiveTab('hotel')} 
                icon={Bed} 
                label="Hotel Room" 
              />
              <TabButton 
                active={activeTab === 'attractions'} 
                onClick={() => setActiveTab('attractions')} 
                icon={Camera} 
                label="Attractions" 
              />
              <TabButton 
                active={activeTab === 'neighborhood'} 
                onClick={() => setActiveTab('neighborhood')} 
                icon={Map} 
                label="Neighborhood" 
              />
            </div>
          </div>

          {/* Center: Zoom Controls (Hidden on mobile) */}
          <div className="hidden md:flex bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-full p-2 items-center gap-2 absolute left-1/2 -translate-x-1/2 bottom-8">
            <IconButton icon={Minus} />
            <div className="w-px h-4 bg-white/20"></div>
            <IconButton icon={RotateCcw} />
            <IconButton icon={RotateCw} />
            <div className="w-px h-4 bg-white/20"></div>
            <IconButton icon={Plus} />
          </div>

          {/* Right: Price & CTA */}
          <div className="w-full md:w-auto">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center justify-between gap-6 md:min-w-[320px]">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">$450</span>
                  <span className="text-xs text-gray-400">/night</span>
                </div>
              </div>
              <button className="bg-white text-brand-blue hover:bg-gray-100 transition-colors px-5 py-3 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-white/10">
                <span>Book Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Hotspot({ top, left, right, bottom, label }) {
  return (
    <button 
      className="absolute group pointer-events-auto"
      style={{ top, left, right, bottom }}
    >
      <div className="relative flex items-center justify-center w-8 h-8">
        <span className="absolute w-full h-full bg-white rounded-full opacity-30 animate-ping"></span>
        <div className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 whitespace-nowrap shadow-xl">
          {label}
        </div>
        {/* Arrow */}
        <div className="w-2 h-2 bg-slate-900/80 border-r border-b border-white/10 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
      </div>
    </button>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 md:flex-none flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
        active 
          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' 
          : 'hover:bg-white/10 text-gray-400 hover:text-white'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function IconButton({ icon: Icon }) {
  return (
    <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors">
      <Icon size={18} />
    </button>
  );
}

function InfoRow({ icon: Icon, color, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}