import React, { useState } from 'react';
import { 
  MapPin, RefreshCw, Footprints, Accessibility, Palette, 
  ExternalLink, Ticket, Car, ChevronRight, Coffee, Utensils
} from 'lucide-react';

export default function Itinerary() {
  const [activeDay, setActiveDay] = useState(1);

  // --- DATA ---
  const itineraryData = [
    {
      id: 1,
      time: "09:00 AM",
      type: "activity",
      category: "Breakfast",
      title: "Breakfast at Blue Bottle Coffee",
      desc: "Start your day with a perfectly brewed coffee and artisanal pastries in a modern, airy setting.",
      // FIXED IMAGE
      image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
      link: "View Menu",
      icon: Coffee
    },
    {
      type: "buffer",
      mode: "walk",
      duration: "15 min walk",
      detail: "Scenic route via Park Ave"
    },
    {
      id: 2,
      time: "10:30 AM",
      type: "activity",
      category: "Museum",
      title: "Museum of Modern Art Tour",
      desc: "A guided journey through the evolution of contemporary art. Your accessibility preferences have been noted for the elevator route.",
      // FIXED IMAGE
      image: "https://images.unsplash.com/photo-1566054757965-8c4085344c96?auto=format&fit=crop&q=80&w=800",
      ticketIncluded: true,
      tags: ["Guided Tour", "Accessible"],
      cta: "View Ticket Details"
    },
    {
      type: "buffer",
      mode: "transit",
      duration: "30 min transit",
      detail: "Uber XL estimated $25"
    },
    {
      id: 3,
      time: "01:00 PM",
      type: "activity",
      category: "Lunch",
      title: "Lunch at Le Bernardin",
      desc: "Experience world-class French seafood in a luxurious setting. Reservation confirmed for 2.",
      // FIXED IMAGE
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
      link: "Manage Reservation",
      icon: Utensils
    }
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span className="hover:text-roam-teal cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-roam-teal cursor-pointer">My Trips</span>
          <ChevronRight size={14} />
          <span className="font-bold text-roam-navy">Paris Adventure</span>
        </div>
        <h1 className="text-3xl font-extrabold text-roam-navy">Personalized Itinerary</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
          {/* Map Widget */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="text-roam-gold" size={20} />
                <span className="font-bold text-lg">Paris, France</span>
              </div>
              <p className="text-xs text-white/80 pl-7">View full route map</p>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-roam-navy text-lg">Trip Overview</h3>
              <p className="text-sm text-slate-500">Oct 12 - Oct 15 • 3 Days, 2 Nights</p>
            </div>
            <div className="h-px bg-slate-100"></div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-roam-navy uppercase tracking-wider">Your Preferences</h4>
              <PreferenceItem icon={Footprints} title="Pace" value="Moderate Pace" />
              <PreferenceItem icon={Accessibility} title="Accessibility" value="Accessible Routes" />
              <PreferenceItem icon={Palette} title="Interests" value="Museums & Art" />
            </div>
          </div>

          {/* Regenerate Button (FIXED COLOR: Uses roam-teal) */}
          <button className="w-full bg-roam-teal hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group">
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            Regenerate Itinerary
          </button>
        </aside>

        {/* MAIN TIMELINE */}
        <div className="lg:col-span-8">
          <div className="sticky top-28 bg-[#F8FAFC]/95 backdrop-blur-sm z-30 pt-2 pb-6 border-b border-slate-200 mb-8 overflow-x-auto">
            <div className="flex gap-8 min-w-max">
              <DayTab active={activeDay === 1} day="1" date="Oct 12" title="Downtown" onClick={() => setActiveDay(1)} />
              <DayTab active={activeDay === 2} day="2" date="Oct 13" title="Historic District" onClick={() => setActiveDay(2)} />
              <DayTab active={activeDay === 3} day="3" date="Oct 14" title="Departure" onClick={() => setActiveDay(3)} />
            </div>
          </div>

          <div className="relative pl-4 md:pl-8 space-y-8">
            <div className="absolute left-[23px] md:left-[39px] top-4 bottom-0 w-[2px] bg-slate-200"></div>
            {itineraryData.map((item, index) => (
              <React.Fragment key={index}>
                {item.type === 'activity' ? <ActivityCard item={item} /> : <BufferItem item={item} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function PreferenceItem({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-slate-100 rounded-lg text-roam-teal"><Icon size={20} /></div>
      <div><h5 className="text-sm font-bold text-roam-navy">{title}</h5><p className="text-xs text-slate-500 mt-0.5">{value}</p></div>
    </div>
  );
}

function DayTab({ active, day, date, title, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center pb-3 min-w-[120px] transition-all border-b-[3px] ${active ? 'border-roam-teal text-roam-navy' : 'border-transparent text-slate-400 hover:text-roam-teal'}`}>
      <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${active ? 'text-roam-teal' : ''}`}>{date}</span>
      <span className="text-lg font-bold">Day {day}: {title}</span>
    </button>
  );
}

function ActivityCard({ item }) {
  return (
    <div className="relative pl-10 group">
      <div className="absolute left-[12px] md:left-[28px] top-6 w-[22px] h-[22px] rounded-full border-[4px] border-white bg-roam-teal shadow-sm z-10"></div>
      <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all">
        {/* FIXED IMAGE: Added bg-slate-200 fallback */}
        <div className="w-full sm:w-48 h-48 sm:h-auto bg-slate-200 bg-cover bg-center relative shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-roam-navy mb-2">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.desc}</p>
          </div>
          <div className="flex items-center gap-4">
            {item.cta ? (
              <button className="text-sm font-bold text-roam-teal bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg transition-colors">{item.cta}</button>
            ) : (
              <button className="flex items-center gap-1 text-xs font-bold text-roam-teal hover:underline uppercase tracking-wide">{item.link} <ExternalLink size={14} /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BufferItem({ item }) {
  return (
    <div className="relative pl-10 py-2">
      <div className="absolute left-[14px] md:left-[30px] top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8FAFC] z-10 flex items-center justify-center">
        {item.mode === 'walk' ? <Footprints size={16} className="text-slate-400" /> : <Car size={16} className="text-slate-400" />}
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200">
        <span className="text-xs font-bold text-slate-600">{item.duration}</span>
      </div>
    </div>
  );
}