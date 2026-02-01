import React, { useState } from 'react';
import { Search, MapPin, Coffee, Utensils, AlertTriangle, Navigation } from 'lucide-react';

export default function LocalGuide() {
  const [activeTab, setActiveTab] = useState('food');

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark">Local Guide</h1>
          <p className="text-slate-500 mt-1">Paris • 7th Arrondissement</p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live GPS
        </div>
      </div>

      {/* --- Interactive Map Area --- */}
      <div className="relative h-64 md:h-80 w-full rounded-[2rem] overflow-hidden shadow-lg border border-slate-200 group">
        {/* Map Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-brand-dark/10"></div>
        
        {/* Floating Pins */}
        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
           <div className="bg-brand-primary text-white p-2 rounded-full shadow-xl animate-bounce">
             <Utensils size={20} />
           </div>
           <div className="bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm mt-1 text-center">Bistro</div>
        </div>
        
        <button className="absolute bottom-4 right-4 bg-white text-brand-dark px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
          <Navigation size={16} /> Open Maps
        </button>
      </div>

      {/* --- Filter Tabs --- */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Tab active={activeTab === 'food'} onClick={() => setActiveTab('food')} icon={Utensils} label="Food" />
        <Tab active={activeTab === 'scams'} onClick={() => setActiveTab('scams')} icon={AlertTriangle} label="Safety" />
        <Tab active={activeTab === 'coffee'} onClick={() => setActiveTab('coffee')} icon={Coffee} label="Cafes" />
      </div>

      {/* --- Recommendations List --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === 'food' && (
          <>
            <PlaceCard 
              name="Le Petit Cler" 
              type="French Bistro" 
              rating="4.8" 
              dist="0.2 mi" 
              img="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&q=80"
            />
             <PlaceCard 
              name="Kozy Bosquet" 
              type="Brunch & Coffee" 
              rating="4.9" 
              dist="0.5 mi" 
              img="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80"
            />
          </>
        )}

        {activeTab === 'scams' && (
           <div className="col-span-full bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
             <div className="flex items-start gap-3">
               <AlertTriangle className="text-orange-600 shrink-0" />
               <div>
                 <h3 className="font-bold text-brand-dark">Bracelet Scam Alert</h3>
                 <p className="text-sm text-slate-600 mt-1">Common near Sacré-Cœur. Do not let anyone tie a bracelet on your wrist; they will demand payment.</p>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

function Tab({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border ${
        active 
          ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25' 
          : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary/50'
      }`}
    >
      <Icon size={18} /> {label}
    </button>
  );
}

function PlaceCard({ name, type, rating, dist, img }) {
  return (
    <div className="flex bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      {/* FIXED: Added bg-slate-200 fallback color */}
      <div 
        className="w-24 h-24 bg-slate-200 rounded-xl bg-cover bg-center shrink-0" 
        style={{ backgroundImage: `url(${img})` }}
      ></div>
      <div className="ml-4 flex flex-col justify-center">
        <h3 className="font-bold text-roam-navy text-lg">{name}</h3>
        <p className="text-sm text-slate-500">{type}</p>
        <div className="flex items-center gap-3 mt-2 text-xs font-bold">
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">★ {rating}</span>
          <span className="text-slate-400">{dist}</span>
        </div>
      </div>
    </div>
  );
}