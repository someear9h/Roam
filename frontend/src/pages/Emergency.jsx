import React, { useState } from 'react';
import { 
  Phone, MapPin, Share2, Shield, Flag, Navigation, 
  Siren, Flame, Ambulance, Headphones, MessageCircle, 
  FileText, AlertTriangle, Languages, FileHeart
} from 'lucide-react';

export default function Emergency() {
  const [isSharing, setIsSharing] = useState(false);

  return (
    <div className="flex flex-col space-y-8 pb-24">
      
      {/* --- 1. HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm tracking-wide uppercase mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Emergency Mode Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Emergency Assistance
          </h1>
          <div className="flex items-center gap-2 mt-2 text-lg text-slate-500 font-medium">
            <MapPin size={20} className="text-slate-400" />
            Detected Location: <span className="text-slate-900 font-bold">Paris, France</span>
            <button className="text-sm text-teal-600 font-bold ml-2 hover:underline">Change</button>
          </div>
        </div>
        <p className="hidden md:block text-sm text-slate-400 font-medium">Last updated: Just now</p>
      </div>

      {/* --- 2. CRITICAL ACTIONS --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Giant Call Button */}
        <div className="md:col-span-7 flex flex-col">
          <button className="group relative flex-1 w-full min-h-[180px] cursor-pointer flex flex-col items-center justify-center rounded-[2rem] bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <Phone size={48} fill="currentColor" />
              </div>
              <div className="text-center">
                <span className="block text-3xl md:text-4xl font-bold tracking-tight">Emergency Call (112)</span>
                <span className="block text-sm font-medium opacity-90 mt-1">Tap to dial local emergency services immediately</span>
              </div>
            </div>
          </button>
        </div>

        {/* Share Location Panel */}
        <div className="md:col-span-5 flex flex-col">
          <div className={`h-full flex flex-col justify-center rounded-[2rem] border p-8 shadow-sm transition-colors ${isSharing ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${isSharing ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-teal-600'}`}>
                <Share2 size={24} />
              </div>
              <h3 className="font-bold text-xl text-slate-900">Share Live Location</h3>
            </div>
            
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Securely broadcast your real-time GPS coordinates to your designated trusted contacts list.
            </p>

            <div className="flex items-center justify-between bg-white p-2 pr-3 rounded-full border border-slate-100 shadow-sm">
              <span className={`font-bold text-sm px-4 ${isSharing ? 'text-green-600' : 'text-slate-400'}`}>
                {isSharing ? 'Broadcasting Live...' : 'Broadcasting Off'}
              </span>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setIsSharing(!isSharing)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${isSharing ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isSharing ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100 my-4"></div>

      {/* --- 3. LOCAL SUPPORT GRID --- */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-teal-600 rounded-lg">
            <Shield size={24} />
          </div>
          Local Support
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Embassy Card */}
          <div className="flex flex-col rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-200 relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white font-bold text-lg flex items-center gap-2">
                <Flag size={18} /> Local Embassy
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Embassy of the United States</h3>
                <p className="text-sm text-slate-500 mt-1">2 Avenue Gabriel, 75008 Paris, France</p>
              </div>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <button className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Phone size={18} /> Call
                </button>
                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Navigation size={18} /> Directions
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Services Card */}
          <div className="flex flex-col rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-50">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Siren size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Local Emergency Services</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Verified for Paris, FR</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 flex-1">
              <EmergencyNumberRow icon={Shield} color="text-blue-600" label="Police" number="17" />
              <EmergencyNumberRow icon={Ambulance} color="text-red-600" label="Ambulance" number="15" />
              <EmergencyNumberRow icon={Flame} color="text-orange-600" label="Fire" number="18" />
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. TBO HUMAN SUPPORT BANNER (Fixed Visibility) --- */}
      <div className="rounded-[2rem] bg-blue-600 text-white p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden shadow-xl shadow-blue-500/30">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 skew-x-12 translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col gap-2 max-w-lg">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Headphones size={28} />
            TBO Human Support
          </h2>
          {/* Changed text color to white/90 so it's visible on blue background */}
          <p className="text-white/90 font-medium text-base leading-relaxed">
            Need help with your booking or facing a non-emergency issue? Our team is available 24/7 to assist you immediately.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none min-w-[150px] bg-white text-blue-600 hover:bg-blue-50 font-bold py-3.5 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
            <MessageCircle size={20} />
            Start Chat
          </button>
          <button className="flex-1 md:flex-none min-w-[150px] bg-blue-700 hover:bg-blue-800 text-white border border-white/20 font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
            <Phone size={20} />
            Call Support
          </button>
        </div>
      </div>

      {/* --- 5. FOOTER QUICK LINKS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickLink icon={FileText} label="Insurance Policy" />
        <QuickLink icon={AlertTriangle} label="Report Incident" />
        <QuickLink icon={Languages} label="Translation Help" />
        <QuickLink icon={FileHeart} label="Medical History" />
      </div>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function EmergencyNumberRow({ icon: Icon, color, label, number }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-4">
        <Icon className={color} size={20} />
        <span className="font-bold text-slate-700">{label}</span>
      </div>
      <span className="font-black text-xl text-slate-900">{number}</span>
    </div>
  );
}

function QuickLink({ icon: Icon, label }) {
  return (
    <a href="#" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white border border-slate-100 hover:border-teal-500/30 hover:shadow-md transition-all group text-center">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors">
        <Icon size={24} />
      </div>
      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
    </a>
  );
}