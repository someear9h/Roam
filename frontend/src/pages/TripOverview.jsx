import React from 'react';
import { 
  Calendar, Users, Edit3, Map, Check, Plane, MapPin, 
  Bell, Car, ArrowRight, CloudSun, Wind, Droplets, 
  Navigation, Phone, Info, Star, LifeBuoy
} from 'lucide-react';

export default function TripOverview() {
  return (
    <div className="space-y-8 pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-[2rem] shadow-xl group h-[320px]">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-sm font-bold uppercase tracking-wider">
                <Calendar size={14} />
                <span>Oct 12 - Oct 20</span>
                <span>•</span>
                <Users size={14} />
                <span>2 Travelers</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Paris Getaway</h1>
              <p className="text-gray-300 font-medium">Trip ID: #TBO-88392-PAR</p>
            </div>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2">
              <Edit3 size={16} />
              Manage Trip
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Timeline & Feed */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 2. JOURNEY TIMELINE (Stepper) */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Map className="text-teal-600" size={20} />
                Journey Timeline
              </h3>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">On Schedule</span>
            </div>
            
            <div className="relative px-4">
              {/* Connecting Line */}
              <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
              <div className="absolute top-5 left-0 w-1/2 h-1 bg-teal-600 rounded-full transition-all duration-1000"></div>
              
              <div className="relative z-10 flex justify-between w-full">
                {/* Step 1: Done */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md ring-4 ring-white">
                    <Check size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">Preparation</p>
                    <p className="text-xs text-slate-400">Completed</p>
                  </div>
                </div>
                
                {/* Step 2: Active */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-600 opacity-20"></span>
                    <Plane size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-teal-600">Travel Day</p>
                    <p className="text-xs font-medium text-teal-600">Active Now</p>
                  </div>
                </div>
                
                {/* Step 3: Upcoming */}
                <div className="flex flex-col items-center gap-3 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-400 flex items-center justify-center shadow-sm ring-4 ring-white">
                    <MapPin size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">Destination</p>
                    <p className="text-xs text-slate-400">Upcoming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ACTIVITY FEED */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Today's Schedule</h2>
              <span className="text-sm text-slate-500">October 12, 2023</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Alert Card */}
              <div className="bg-blue-50 border-l-4 border-teal-600 rounded-r-xl p-4 flex gap-4 items-start shadow-sm">
                <div className="p-2 bg-white rounded-full text-teal-600 shrink-0">
                  <Bell size={20} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-900">Web Check-in Closing Soon</h4>
                  <p className="text-sm text-slate-600 mt-1">Flight AF123 closes in <span className="font-bold text-teal-600">2 hours</span>.</p>
                </div>
                <button className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                  Check In
                </button>
              </div>

              {/* Timeline Item 1 */}
              <TimelineItem 
                time="08:00 AM" 
                icon={Car} 
                title="Airport Transfer" 
                desc="Uber Black scheduled from Home to JFK Terminal 4." 
                status="Confirmed"
                isLast={false}
              />
              
              {/* Timeline Item 2 (Active) */}
              <div className="bg-white rounded-[2rem] p-6 border border-teal-600/20 shadow-lg relative overflow-hidden flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600"></div>
                <div className="flex flex-col items-center text-teal-600 min-w-[80px]">
                  <span className="text-xl font-bold">10:30</span>
                  <span className="text-xs font-bold opacity-70">AM</span>
                </div>
                <div className="w-full sm:w-px h-px sm:h-12 bg-slate-200"></div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="text-teal-600" size={20} />
                    <h4 className="text-lg font-bold text-slate-900">Flight Departure</h4>
                  </div>
                  <p className="text-sm text-slate-500">Air France AF123 • JFK to CDG • Seat 4A</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-teal-600/30">
                    Boarding Pass
                  </button>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <TimelineItem 
                time="11:45 PM" 
                icon={Navigation} 
                title="Hotel Check-in" 
                desc="Le Metropolitan Paris Tour Eiffel." 
                status="Upcoming"
                isLast={true}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-400 to-teal-500 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
             <div className="relative z-10 flex justify-between items-start">
               <div>
                 <h4 className="font-bold text-lg">Paris, FR</h4>
                 <p className="text-blue-100 text-sm">Partly Cloudy</p>
               </div>
               <CloudSun size={40} />
             </div>
             <div className="relative z-10 mt-6 flex items-end gap-2">
               <span className="text-5xl font-bold">14°</span>
               <span className="text-xl font-medium mb-1">C</span>
             </div>
             <div className="mt-4 flex justify-between text-sm text-blue-100 border-t border-white/20 pt-3">
               <WeatherDetail label="Humidity" value="42%" />
               <WeatherDetail label="Wind" value="12km/h" />
               <WeatherDetail label="Precip" value="10%" />
             </div>
          </div>

          {/* Flight Status */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden p-6">
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Plane className="text-teal-600" size={20} /> Flight Status
                </h4>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">On Time</span>
             </div>
             <div className="flex justify-between items-center mb-6 px-2">
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">JFK</div>
                  <div className="text-xs text-slate-400 font-bold">New York</div>
                </div>
                <div className="flex flex-col items-center px-2 w-full">
                  <div className="text-xs text-slate-400 mb-1">7h 20m</div>
                  <div className="w-full h-[2px] bg-slate-100 relative">
                     <div className="absolute top-0 left-0 h-full w-1/2 bg-teal-600"></div>
                     <Plane size={16} className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-teal-600 rotate-90 bg-white p-0.5" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">CDG</div>
                  <div className="text-xs text-slate-400 font-bold">Paris</div>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                <FlightDetail label="Departure" value="10:30 AM" />
                <FlightDetail label="Gate" value="B24" align="right" highlight />
                <FlightDetail label="Terminal" value="4" />
                <FlightDetail label="Seat" value="4A" align="right" />
             </div>
          </div>

          {/* Hotel Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group">
            <div className="h-32 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center relative">
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-slate-900 mb-1">Le Metropolitan Paris</h4>
              <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                <MapPin size={14} /> 10 Place de Mexico
              </p>
              <div className="flex gap-2">
                <ActionButton icon={Navigation} label="Directions" />
                <ActionButton icon={Phone} label="Call" />
                <ActionButton icon={Info} label="Info" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Support Button */}
      <button className="fixed bottom-24 md:bottom-8 right-8 z-40 bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-500/30 rounded-full h-14 pl-4 pr-6 flex items-center gap-3 transition-all transform hover:scale-105">
        <div className="bg-white/20 rounded-full p-2">
          <LifeBuoy size={24} />
        </div>
        <span className="font-bold">Get Support</span>
      </button>

    </div>
  );
}

// --- SUB COMPONENTS FOR CLEANER CODE ---

function TimelineItem({ time, icon: Icon, title, desc, status, isLast }) {
  return (
    <div className={`bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center ${isLast ? 'opacity-70' : ''}`}>
      <div className="flex flex-col items-center text-slate-800 min-w-[80px]">
        <span className="text-lg font-bold">{time.split(' ')[0]}</span>
        <span className="text-xs font-bold text-slate-400">{time.split(' ')[1]}</span>
      </div>
      <div className="w-full sm:w-px h-px sm:h-12 bg-slate-100"></div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="text-slate-400" size={18} />
          <h4 className="font-bold text-slate-900">{title}</h4>
        </div>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      <div className="shrink-0">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
           {status}
        </span>
      </div>
    </div>
  );
}

function WeatherDetail({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function FlightDetail({ label, value, align = 'left', highlight = false }) {
  return (
    <div className={`text-${align}`}>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className={`font-bold ${highlight ? 'text-teal-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex-1 flex flex-col items-center gap-1 text-xs font-medium text-slate-600 hover:text-teal-600 transition-colors group">
      <div className="p-2 rounded-full bg-slate-50 group-hover:bg-teal-50 transition-colors">
        <Icon size={18} />
      </div>
      {label}
    </button>
  );
}