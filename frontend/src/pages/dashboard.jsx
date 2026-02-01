import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plane, Hotel, ArrowRight, CheckCircle, 
  AlertTriangle, Map, MessageSquare, Shield, Smartphone, MoreHorizontal, Clock, CreditCard, Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const currentTrip = trips[0]; // Get first trip as current

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      // Note: You may need to add a GET endpoint to fetch all user trips
      // For now, this is a placeholder - adjust based on your backend
      setTrips([{
        id: 1,
        destination: 'Paris, France',
        start_date: new Date('2026-02-09'),
        end_date: new Date('2026-02-16'),
        booking_id: '#RM-7822K9',
        status: 'Confirmed'
      }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading your trips...</div>;
  }

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}`;
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. REALISTIC HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-roam-navy tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Traveler'}.
          </h1>
          {currentTrip && (
            <p className="text-slate-500 mt-1 font-medium">
              Your trip to {currentTrip.destination} is coming up in <span className="font-bold text-roam-teal">
                {Math.ceil((new Date(currentTrip.start_date) - new Date()) / (1000 * 60 * 60 * 24))} days
              </span>.
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
           {/* Weather Widget - Subtle & Clean */}
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-medium text-slate-600">
            <span>⛅</span> {currentTrip?.destination || 'Destination'}: 18°C
          </div>
          {/* Local Time Widget */}
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-medium text-slate-600 hidden sm:flex">
            <Clock size={16} className="text-slate-400" /> {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} 
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {currentTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- MAIN COLUMN (2/3 width) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 2. TRIP SNAPSHOT CARD (Functional & Dense) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Top Banner Image - Shorter height for realism */}
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-roam-navy/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="bg-roam-teal/90 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                    {currentTrip.status}
                  </span>
                  <h2 className="text-3xl font-bold">{currentTrip.destination}</h2>
                </div>
                 <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-md text-white transition-colors">
                    <MoreHorizontal size={20} />
                 </button>
              </div>

              {/* Trip Details Summary */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between pb-6 border-b border-slate-100">
                   <div className="flex gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl h-fit"><Calendar className="text-roam-teal" size={24} /></div>
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dates</p>
                         <p className="text-lg font-bold text-roam-navy">
                           {formatDate(currentTrip.start_date)} - {formatDate(currentTrip.end_date)}
                         </p>
                         <p className="text-sm text-slate-500">
                           {Math.ceil((new Date(currentTrip.end_date) - new Date(currentTrip.start_date)) / (1000 * 60 * 60 * 24))} Days
                         </p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl h-fit"><CreditCard className="text-roam-navy" size={24} /></div>
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Ref</p>
                         <p className="text-lg font-bold text-roam-navy font-mono">{currentTrip.booking_id}</p>
                         <Link to="/trip" className="text-sm text-roam-teal font-bold hover:underline">View Details</Link>
                      </div>
                   </div>
                </div>

                {/* Up Next Action Bar */}
                <div className="pt-6 flex items-center justify-between">
                   <div>
                      <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                         <Clock size={16} className="text-orange-500" /> Up Next: Flight Check-in
                      </p>
                      <p className="text-xs text-slate-500 pl-6">Opens in 2 days at 10:30 AM</p>
                   </div>
                   <div className="flex gap-3">
                      <button className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">Share Trip</button>
                      <Link to="/itinerary">
                         <button className="px-5 py-2.5 bg-roam-navy text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
                            Manage Booking <ArrowRight size={16} />
                         </button>
                      </Link>
                   </div>
                </div>
              </div>
            </div>

            {/* 3. "BEFORE YOU GO" CHECKLIST (Actionable & Clean) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-roam-navy">Before You Go</h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">3 of 4 Complete</span>
              </div>
              
              <div className="space-y-3">
                 {/* Completed Items (Subtle) */}
                 <ChecklistItem status="done" title="Passport & Visa details confirmed" />
                 <ChecklistItem status="done" title="Hotel accommodation booked" />
                 <ChecklistItem status="done" title="Travel insurance policy active" />
                 
                 {/* Pending Item (Highlighted) */}
                 <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-100 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center bg-white">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">Select Flight Seats</p>
                          <p className="text-xs text-slate-500">Flight AF1234 • Air France</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:border-roam-teal hover:text-roam-teal transition-all shadow-sm">
                       Select Now
                    </button>
                 </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (1/3 width) --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 4. QUICK ACCESS (Grid) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Access</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionCard to="/vr" icon={Smartphone} label="VR Preview" />
                <QuickActionCard to="/itinerary" icon={Map} label="Itinerary" />
                <QuickActionCard to="/assistant" icon={MessageSquare} label="AI Assistant" />
                <QuickActionCard to="/emergency" icon={Shield} label="Emergency Info" />
              </div>
            </div>

            {/* 5. UPGRADE OFFER (More professional look) */}
            <div className="group rounded-2xl p-1 relative overflow-hidden bg-gradient-to-br from-roam-teal via-blue-600 to-roam-navy shadow-lg">
               <div className="bg-white rounded-[14px] p-5 relative z-10 h-full flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Ticket size={20} /></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Limited Offer</span>
                     </div>
                     <h4 className="font-bold text-roam-navy text-lg mb-1">Business Class Upgrade</h4>
                     <p className="text-slate-500 text-sm leading-relaxed">
                        Upgrade your outbound flight starting from $199 or 15k points.
                     </p>
                  </div>
                  <button className="mt-6 w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-roam-teal transition-colors flex items-center justify-center gap-2 text-sm">
                     View Options <ArrowRight size={16} />
                  </button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ChecklistItem({ status, title }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 opacity-70">
      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
         <CheckCircle size={16} />
      </div>
      <span className="font-medium text-slate-700 line-through decoration-slate-300">{title}</span>
    </div>
  );
}

function QuickActionCard({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-roam-teal/10 border border-slate-100 hover:border-roam-teal/30 transition-all group text-center">
      <Icon className="text-slate-500 group-hover:text-roam-teal mb-2" size={24} />
      <span className="font-bold text-slate-700 text-sm group-hover:text-roam-teal">{label}</span>
    </Link>
  );
}